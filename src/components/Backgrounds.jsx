import { useEffect, useState } from 'react';
import Grainient from './reactbits/Grainient/Grainient';

// Full-page backdrop: a soft sky-blue gradient (styled in CSS).
export function PageBackdrop() {
  return <div className="page-backdrop" aria-hidden="true" />;
}

// The scene inside the frame: icy blue grainy gradient with a hint of Shopify green top-left.
// The animated version runs only on devices with a mouse and without "reduce motion";
// phones and tablets get a still gradient that looks the same but costs no battery.
// (Grainient itself also pauses whenever the tab is hidden or the frame is off-screen.)
// `still`: always use the CSS gradient (for secondary panels, so the page runs one WebGL scene at most).
export function FrameBackground({ still = false }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setAnimated(!still && query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [still]);

  return (
    <div className="frame-bg" aria-hidden="true">
      <div className="frame-bg__still" />
      {animated && (
        <Grainient
          colors={['#e4f2cf', '#e0f2fe', '#7dd3fc', '#38bdf8', '#f0f9ff']}
          angle={150}
          speed={0.5}
          flow={0.7}
          silk={0.5}
          grainAmount={0.06}
          grainAnimated={false}
          softness={1}
          dpr={1}
          interactive
          clickSwirl={false}
        />
      )}
      <div className="frame-bg__veil" />
    </div>
  );
}
