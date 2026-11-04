import Grainient from './reactbits/Grainient/Grainient';

// Full-page backdrop: a soft sky-blue gradient (styled in CSS).
export function PageBackdrop() {
  return <div className="page-backdrop" aria-hidden="true" />;
}

// The scene inside the frame: icy blue grainy gradient.
export function FrameBackground() {
  return (
    <div className="frame-bg" aria-hidden="true">
      <Grainient
        colors={['#ffffff', '#e0f2fe', '#7dd3fc', '#38bdf8', '#e4f2cf']}
        angle={150}
        speed={0.5}
        flow={0.7}
        silk={0.5}
        grainAmount={0.06}
        softness={1}
        interactive
        clickSwirl={false}
      />
      <div className="frame-bg__veil" />
    </div>
  );
}
