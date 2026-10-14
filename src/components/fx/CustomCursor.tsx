import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './SmoothScroll';

const INTERACTIVE =
  'a, button, [role="button"], select, label, summary, input[type="range"], input[type="checkbox"], input[type="radio"], [data-cursor="hover"]';
const TEXT_ENTRY = 'input, textarea, [contenteditable="true"]';

/**
 * Lagging cursor ring with difference blending. Grows over interactive
 * elements and shows a label inside elements tagged with data-cursor-label.
 * The native cursor stays visible so form controls remain fully usable.
 */
export const CustomCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        x = tx;
        y = ty;
        seen = true;
      }
      ring.dataset.hidden = 'false';

      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest('[data-cursor-label]');
      let state = 'default';
      if (labelled) {
        state = 'label';
        const text = labelled.getAttribute('data-cursor-label') || '';
        if (label.textContent !== text) label.textContent = text;
      } else if (target?.closest(TEXT_ENTRY) && !target.closest('input[type="range"], input[type="checkbox"], input[type="radio"]')) {
        state = 'text';
      } else if (target?.closest(INTERACTIVE)) {
        state = 'hover';
      }
      if (ring.dataset.state !== state) ring.dataset.state = state;
    };

    const onLeave = () => {
      ring.dataset.hidden = 'true';
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ringRef} className="cursor-ring" data-hidden="true" data-state="default" aria-hidden="true">
      <span ref={labelRef} className="cursor-ring-label" />
    </div>
  );
};
