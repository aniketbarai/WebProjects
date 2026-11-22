import { useCallback, useLayoutEffect, useRef } from 'react';
import { mountNativeReveals } from './scrollReveals';

const sectionIds = ['hero', 'projects', 'about', 'skills', 'experience', 'education', 'contact'];
const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

function mountNativeSpy(onSectionChange, mobileMotion) {
  let frame = 0;
  const cards = mobileMotion ? [...document.querySelectorAll('.project-card')] : [];
  const work = mobileMotion ? document.querySelector('.work-section') : null;
  if (mobileMotion) work?.classList.add('work-section--mobile-motion');
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
    const workRect = mobileMotion && work?.getBoundingClientRect();
    if (workRect && workRect.bottom > 0 && workRect.top < window.innerHeight) {
      const midpoint = window.innerHeight / 2;
      // Batch reads before writes so the images glide without layout thrashing.
      const visible = cards.map(card => ({ card, rect: card.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight);
      visible.forEach(({ card, rect }) => {
        const distance = midpoint - (rect.top + rect.height / 2);
        const amount = clamp(-1, 1, distance / (midpoint + rect.height / 2)) * 10;
        card.style.setProperty('--mobile-parallax', `${amount.toFixed(2)}px`);
      });
    }
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
    work?.classList.remove('work-section--mobile-motion');
    cards.forEach(card => card.style.removeProperty('--mobile-parallax'));
  };
}

function mountNativeScroll({ onSectionChange, reduced, compact, lowPower }) {
  const stopSpy = mountNativeSpy(onSectionChange, compact && !reduced && !lowPower);
  const stopReveals = reduced || lowPower ? () => {} : mountNativeReveals();
  return () => { stopReveals(); stopSpy(); };
}

export function useScrollExperience({ suspended, reduced, compact, lowPower, onSectionChange }) {
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
    // The hero can show beneath the intro without starting scroll or 3D work.
    if (suspended) return undefined;
    // Mobile, reduced-motion, and low-power devices don't fetch GSAP or Lenis.
    // Native scrolling keeps all sections readable; motion-enabled mobile gets
    // small IntersectionObserver reveals without the desktop animation bundle.
    if (compact || reduced || lowPower) return mountNativeScroll({ onSectionChange, reduced, compact, lowPower });

    let active = true;
    let cleanup = () => {};
    import('./desktopScrollExperience.js').then(({ mountDesktopScroll }) => {
      if (!active) return;
      // The hero already appeared behind the intro; never hide and reanimate it.
      cleanup = mountDesktopScroll({ lenisRef, pinRef, onSectionChange });
    }).catch(() => {
      // Progressive enhancement: site navigation still works without the
      // animation chunk (for example if a browser extension blocks it).
      if (active) cleanup = mountNativeScroll({ onSectionChange, reduced, compact, lowPower });
    });
    return () => { active = false; cleanup(); };
  }, [suspended, reduced, compact, lowPower, onSectionChange]);

  return { scrollTo, focusCard, dragTo, lenisRef };
}
