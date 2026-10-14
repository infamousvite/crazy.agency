/**
 * [data-reveal]: l'elemento compare la prima volta che entra nello schermo.
 * Senza JavaScript o con movimento ridotto tutto è già visibile (vedi CSS).
 */
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal], .tilt');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}
