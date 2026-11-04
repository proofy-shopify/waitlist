import LogoLoop from './reactbits/LogoLoop/LogoLoop';
import BrandIcon from './BrandIcon';
import { transitions } from '../content';

// Decorative slider: each item is a realistic ad comment → the store review Proofy makes from it.
// All people and stores are made up.

const initials = s =>
  s
    .replace(/[^A-Za-z. ]/g, '')
    .split(/[ .]/)
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const AVATARS = [
  'linear-gradient(160deg,#f3c9a8,#c98a6b 60%,#9a6150)',
  'linear-gradient(160deg,#b9d4f2,#6f93c4 60%,#3f5f8f)',
  'linear-gradient(160deg,#f6d6a0,#d79b52 60%,#9b6430)',
  'linear-gradient(160deg,#cfe3c4,#7fa66a 60%,#4c6c3d)',
  'linear-gradient(160deg,#e3c9f0,#a77dc4 60%,#6c4a8a)',
  'linear-gradient(160deg,#f2c2c9,#cf7b8a 60%,#8f4656)'
];

function Silhouette() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">
      <circle cx="16" cy="12.5" r="5.5" fill="rgba(255,255,255,0.92)" />
      <path d="M5.5 29c1.6-6 5.6-9 10.5-9s8.9 3 10.5 9" fill="rgba(255,255,255,0.92)" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path d="M3.5 8.4 6.5 11.2 12.5 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heart({ color = '#e0245e', size = 11 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.4-9.3C1.3 8 3.3 4.5 6.8 4.5c2 0 3.4 1.1 4.2 2.3h2c.8-1.2 2.2-2.3 4.2-2.3 3.5 0 5.5 3.5 4.2 6.7-1.9 4.7-9.4 9.3-9.4 9.3z"
        fill={color}
      />
    </svg>
  );
}

function Picked() {
  return (
    <span className="fl-picked ct-picked">
      <Check /> Picked
    </span>
  );
}

function InstagramComment({ t, i }) {
  return (
    <div className="ig">
      <Picked />
      <div className="ig__sheet">
        <span className="ig__grabber" />
        <span className="ig__title">Comments</span>
      </div>
      <div className="ig__row">
        <span className="ig__ring">
          <span className="ig__avatar" style={{ background: AVATARS[i % AVATARS.length] }}>
            <Silhouette />
          </span>
        </span>
        <div className="ig__body">
          <p className="ig__head">
            <strong>{t.handle}</strong>
            <span className="ig__time">{t.time}</span>
          </p>
          <p className="ig__text">{t.text}</p>
          <p className="ig__actions">
            <span>Reply</span>
            <span>See translation</span>
          </p>
        </div>
        <span className="ig__like">
          <Heart color="#ff3040" size={14} />
          <span>{t.likes}</span>
        </span>
      </div>
    </div>
  );
}

function FacebookComment({ t, i }) {
  return (
    <div className="fb">
      <Picked />
      <div className="fb__row">
        <span className="fb__avatar" style={{ background: AVATARS[i % AVATARS.length] }}>
          <Silhouette />
        </span>
        <div className="fb__body">
          <div className="fb__bubble">
            <strong>{t.name}</strong>
            <p>{t.text}</p>
            <span className="fb__reacts">
              <span className="fb__react fb__react--like">
                <svg viewBox="0 0 16 16" width="9" height="9" aria-hidden="true">
                  <path d="M2 7h2.5v7H2zM6 14h5.6c.8 0 1.4-.5 1.6-1.2l1.1-4.1c.2-.9-.4-1.7-1.3-1.7H10l.5-2.6c.1-.8-.5-1.4-1.2-1.4L6 7z" fill="#fff" />
                </svg>
              </span>
              <span className="fb__react fb__react--love">
                <Heart color="#fff" size={8} />
              </span>
              <span className="fb__count">{t.likes}</span>
            </span>
          </div>
          <p className="fb__actions">
            <span className="fb__time">{t.time}</span>
            <span>Like</span>
            <span>Reply</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function StoreReview({ t }) {
  const who = t.platform === 'instagram' ? `@${t.handle}` : t.name;
  return (
    <div className="fl-review ct-review">
      <div className="fl-review__top">
        <BrandIcon name="Shopify" size={12} />
        <span>{t.product}</span>
      </div>
      <p className="fl-review__text">“{t.text}”</p>
      <div className="fl-review__by">
        <span className="fl-review__avatar">{initials(t.handle || t.name)}</span>
        <span className="fl-name">{who}</span>
        <span className="fl-src">
          <BrandIcon name={t.platform === 'instagram' ? 'Instagram' : 'Facebook'} size={10} />
        </span>
        <span className="fl-likes">
          <Heart /> {t.likes}
        </span>
      </div>
    </div>
  );
}

function Pair({ t, i }) {
  return (
    <div className="ct-pair">
      <div className="ct-pair__from">
        {t.platform === 'instagram' ? <InstagramComment t={t} i={i} /> : <FacebookComment t={t} i={i} />}
      </div>
      <span className="ct-pair__arrow">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="ct-pair__to">
        <StoreReview t={t} />
      </div>
    </div>
  );
}

export default function CommentTransitions() {
  return (
    <div className="ct-slider" aria-hidden="true">
      <LogoLoop
        logos={transitions.map((t, i) => ({ node: <Pair t={t} i={i} />, title: t.text }))}
        speed={38}
        gap={28}
        logoHeight={148}
        fadeOut
        fadeOutWidth={0.08}
        pauseOnHover={false}
        reducedMotionSpeed={20}
        draggable
        wheel
        intro={false}
        ariaLabel="Example comments turned into store reviews"
      />
    </div>
  );
}
