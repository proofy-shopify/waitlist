import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Cloudflare Turnstile (invisible bot check). Only active when VITE_TURNSTILE_SITE_KEY is set;
// otherwise it renders nothing. With "interaction-only" it stays hidden unless Cloudflare
// needs the visitor to click a checkbox.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loader;
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return loader;
}

export const turnstileEnabled = Boolean(SITE_KEY);

const Turnstile = forwardRef(function Turnstile({ onToken }, ref) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetRef.current !== null) window.turnstile?.reset(widgetRef.current);
      onTokenRef.current('');
    }
  }));

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    let cancelled = false;
    loadScript()
      .then(turnstile => {
        if (cancelled || !boxRef.current) return;
        widgetRef.current = turnstile.render(boxRef.current, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          size: 'flexible',
          callback: token => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current('')
        });
      })
      .catch(() => {
        /* blocked by an extension: the server will ask them to refresh */
      });
    return () => {
      cancelled = true;
      if (widgetRef.current !== null) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={boxRef} className="turnstile" />;
});

export default Turnstile;
