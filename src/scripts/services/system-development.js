
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-scroll-target]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const selector = trigger.getAttribute('data-scroll-target');
      const target = selector ? document.querySelector(selector) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
