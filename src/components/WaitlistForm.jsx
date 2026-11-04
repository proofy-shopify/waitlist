import { useId, useRef, useState } from 'react';
import { joinWaitlist } from '../lib/waitlist';
import Turnstile from './Turnstile';
import { hero } from '../content';

function MailIcon() {
  return (
    <svg className="waitlist__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7.5 7.1 5.1a1.6 1.6 0 0 0 1.8 0L20 7.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WaitlistForm({ joinedEmail, onJoined, onReset }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | error
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);

  if (joinedEmail) {
    return (
      <div className="joined" role="status">
        <span className="joined__pill">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="var(--blue)" />
            <path d="M6 10.4 8.7 13 14 7.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          You’re on the list as <strong>{joinedEmail}</strong>
        </span>
        <button type="button" className="joined__reset" onClick={onReset}>
          Use another email
        </button>
      </div>
    );
  }

  const sending = state === 'sending';

  const onSubmit = async event => {
    event.preventDefault();
    if (sending) return;
    setError('');
    setState('sending');
    try {
      const result = await joinWaitlist({ email, source: 'hero', honeypot, turnstileToken });
      setState('idle');
      onJoined(email.trim().toLowerCase(), result);
      setEmail('');
    } catch (err) {
      setError(err.message);
      setState('error');
    } finally {
      turnstileRef.current?.reset();
    }
  };

  return (
    <form className="waitlist" onSubmit={onSubmit} noValidate>
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <div className={`waitlist__field${state === 'error' ? ' is-invalid' : ''}`}>
        <div className="waitlist__input">
          <MailIcon />
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={hero.placeholder}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (state === 'error') setState('idle');
            }}
            aria-invalid={state === 'error'}
            aria-describedby={state === 'error' ? errorId : undefined}
            disabled={sending}
            required
          />
        </div>
        <input
          className="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="company_website"
          id="waitlist-hp"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
        />
        <button type="submit" className="waitlist__button" disabled={sending} aria-busy={sending}>
          {sending ? 'Joining…' : hero.button}
        </button>
      </div>
      <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />
      {state === 'error' ? (
        <p className="waitlist__error" id={errorId} role="alert">
          {error}
        </p>
      ) : (
        <p className="waitlist__privacy">
          {hero.privacy}
          {hero.privacyUrl && (
            <>
              {' '}
              <a href={hero.privacyUrl} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </>
          )}
        </p>
      )}
    </form>
  );
}
