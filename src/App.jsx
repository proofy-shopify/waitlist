// App shell shared by every page: waitlist state, email-link handling (?confirm= / ?unsubscribe=)
// and the success modal. The page itself is passed in (see main.jsx and entry-server.jsx).
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaitlistContext } from './waitlistContext';
import { captureUtm, confirmSignup, unsubscribe } from './lib/waitlist';

// The modal (and its animation library) is only downloaded the first time it opens,
// which keeps the landing pages light.
const SuccessModal = lazy(() => import('./components/SuccessModal'));

export default function App({ children }) {
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

  const onReset = useCallback(() => setJoinedEmail(''), []);

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
  // Stays mounted after the first open so the closing animation can play.
  const [modalUsed, setModalUsed] = useState(false);
  if (modal.open && !modalUsed) setModalUsed(true);
  const waitlist = useMemo(() => ({ joinedEmail, onJoined, onReset }), [joinedEmail, onJoined, onReset]);

  return (
    <WaitlistContext.Provider value={waitlist}>
      {children}
      {modalUsed && (
        <Suspense fallback={null}>
          <SuccessModal
            open={modal.open}
            screen={modal.screen}
            email={joinedEmail}
            busy={busy}
            onAction={onModalAction}
            onClose={closeModal}
          />
        </Suspense>
      )}
    </WaitlistContext.Provider>
  );
}
