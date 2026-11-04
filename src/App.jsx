import { useCallback, useEffect, useRef, useState } from 'react';
import BlurText from './components/reactbits/BlurText/BlurText';

import { PageBackdrop, FrameBackground } from './components/Backgrounds';
import WaitlistForm from './components/WaitlistForm';
import SuccessModal from './components/SuccessModal';
import CommentTransitions from './components/CommentTransitions';
import { brand, hero, footer } from './content';
import { captureUtm, confirmSignup, unsubscribe } from './lib/waitlist';

// Shopify bag mark (glyph from Simple Icons), shown in Shopify green.
function ShopifyMark({ fill = '#95bf47', decorative = false }) {
  return (
    <svg
      className="shopify-mark"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Shopify'}
      aria-hidden={decorative || undefined}
    >
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" fill={fill} />
    </svg>
  );
}

export default function App() {
  const [joinedEmail, setJoinedEmail] = useState('');
  const [modal, setModal] = useState({ open: false, screen: 'joined' });
  const [busy, setBusy] = useState(false);
  const unsubTokenRef = useRef('');

  // Links from the emails land here as ?confirm=TOKEN or ?unsubscribe=TOKEN.
  useEffect(() => {
    captureUtm();
    const params = new URLSearchParams(window.location.search);
    const confirmToken = params.get('confirm');
    const unsubToken = params.get('unsubscribe');
    if (!confirmToken && !unsubToken) return;

    // Take the token out of the address bar so it isn't bookmarked or shared.
    params.delete('confirm');
    params.delete('unsubscribe');
    const rest = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${rest ? `?${rest}` : ''}${window.location.hash}`);

    if (unsubToken) {
      unsubTokenRef.current = unsubToken;
      setModal({ open: true, screen: 'unsubscribeAsk' });
      return;
    }
    confirmSignup(confirmToken)
      .then(status => setModal({ open: true, screen: ['confirmed', 'already'].includes(status) ? status : 'invalid' }))
      .catch(() => setModal({ open: true, screen: 'error' }));
  }, []);

  const onJoined = useCallback((email, result) => {
    setJoinedEmail(email);
    setModal({ open: true, screen: result?.confirm ? 'checkInbox' : 'joined' });
  }, []);

  const onModalAction = useCallback(async () => {
    if (modal.screen !== 'unsubscribeAsk') return;
    setBusy(true);
    try {
      const status = await unsubscribe(unsubTokenRef.current);
      setModal({ open: true, screen: status === 'invalid' ? 'invalid' : 'unsubscribed' });
    } catch {
      setModal({ open: true, screen: 'error' });
    } finally {
      setBusy(false);
    }
  }, [modal.screen]);

  const closeModal = useCallback(() => setModal(m => ({ ...m, open: false })), []);

  return (
    <>
      <PageBackdrop />
      <main className="stage">
        <div className="device">
          <div className="device__screen">
            <FrameBackground />

            <section className="hero" aria-labelledby="hero-title">
              <p className="badge">
                <span className="badge__row">
                  <span className="badge__brand">{brand.name}</span>
                  <ShopifyMark />
                  <span className="badge__note">{hero.badge}</span>
                </span>
                {/* Metallic shine: a white copy of the content, shown only inside a moving diagonal band */}
                <span className="badge__row badge__shine" aria-hidden="true">
                  <span className="badge__brand">{brand.name}</span>
                  <ShopifyMark fill="#ffffff" decorative />
                  <span className="badge__note">{hero.badge}</span>
                </span>
              </p>

              <h1 id="hero-title" className="hero__title">
                <BlurText
                  as="span"
                  text={hero.titleDark}
                  className="hero__dark"
                  delay={70}
                  animateBy="words"
                  direction="top"
                  stepDuration={0.38}
                />
                <BlurText
                  as="span"
                  text={hero.titleGrey}
                  className="hero__grey"
                  delay={70}
                  animateBy="words"
                  direction="top"
                  stepDuration={0.38}
                />
              </h1>

              <p className="hero__sub">{hero.sub}</p>

              <WaitlistForm joinedEmail={joinedEmail} onJoined={onJoined} onReset={() => setJoinedEmail('')} />
              <CommentTransitions />
            </section>
          </div>
        </div>

        <footer className="captions">
          <p>
            {footer.left[0]}
            <br />
            {footer.left[1]}
          </p>
          <p className="captions__center">
            {footer.center[0]}
            <br />
            {footer.center[1]}
          </p>
          <p className="captions__right">
            {footer.right[0]}
            <br />
            {footer.right[1]}
          </p>
        </footer>
      </main>

      <SuccessModal
        open={modal.open}
        screen={modal.screen}
        email={joinedEmail}
        busy={busy}
        onAction={onModalAction}
        onClose={closeModal}
      />
    </>
  );
}
