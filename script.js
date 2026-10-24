document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealTargets = document.querySelectorAll(
  '.hero-copy, .hero-details, .preview-section, .experience, .about, .contact, .preview-heading, .intro-column, .preview-card, .timeline-item, .skill-groups > div, .education-line, .contact > *'
);
revealTargets.forEach((element, index) => {
  element.classList.add('reveal-on-scroll');
  element.style.setProperty('--reveal-index', index % 5);
});

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

const previewStrip = document.querySelector('.preview-strip');
const previewTrack = document.querySelector('.preview-track');
let previewOffset = 0;
const scrollPreview = (direction, smooth = true) => {
  const distance = Math.min(previewStrip.clientWidth * 0.68, 330);
  const maxOffset = Math.max(0, previewTrack.scrollWidth - previewStrip.clientWidth);
  const atEnd = previewOffset >= maxOffset - 8;
  previewOffset = direction === 'right' && atEnd ? 0 : Math.max(0, Math.min(maxOffset, previewOffset + (direction === 'right' ? distance : -distance)));
  previewTrack.style.transitionDuration = smooth ? '1.1s' : '0s';
  previewTrack.style.transform = `translateX(-${previewOffset}px)`;
};

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    scrollPreview(button.dataset.scroll);
  });
});

const movePreviewByDelta = (delta) => {
  const maxOffset = Math.max(0, previewTrack.scrollWidth - previewStrip.clientWidth);
  previewOffset = Math.max(0, Math.min(maxOffset, previewOffset + delta));
  previewTrack.style.transitionDuration = '.15s';
  previewTrack.style.transform = `translateX(-${previewOffset}px)`;
};

previewStrip.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
  const horizontalDelta = event.deltaX;
  event.preventDefault();
  movePreviewByDelta(horizontalDelta);
}, { passive: false });

document.addEventListener('wheel', (event) => {
  if (previewStrip.contains(event.target)) return;
  const horizontalDelta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
  if (!horizontalDelta) return;
  event.preventDefault();
  movePreviewByDelta(horizontalDelta);
}, { passive: false });