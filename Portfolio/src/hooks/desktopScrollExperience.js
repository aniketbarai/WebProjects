import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sceneState, sceneStops } from '../sceneState';

gsap.registerPlugin(ScrollTrigger);

const sectionIds = ['hero', 'projects', 'about', 'skills', 'experience', 'education', 'contact'];
const sceneKeys = ['x', 'y', 'z', 'scale', 'rotation', 'morph', 'cameraX', 'cameraY', 'cameraZ'];
const clamp = gsap.utils.clamp;

// Dynamically loaded only on capable, motion-enabled desktops. One cleanup
// disposes every trigger, ticker listener and Lenis instance on resize/unmount.
export function mountDesktopScroll({ lenisRef, pinRef, onSectionChange, animateHero }) {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, autoRaf: false });
  lenisRef.current = lenis;
  const sync = () => ScrollTrigger.update();
  lenis.on('scroll', sync);
  const tick = time => lenis.raf(time * 1000); // GSAP seconds → Lenis milliseconds
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  let refreshStops;
  let refreshRaf;
  let mm;
  let fontsCancelled = false;
  const context = gsap.context(() => {
    const progressLine = document.querySelector('.nav-progress');
    let stops = [];

    refreshStops = () => {
      stops = sceneStops.map(stop => {
        const element = document.getElementById(stop.id);
        return { ...stop, at: element ? window.scrollY + element.getBoundingClientRect().top + window.innerHeight * 0.35 : 0 };
      });
      if (stops.length) stops[0].at = 0;
    };

    const updateScene = scroll => {
      if (stops.length < 2) return;
      const position = scroll + window.innerHeight * 0.35;
      let i = 0;
      while (i < stops.length - 2 && position > stops[i + 1].at) i++;
      const from = stops[i];
      const to = stops[i + 1];
      const t = clamp(0, 1, (position - from.at) / Math.max(1, to.at - from.at));
      // Damping in useFrame smooths this interpolation at every stop.
      sceneKeys.forEach(key => { sceneState.target[key] = gsap.utils.interpolate(from[key], to[key], t); });
    };

    ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate(self) {
        updateScene(self.scroll());
        if (progressLine) progressLine.style.transform = `scaleX(${self.progress})`;
      },
      onRefresh(self) {
        refreshStops();
        updateScene(self.scroll());
        if (progressLine) progressLine.style.transform = `scaleX(${self.progress})`;
      },
    });
    ScrollTrigger.addEventListener('refresh', refreshStops);

    sectionIds.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 48%',
        end: 'bottom 48%',
        onEnter: () => onSectionChange(id),
        onEnterBack: () => onSectionChange(id),
      });
    });

    // Slow initial connections shouldn't hide the hero while a chunk loads.
    if (animateHero) {
      gsap.fromTo('.hero-line-inner',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.08 });
      gsap.fromTo('.hero-reveal',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.18 });
    }

    gsap.utils.toArray('[data-reveal-lines]').forEach(group => {
      gsap.fromTo(group.querySelectorAll('.line-inner'), { yPercent: 110 }, {
        yPercent: 0, stagger: 0.11, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 87%', once: true },
      });
    });
    gsap.utils.toArray('[data-reveal]').forEach(element => {
      gsap.fromTo(element, { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
    gsap.utils.toArray('[data-unveil]').forEach(element => {
      gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
    gsap.utils.toArray('[data-parallax]').forEach(element => {
      gsap.fromTo(element, { yPercent: 18 }, {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    gsap.utils.toArray('[data-count]').forEach(element => {
      const value = Number(element.dataset.count);
      const decimals = Number(element.dataset.decimals || 0);
      const suffix = element.dataset.suffix || '';
      const counter = { value: 0 };
      element.textContent = (0).toFixed(decimals) + suffix;
      gsap.to(counter, {
        value, duration: 1.5, ease: 'power3.out',
        onUpdate: () => { element.textContent = counter.value.toFixed(decimals) + suffix; },
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    });

    mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const pinElement = document.querySelector('.projects-pin');
      const rail = document.querySelector('.project-rail');
      if (!pinElement || !rail) return undefined;
      const distance = () => Math.max(1, rail.scrollWidth - window.innerWidth);
      const tween = gsap.to(rail, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: pinElement,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          refreshPriority: 2, // Measure pin spacing before later sections.
          invalidateOnRefresh: true,
          onRefresh: self => { pinRef.current = { trigger: self, distance: distance() }; },
        },
      });
      pinRef.current = { trigger: tween.scrollTrigger, distance: distance() };
      return () => { pinRef.current = null; };
    });

    // A font swap can change headline and rail measurements.
    document.fonts?.ready.then(() => { if (!fontsCancelled) ScrollTrigger.refresh(); });
    refreshRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
  }, document.querySelector('#root'));

  return () => {
    fontsCancelled = true;
    cancelAnimationFrame(refreshRaf);
    ScrollTrigger.removeEventListener('refresh', refreshStops);
    mm?.revert();
    context.revert();
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33); // Restore GSAP's default after Lenis stops.
    lenis.destroy();
    lenisRef.current = null;
    pinRef.current = null;
  };
}
