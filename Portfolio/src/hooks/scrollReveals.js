// Light native scroll reveals. Keep content visible until enhancement mounts;
// an unavailable observer leaves everything readable.
export function stageReveals(elements) {
  return elements.filter(element => {
    const rect = element.getBoundingClientRect();
    // Don't hide content already on screen or cards already passed in the rail.
    if (!rect.width || !rect.height || rect.right <= 0 || (
      rect.top < window.innerHeight * 0.92 && rect.bottom > 0 &&
      rect.left < window.innerWidth * 0.92 && rect.right > 0
    )) return false;
    element.classList.add('scroll-reveal', 'scroll-pending');
    return true;
  });
}

export function reveal(element) {
  element.classList.remove('scroll-pending');
}

export function clearReveals(elements) {
  elements.forEach(element => {
    element.classList.remove('scroll-pending', 'scroll-reveal');
    // A preference/viewport change should not leave an old fade running.
    element.getAnimations?.().forEach(animation => {
      if (['opacity', 'translate', 'scale'].includes(animation.transitionProperty)) animation.cancel();
    });
  });
}

export function mountNativeReveals() {
  if (typeof window.IntersectionObserver !== 'function') return () => {};
  const staged = stageReveals([
    ...document.querySelectorAll('[data-reveal], [data-reveal-lines], .project-card'),
  ]);
  const stagedSet = new Set(staged);
  let observer;
  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -8% 0px' });
    staged.forEach(element => observer.observe(element));
  } catch {
    observer?.disconnect();
    clearReveals(staged);
    return () => {};
  }

  // Tabbing directly into an offscreen card/link reveals it immediately.
  const onFocus = event => {
    const element = event.target.closest?.('.scroll-pending');
    if (!stagedSet.has(element)) return;
    reveal(element);
    observer.unobserve(element);
  };
  document.addEventListener('focusin', onFocus);
  return () => {
    document.removeEventListener('focusin', onFocus);
    observer.disconnect();
    clearReveals(staged);
  };
}
