
document.addEventListener('DOMContentLoaded', () => {
  const { body } = document;
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const faqButtons = document.querySelectorAll('.faq-question');
  const contactForm = document.querySelector('.contact-form');
  const revealables = Array.from(document.querySelectorAll('[data-reveal]'));
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  const countElements = Array.from(document.querySelectorAll('[data-count-to]'));
  const spotlightCards = Array.from(document.querySelectorAll('[data-spotlight]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const numberFormatter = new Intl.NumberFormat('ja-JP');

  const syncNavShadow = () => {
    if (!nav) {
      return;
    }

    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  const setMenuState = (isOpen) => {
    if (!toggle || !mobileMenu) {
      return;
    }

    body.classList.toggle('menu-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  };

  const revealElement = (element) => {
    element.classList.add('is-visible');
  };

  const setStaggerDelays = () => {
    staggerGroups.forEach((group) => {
      const step = Number(group.getAttribute('data-stagger-step')) || 80;

      Array.from(group.children)
        .filter((element) => element.matches('[data-reveal]'))
        .forEach((element, index) => {
          element.style.setProperty('--stagger', `${index * step}ms`);
        });
    });
  };

  const setFinalCount = (element) => {
    const countTo = Number(element.dataset.countTo);
    element.textContent = numberFormatter.format(countTo);
  };

  const animateCount = (element) => {
    if (element.dataset.counted === 'true') {
      return;
    }

    const countTo = Number(element.dataset.countTo);
    const duration = Number(element.dataset.countDuration) || 1400;
    const startedAt = performance.now();

    element.dataset.counted = 'true';

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      const currentValue = Math.round(countTo * eased);

      element.textContent = numberFormatter.format(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const setupRevealAnimations = () => {
    if (prefersReducedMotion) {
      revealables.forEach(revealElement);
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -10% 0px',
    });

    revealables.forEach((element) => {
      revealObserver.observe(element);
    });
  };

  const setupCountAnimations = () => {
    if (prefersReducedMotion) {
      countElements.forEach(setFinalCount);
      return;
    }

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.7,
    });

    countElements.forEach((element) => {
      countObserver.observe(element);
    });
  };

  const setupSpotlights = () => {
    if (prefersReducedMotion || !hasFinePointer) {
      return;
    }

    spotlightCards.forEach((card) => {
      const syncPointer = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--pointer-x', `${x}px`);
        card.style.setProperty('--pointer-y', `${y}px`);
      };

      card.addEventListener('pointerenter', syncPointer);
      card.addEventListener('pointermove', syncPointer);
    });
  };

  if (nav) {
    syncNavShadow();
    window.addEventListener('scroll', syncNavShadow, { passive: true });
  }

  setStaggerDelays();
  setupRevealAnimations();
  setupCountAnimations();
  setupSpotlights();

  if (toggle && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
      setMenuState(!body.classList.contains('menu-open'));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && body.classList.contains('menu-open')) {
        setMenuState(false);
      }
    });
  }

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach((otherButton) => {
        const answer = document.getElementById(otherButton.getAttribute('aria-controls'));
        otherButton.setAttribute('aria-expanded', 'false');
        if (answer) {
          answer.hidden = true;
        }
      });

      if (!isOpen) {
        const answer = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.hidden = false;
        }
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }
});
