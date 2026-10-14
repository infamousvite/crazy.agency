/**
 * Logo cliccabile (footer): il punto salta accanto alla z, la z lo calcia,
 * lui fa l'orbita attorno a "zy" (dietro e davanti alle lettere) e torna
 * al suo posto con il saltello. Stesso movimento dell'intro della home.
 * Con "riduci movimento" il clic non fa nulla.
 */
import { LOGO } from '../data/logo';
import { INTRO, ballAt, ballTransform, kickAngle } from './logo-motion';

const HOP_IN = 0.4; // secondi per saltare dalla fine della parola accanto alla z

export function initLogoPlay() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-logo-play]').forEach((btn) => {
    const z = btn.querySelector<SVGElement>('[data-logo-z]');
    const back = btn.querySelector<SVGElement>('[data-dot="back"]');
    const front = btn.querySelector<SVGElement>('[data-dot="front"]');
    if (!z || !back || !front) return;
    const zBase = `translate(${LOGO.letters.find((l) => l.ch === 'z')!.x} 0)`;
    const pivot = `${LOGO.zPivot[0]} ${LOGO.zPivot[1]}`;
    let playing = false;

    btn.addEventListener('click', () => {
      if (playing) return;
      playing = true;
      const t0 = performance.now();
      const tStart = INTRO.kick - 0.05; // si parte un attimo prima del calcio
      const frame = (now: number) => {
        const e = (now - t0) / 1000;
        let b;
        let kick = 0;
        if (e < HOP_IN) {
          // salto all'indietro: dalla posizione a riposo fino accanto alla z
          const u = e / HOP_IN, k = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          const x0 = LOGO.dot.x, x1 = LOGO.dotStart.x, y = LOGO.dot.y;
          b = { x: x0 + (x1 - x0) * k, y: y - Math.sin(Math.PI * u) * 420, sx: 1, sy: 1, front: true, alpha: 1 };
        } else {
          const t = tStart + (e - HOP_IN);
          b = ballAt(t);
          kick = kickAngle(t);
          if (t >= INTRO.end) {
            b = { x: LOGO.dot.x, y: LOGO.dot.y, sx: 1, sy: 1, front: true, alpha: 1 };
            kick = 0;
            playing = false;
          }
        }
        z.setAttribute('transform', `${zBase} rotate(${(LOGO.zTilt + kick).toFixed(2)} ${pivot})`);
        const tr = ballTransform(b);
        front.setAttribute('transform', tr); back.setAttribute('transform', tr);
        front.style.opacity = b.front ? '1' : '0';
        back.style.opacity = b.front ? '0' : '1';
        if (playing) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  });
}
