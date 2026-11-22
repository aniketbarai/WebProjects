import { useCallback, useLayoutEffect, useRef } from 'react';

const sectionIds = ['hero', 'projects', 'about', 'skills', 'experience', 'education', 'contact'];
const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

function mountNativeSpy(onSectionChange) {
  let frame = 0;
  const update = () => {
    const center = window.innerHeight * 0.48;
    const current = sectionIds.find(id => {
      const rect = document.getElementById(id)?.getBoundingClientRect();
      return rect && rect.top <= center && rect.bottom > center;
    });
    onSectionChange(current || (window.scrollY ? 'contact' : 'hero'));
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = document.querySelector('.nav-progress');
    if (progress) progress.style.transform = `scaleX(${window.scrollY / max})`;
  };
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
  };
}

export function useScrollExperience({ reduced, compact, lowPower, onSectionChange }) {
  const lenisRef = useRef(null);
  const pinRef = useRef(null);

  const scrollTo = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    // A pinned rail must reach the top, not stop below the sticky header.
    const offset = id === 'projects' && pinRef.current ? 0 : 76;
    const top = window.scrollY + element.getBoundingClientRect().top - offset;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
  }, [reduced]);

  // Keep keyboard focus inside the visible part of a translated project rail.
  const focusCard = useCallback((index) => {
    const pin = pinRef.current;
    if (!pin) return;
    const card = document.querySelector(`[data-project-index="${index}"]`);
    if (!card) return;
    const desiredX = card.offsetLeft - Math.max(32, (window.innerWidth - card.offsetWidth) / 2);
    const progress = clamp(0, 1, desiredX / Math.max(1, pin.distance));
    const top = pin.trigger.start + progress * (pin.trigger.end - pin.trigger.start);
    if (Math.abs(window.scrollY - top) < window.innerWidth * 0.12) return;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 0.75 });
    else window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const dragTo = useCallback((top) => {
    const pin = pinRef.current;
    if (!pin) return;
    const next = clamp(pin.trigger.start, pin.trigger.end, top);
    if (lenisRef.current) lenisRef.current.scrollTo(next, { immediate: true });
    else window.scrollTo(0, next);
  }, []);

  useLayoutEffect(() => {
    // Mobile, reduced-motion, and low-power devices don't fetch GSAP or Lenis.
    // Native scrolling keeps all sections readable and minimizes startup work.
    if (compact || reduced || lowPower) return mountNativeSpy(onSectionChange);

    let active = true;
    let cleanup = () => {};
    const start = performance.now();
    import('./desktopScrollExperience.js').then(({ mountDesktopScroll }) => {
      if (!active) return;
      cleanup = mountDesktopScroll({
        lenisRef, pinRef, onSectionChange,
        animateHero: performance.now() - start < 700,
      });
    }).catch(() => {
      // Progressive enhancement: site navigation still works without the
      // animation chunk (for example if a browser extension blocks it).
      if (active) cleanup = mountNativeSpy(onSectionChange);
    });
    return () => { active = false; cleanup(); };
  }, [reduced, compact, lowPower, onSectionChange]);

  return { scrollTo, focusCard, dragTo, lenisRef };
}
