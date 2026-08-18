const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

const dropdownItems = document.querySelectorAll('.has-dropdown');

const closeDropdowns = (except = null) => {
  dropdownItems.forEach((item) => {
    if (item !== except) {
      item.classList.remove('is-open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
};

dropdownItems.forEach((item) => {
  const trigger = item.querySelector('.nav-trigger');
  trigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    const shouldOpen = !item.classList.contains('is-open');
    closeDropdowns();
    item.classList.toggle('is-open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest('.main-nav')) closeDropdowns();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns();
    document.querySelector('.nav-trigger:focus')?.blur();
  }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}
