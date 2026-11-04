import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { screens } from '../content';

function Glyph({ icon }) {
  if (icon === 'mail') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <rect className="check__stroke" x="5" y="7" width="14" height="10.5" rx="2.2" />
        <path className="check__path" d="m6 8.6 5.2 3.8a1.4 1.4 0 0 0 1.6 0L18 8.6" />
      </svg>
    );
  }
  if (icon === 'alert') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path className="check__path" d="M12 7.2v6" />
        <circle cx="12" cy="16.6" r="1.25" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path className="check__path" d="M6.5 12.5 10.2 16 17.5 8.5" />
    </svg>
  );
}

// `screen` is a key of `screens` in content.js. `email` fills {email} in the body.
export default function SuccessModal({ open, screen = 'joined', email = '', busy = false, onAction, onClose }) {
  const closeRef = useRef(null);
  const reduce = useReducedMotion();
  const s = screens[screen] || screens.joined;

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    closeRef.current?.focus({ focusVisible: false });
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [open, onClose]);

  const body = s.body.replace('{email}', email || 'your inbox');
  const [before, after] = s.body.includes('{email}') && email ? s.body.split('{email}') : [body, null];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget && !busy) onClose();
          }}
        >
          <motion.div
            key={screen}
            className="modal__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            aria-describedby="success-body"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.22 }}
          >
            <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="Close" disabled={busy}>
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <div className={`check check--${s.icon}`} aria-hidden="true">
              <span className="check__halo" />
              <span className="check__tile">
                <span className="check__orb">
                  <Glyph icon={s.icon} />
                </span>
              </span>
            </div>

            <h2 id="success-title" className="modal__title">
              {s.titleLead} <span className="accent">{s.titleAccent}</span>
            </h2>
            <p id="success-body" className="modal__body">
              {after !== null ? (
                <>
                  {before}
                  <strong>{email}</strong>
                  {after}
                </>
              ) : (
                body
              )}
            </p>

            {s.action && (
              <div className="modal__actions">
                <button type="button" className="modal__primary" onClick={onAction} disabled={busy} aria-busy={busy}>
                  {busy ? 'Working…' : s.action}
                </button>
                <button type="button" className="modal__secondary" onClick={onClose} disabled={busy}>
                  {s.cancel}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
