/**
 * [data-magnet]: l'elemento si sposta appena verso il mouse quando ci si
 * avvicina, e torna al suo posto quando ci si allontana. Solo con mouse vero
 * e senza "riduci movimento". Il movimento è interpolato (niente scatti).
 */
export function initMagnet() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const core = el.querySelector<HTMLElement>('[data-magnet-core]');
    const zone = el.parentElement ?? el;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, last = 0;
    const tick = (now: number) => {
      // stessa velocità a 30, 60 o 144 fotogrammi al secondo
      const dt = Math.min(100, last ? now - last : 16.67); last = now;
      const k = 1 - Math.pow(1 - 0.14, dt / 16.67);
      x += (tx - x) * k; y += (ty - y) * k;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (core) core.style.translate = `${(x * 0.35).toFixed(2)}px ${(y * 0.35).toFixed(2)}px`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    zone.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const reach = r.width * 1.1;
      const pull = d < reach ? 1 - d / reach : 0;
      tx = dx * 0.32 * pull; ty = dy * 0.32 * pull;
      kick();
    });
    zone.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
  });
}
