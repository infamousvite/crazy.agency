/**
 * Il movimento del logo: la z calcia il punto, che fa un'orbita ellittica
 * attorno a "zy" (passa dietro le lettere in alto, davanti vicino alla "r")
 * e si posa dopo la y con un piccolo rimbalzo.
 * Tutto in unità del viewBox del logo (vedi src/data/logo.ts); il tempo in secondi.
 */
import { LOGO } from '../data/logo';

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Orbit = { cx: number; cy: number; k: number; bump: number; tilt: number; th0: number; r0: number; r1: number; sweep: number; front: number };

/** ellisse schiacciata (k) e inclinata (tilt) che parte da P0 e arriva a P1 in senso antiorario */
function makeOrbit(cx: number, cy: number, k: number, P0: readonly number[], P1: readonly number[], bump: number, tilt: number, front: number): Orbit {
  const c = Math.cos(-tilt), s = Math.sin(-tilt);
  const rot = (P: readonly number[]) => { const x = P[0] - cx, y = P[1] - cy; return [x * c - y * s, x * s + y * c]; };
  const A = rot(P0), B = rot(P1);
  const th0 = Math.atan2(A[1] / k, A[0]), th1 = Math.atan2(B[1] / k, B[0]);
  return { cx, cy, k, bump, tilt, th0, r0: Math.hypot(A[0], A[1] / k), r1: Math.hypot(B[0], B[1] / k), sweep: th1 - th0 - 2 * Math.PI, front };
}

function orbitAt(p: number, o: Orbit) {
  const th = o.th0 + o.sweep * p;
  const r = o.r0 + (o.r1 - o.r0) * p + o.bump * Math.sin(Math.PI * p);
  const u = r * Math.cos(th), v = o.k * r * Math.sin(th);
  const c = Math.cos(o.tilt), s = Math.sin(o.tilt);
  return { x: o.cx + u * c - v * s, y: o.cy + u * s + v * c, depth: Math.cos(th - o.front) };
}

export const INTRO = {
  appear: 0.6, // il punto compare accanto alla z
  kick: 1.0, // la z carica il calcio
  orbit: 1.8, // durata del giro
  end: 3.6, // tutto fermo
};

const P0 = [LOGO.dotStart.x, LOGO.dotStart.y] as const;
const P1 = [LOGO.dot.x, LOGO.dot.y] as const;
const ORBIT = makeOrbit(2450, 580, 0.5, P0, P1, 380, -0.08, 2.6);

/** rotazione aggiuntiva della z in gradi (nello spazio del font, come nel logo) */
export function kickAngle(t: number, t0 = INTRO.kick) {
  if (t < t0) return 0;
  if (t < t0 + 0.28) return 10 * easeOut(seg(t, t0, t0 + 0.28));
  if (t < t0 + 0.38) { const b = seg(t, t0 + 0.28, t0 + 0.38); return 10 - 32 * b * b; }
  const c = t - (t0 + 0.38);
  return -22 * Math.exp(-5 * c) * Math.cos(11 * c);
}

/** atterraggio: schiacciata, saltello, schiacciata più piccola (u = secondi dal contatto) */
export function landingHop(u: number) {
  const R = LOGO.dot.r, hop = 0.36;
  const dy = u < hop ? -R * 1.3 * Math.sin(Math.PI * u / hop) : 0;
  const c1 = u < 0.12 ? Math.sin(Math.PI * u / 0.12) : 0;
  const c2 = u >= hop && u < hop + 0.14 ? Math.sin(Math.PI * (u - hop) / 0.14) : 0;
  const sq = 0.2 * c1 + 0.16 * c2;
  return { dy, sx: 1 + sq, sy: 1 - sq, done: u >= hop + 0.14 };
}

/** posizione, schiacciamento, profondità e opacità del punto al tempo t */
export function ballAt(t: number) {
  const R = LOGO.dot.r, tl = INTRO.kick + 0.34, dur = INTRO.orbit;
  let x = P0[0], y = P0[1], sx = 1, sy = 1, depth = 0;
  if (t >= tl && t < tl + dur) {
    const p = 1 - Math.pow(1 - seg(t, tl, tl + dur), 2.2);
    const o = orbitAt(p, ORBIT); x = o.x; y = o.y; depth = o.depth;
    if (p < 0.1) depth = Math.max(depth, 0); // appena calciato resta davanti
  } else if (t >= tl + dur) {
    x = P1[0]; y = P1[1];
    const h = landingHop(t - (tl + dur)); y += h.dy; sx = h.sx; sy = h.sy;
  } else {
    const sq = 0.18 * Math.sin(Math.PI * seg(t, INTRO.kick + 0.28, tl)); sx = 1 - sq; sy = 1 + sq * 0.6;
  }
  const grow = easeOut(seg(t, INTRO.appear, INTRO.appear + 0.3));
  const s = (1 + 0.18 * depth) * (0.6 + 0.4 * grow);
  return { x, y, sx: sx * s, sy: sy * s, front: depth >= -0.05, alpha: grow };
}

/** il transform SVG del punto (schiacciato dal basso) */
export function ballTransform(b: ReturnType<typeof ballAt>) {
  const R = LOGO.dot.r;
  return `translate(${b.x.toFixed(1)} ${(b.y + R * b.sy).toFixed(1)}) scale(${b.sx.toFixed(3)} ${b.sy.toFixed(3)}) translate(0 ${-R})`;
}
