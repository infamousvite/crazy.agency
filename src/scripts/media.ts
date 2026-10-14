/**
 * Video delle card: partono quando sono visibili (o al passaggio del mouse
 * se hanno data-hover-play) e si fermano fuori dallo schermo.
 */
export function initMedia() {
  const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-autoplay], video[data-hover-play]'));
  if (!vids.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // su touch non c'è hover: i video "al passaggio" partono quando sono visibili
  const touch = window.matchMedia('(hover: none)').matches;
  const load = (v: HTMLVideoElement) => {
    if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) {
        load(v);
        if ((v.dataset.autoplay !== undefined || (touch && v.dataset.hoverPlay !== undefined)) && !reduced) {
          v.play().then(() => v.classList.add('is-playing')).catch(() => {});
        }
      } else v.pause();
    });
  }, { rootMargin: '200px' });
  vids.forEach((v) => {
    io.observe(v);
    if (v.dataset.hoverPlay !== undefined && !reduced) {
      const host = v.closest<HTMLElement>('[data-hover-host]') ?? v;
      host.addEventListener('pointerenter', () => { load(v); v.play().catch(() => {}); });
      host.addEventListener('pointerleave', () => v.pause());
    }
  });
}
