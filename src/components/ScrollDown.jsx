// Floating "scroll down" button (homepage, bottom right). Each click glides to the next section;
// the ring fills as you scroll, and the button fades away once the end of the page is reached.
import { useEffect, useRef, useState } from 'react';

const STOPS = '.sections > .section, .sections > #faq, .sections > .cta, .site-footer';
const R = 22;
const CIRC = 2 * Math.PI * R;

export default function ScrollDown() {
  const [atEnd, setAtEnd] = useState(false);
  const ringRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(CIRC * (1 - progress));
      setAtEnd(max - window.scrollY < 120);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const onClick = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduce ? 'auto' : 'smooth';
    const next = [...document.querySelectorAll(STOPS)]
      .map(el => el.getBoundingClientRect().top - 16)
      .find(top => top > 24);
    if (next === undefined) window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
    else window.scrollBy({ top: next, behavior });
  };

  return (
    <button
      type="button"
      className={`scroll-down${atEnd ? ' scroll-down--hidden' : ''}`}
      onClick={onClick}
      aria-label="Scroll to the next section"
      aria-hidden={atEnd || undefined}
      tabIndex={atEnd ? -1 : 0}
    >
      <svg className="scroll-down__ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={R} className="scroll-down__track" />
        <circle
          ref={ringRef}
          cx="26"
          cy="26"
          r={R}
          className="scroll-down__progress"
          style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
        />
      </svg>
      <svg className="scroll-down__arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
