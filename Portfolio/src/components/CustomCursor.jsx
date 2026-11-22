import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor({ enabled }) {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    document.body.classList.add('has-custom-cursor');
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
    const onMove = event => {
      moveX(event.clientX); moveY(event.clientY);
      cursor.classList.add('is-visible');
      const target = event.target instanceof Element ? event.target.closest('[data-cursor]') : null;
      const next = target?.dataset.cursor || '';
      label.textContent = next;
      cursor.classList.toggle('is-expanded', Boolean(next));
    };
    const hide = () => cursor.classList.remove('is-visible');
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);

    const magnetic = [...document.querySelectorAll('[data-magnetic]')];
    const listeners = magnetic.map(element => {
      const move = event => {
        const rect = element.getBoundingClientRect();
        gsap.to(element, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.15,
          y: (event.clientY - rect.top - rect.height / 2) * 0.15,
          duration: 0.4, ease: 'power3.out', overwrite: true,
        });
      };
      const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: 'expo.out', overwrite: true });
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', leave);
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); gsap.set(element, { clearProps: 'x,y' }); };
    });

    return () => {
      cursor.classList.remove('is-visible', 'is-expanded');
      label.textContent = '';
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      listeners.forEach(cleanup => cleanup());
      gsap.killTweensOf(cursor);
    };
  }, [enabled]);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span ref={labelRef} /></div>;
}
