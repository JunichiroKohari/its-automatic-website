document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.Reveal !== 'function') {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.Reveal.initialize({
    controls: true,
    progress: true,
    center: true,
    hash: true,
    slideNumber: 'c/t',
    transition: prefersReducedMotion ? 'none' : 'slide',
    backgroundTransition: prefersReducedMotion ? 'none' : 'fade',
    autoAnimate: !prefersReducedMotion,
    controlsTutorial: false,
    navigationMode: 'default',
    keyboard: true,
    touch: true,
    margin: 0.06,
    width: 1600,
    height: 1000,
  });
});
