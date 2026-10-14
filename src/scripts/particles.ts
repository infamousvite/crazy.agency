import { LOGO, type LogoLetter } from '../data/logo';
import { ballAt, ballTransform, kickAngle, landingHop, INTRO } from './logo-motion';

/**
 * Il logo "Crazy." di particelle, solo nella hero (WebGL2 puro, niente librerie).
 * - le particelle sono campionate dai tracciati del logo (src/data/logo.ts),
 *   disegnati esattamente dove sta il logo fermo (anche su schermi retina);
 * - intro: compare la z, che calcia il punto viola; il punto fa un'orbita
 *   attorno a "zy" (dietro le lettere in alto, davanti vicino alla "r") mentre
 *   le altre lettere si compongono da destra a sinistra, poi si posa dopo la y
 *   (movimento in logo-motion.ts; il punto è un cerchio SVG sopra e sotto la tela);
 * - respirano piano, il mouse le scansa;
 * - quando la hero esce dallo schermo si sciolgono un po' e il disegno si ferma.
 * Niente listener di scroll: la posizione si legge nel frame già in corso.
 */

const VERT = `#version 300 es
in vec2 aTarget;
in vec2 aStart;
in vec4 aSeed;
in vec2 aInfo;
uniform vec2 uRes;
uniform float uKick;
uniform vec2 uPivot;
uniform float uProg;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScatter;
uniform float uSize;
uniform float uPR;
// esplosioni al clic: xy = centro (px), z = secondi passati, w = forza (0 = spenta)
uniform vec4 uBursts[4];
uniform float uBurstR;
out vec3 vColor;
out float vAlpha;
void main() {
  // uProg = secondi dall'avvio; aInfo.y = quando parte questa particella, aInfo.x = 1 se è della z
  float p = clamp((uProg - aInfo.y) / 0.9, 0.0, 1.0);
  p = 1.0 - pow(1.0 - p, 4.0);
  vec2 pos = mix(aStart, aTarget, p);
  if (aInfo.x > 0.5) {
    float kc = cos(uKick), ks = sin(uKick);
    vec2 q = pos - uPivot;
    pos = uPivot + vec2(kc * q.x - ks * q.y, ks * q.x + kc * q.y);
  }
  // respiro: un piccolo giro attorno al punto di arrivo
  float t = uTime * (0.35 + aSeed.y * 0.5) + aSeed.z * 6.2831;
  pos += vec2(cos(t), sin(t * 1.3)) * uSize * 0.9;
  // il mouse le scansa
  vec2 d = pos - uMouse;
  float dist = length(d);
  float f = smoothstep(110.0, 0.0, dist);
  pos += (d / max(dist, 0.001)) * f * 38.0;
  // clic: le particelle vicine schizzano via e poi tornano al loro posto
  float flash = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 b = uBursts[i];
    if (b.w <= 0.0) continue;
    vec2 bd = pos - b.xy;
    float bl = length(bd);
    float fall = exp(-bl * bl / (2.0 * uBurstR * uBurstR));
    float a = b.z;
    float push = (1.0 - exp(-a * 16.0)) * exp(-a * 2.4);
    float ang = (aSeed.z - 0.5) * 1.4;
    vec2 dir = bd / max(bl, 0.001);
    dir = vec2(dir.x * cos(ang) - dir.y * sin(ang), dir.x * sin(ang) + dir.y * cos(ang));
    pos += dir * b.w * fall * push * (0.45 + aSeed.w * 1.2);
    flash += fall * push;
  }
  // uscita: si sciolgono verso l'alto e di lato
  vec2 c = uRes * 0.5;
  pos += normalize(pos - c + 0.001) * uScatter * (60.0 + aSeed.w * 220.0);
  pos.y -= uScatter * aSeed.y * 120.0;
  float k = clamp(aTarget.x / uRes.x + (aSeed.y - 0.5) * 0.28, 0.0, 1.0);
  vec3 violet = vec3(0.42, 0.33, 0.88);
  vec3 cyan = vec3(0.11, 0.54, 0.56);
  vec3 col = mix(violet, cyan, smoothstep(0.25, 0.95, k));
  col = mix(col, vec3(0.086, 0.075, 0.122), step(0.94, aSeed.w) * 0.8);
  vColor = col;
  vAlpha = (0.55 + 0.45 * p) * (1.0 - uScatter * 0.85) + f * 0.3 + flash * 0.25;
  vec2 clip = (pos / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = uSize * uPR * (0.8 + aSeed.z * 0.9);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor;
in float vAlpha;
out vec4 color;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.35, d) * vAlpha;
  color = vec4(vColor * a, a);
}`;

type Cloud = { target: Float32Array; start: Float32Array; seed: Float32Array; info: Float32Array; count: number; size: number; map: Map2 };
/** da unità del logo a pixel della tela: px = ox + (u - vx) * s */
type Map2 = { s: number; ox: number; oy: number };

// quando si compongono le lettere (secondi): la z subito, le altre da destra a sinistra durante l'orbita
const REVEAL: Record<string, number> = { z: 0, y: 1.25, a: 1.43, r: 1.61, C: 1.79 };

function sample(el: HTMLElement, host: DOMRect, w: number, h: number, sparse = 1): Cloud {
  const svg = el.querySelector('svg') ?? el;
  const rr = svg.getBoundingClientRect();
  const [vx, vy, vw] = LOGO.viewBox;
  const map: Map2 = { s: rr.width / vw, ox: rr.left - host.left, oy: rr.top - host.top };
  const c = document.createElement('canvas');
  c.width = Math.ceil(w); c.height = Math.ceil(h);
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  const toLetter = (l: LogoLetter) => {
    ctx.setTransform(map.s, 0, 0, map.s, map.ox - vx * map.s, map.oy - vy * map.s);
    ctx.transform(1, 0, 0, -1, 0, LOGO.baseline);
    ctx.translate(l.x, 0);
    if (l.ch === 'z') { ctx.translate(LOGO.zPivot[0], LOGO.zPivot[1]); ctx.rotate(LOGO.zTilt * Math.PI / 180); ctx.translate(-LOGO.zPivot[0], -LOGO.zPivot[1]); }
  };
  const paths = LOGO.letters.map((l) => ({ l, path: new Path2D(l.d) }));
  for (const { l, path } of paths) { toLetter(l); ctx.fill(path); }
  const z = paths.find((p) => p.l.ch === 'z')!;
  toLetter(z.l);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  // lettera di un punto: la z col tracciato vero, le altre per fasce orizzontali
  const letterOf = (px: number, py: number) => {
    if (ctx.isPointInPath(z.path, px, py)) return 'z';
    const u = (px - map.ox) / map.s + vx;
    return u < 912 ? 'C' : u < 1436 ? 'r' : u < 2215 ? 'a' : u < 2850 ? 'z' : 'y';
  };

  // passo adattivo: abbastanza punti per la forma, non troppi per il telefono
  const step = (w < 700 ? 1.7 : w < 1200 ? 2.2 : 2.3) * sparse;
  const pts: number[] = [];
  for (let gy = 0; gy < h; gy += step) {
    for (let gx = 0; gx < w; gx += step) {
      const jx = gx + (Math.random() - 0.5) * step;
      const jy = gy + (Math.random() - 0.5) * step;
      const ix = Math.min(c.width - 1, Math.max(0, Math.floor(jx)));
      const iy = Math.min(c.height - 1, Math.max(0, Math.floor(jy)));
      if (data[(iy * c.width + ix) * 4 + 3] > 120 && Math.random() < (w < 700 ? 0.92 : 0.8)) pts.push(jx, jy);
    }
  }
  const count = pts.length / 2;
  const target = new Float32Array(pts);
  const start = new Float32Array(count * 2);
  const seed = new Float32Array(count * 4);
  const info = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const ch = letterOf(target[i * 2], target[i * 2 + 1]);
    info[i * 2] = ch === 'z' ? 1 : 0;
    info[i * 2 + 1] = REVEAL[ch] + Math.random() * (ch === 'z' ? 0.2 : 0.3);
  }
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * Math.max(w, h) * 0.75;
    start[i * 2] = w / 2 + Math.cos(a) * r;
    start[i * 2 + 1] = h / 2 + Math.sin(a) * r * 0.55;
    seed[i * 4] = Math.random();
    seed[i * 4 + 1] = Math.random();
    seed[i * 4 + 2] = Math.random();
    seed[i * 4 + 3] = Math.random();
  }
  return { target, start, seed, info, count, size: (w < 700 ? 2.0 : 2.1) * Math.min(1.35, Math.sqrt(sparse)), map };
}

function shader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

export async function initParticles(host: HTMLElement) {
  if (new URLSearchParams(location.search).get('gl') === '0') return;
  const text = host.querySelector<HTMLElement>('[data-particles-text]');
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  if (!text || !canvas) return;
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return;
  const balls = { back: host.querySelector<SVGElement>('[data-ball="back"]'), front: host.querySelector<SVGElement>('[data-ball="front"]') };

  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  } catch { return; }
  gl.useProgram(prog);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uProg = U('uProg'), uTime = U('uTime'), uMouse = U('uMouse'), uScatter = U('uScatter'), uSize = U('uSize'), uPR = U('uPR');
  const uKick = U('uKick'), uPivot = U('uPivot'), uBursts = U('uBursts'), uBurstR = U('uBurstR');

  const buffers: Record<string, WebGLBuffer> = {};
  const attr = (name: string, data: Float32Array, size: number) => {
    const loc = gl.getAttribLocation(prog, name);
    if (!buffers[name]) buffers[name] = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };

  // qualità: se la scheda video non viene usata (accelerazione hardware spenta, driver vecchi)
  // il WebGL gira sul processore. Lì meno particelle e niente pixel retina, così resta fluido.
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  const soft = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  let pr = soft ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, cloud: Cloud;
  const layout = () => {
    const r = host.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * pr);
    canvas.height = Math.round(h * pr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    cloud = sample(text, r, w, h, soft ? 1.45 : 1);
    attr('aTarget', cloud.target, 2);
    attr('aStart', cloud.start, 2);
    attr('aSeed', cloud.seed, 4);
    attr('aInfo', cloud.info, 2);
    // perno del calcio: il centro di rotazione della z, in pixel
    const zl = LOGO.letters.find((l) => l.ch === 'z')!;
    const [vx, vy] = LOGO.viewBox;
    gl.uniform2f(uPivot, cloud.map.ox + (zl.x + LOGO.zPivot[0] - vx) * cloud.map.s, cloud.map.oy + (LOGO.baseline - LOGO.zPivot[1] - vy) * cloud.map.s);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uSize, cloud.size);
    gl.uniform1f(uPR, pr);
    gl.uniform1f(uBurstR, w < 700 ? 60 : 90);
  };
  layout();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = host.closest('section') ?? host;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  section.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect();
    mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
  });
  section.addEventListener('pointerleave', () => { mouse.tx = -9999; mouse.ty = -9999; });

  // ---- clic: esplosione di particelle, oppure il punto che schizza in giro ----
  const bursts: { x: number; y: number; t: number; w: number }[] = [];
  const burstData = new Float32Array(16);
  const R = LOGO.dot.r;
  type Play =
    | { mode: 'free'; t: number; x: number; y: number; vx: number; vy: number; hit: number; hx: boolean }
    | { mode: 'back'; t: number; x0: number; y0: number }
    | { mode: 'land'; t: number };
  let play: Play | null = null;
  let ballNow = { x: LOGO.dot.x, y: LOGO.dot.y };
  // da pixel della hero a unità del logo e ritorno
  const toLogo = (px: number, py: number) => ({ x: (px - cloud.map.ox) / cloud.map.s + LOGO.viewBox[0], y: (py - cloud.map.oy) / cloud.map.s + LOGO.viewBox[1] });
  const onBall = (px: number, py: number) => {
    const q = toLogo(px, py);
    return Math.hypot(q.x - ballNow.x, q.y - ballNow.y) < R * 1.6;
  };
  const interactive = () => !reduced && progress > INTRO.end;
  host.addEventListener('pointerdown', (e) => {
    if (!interactive()) return;
    const r = host.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    if (!play && onBall(px, py)) {
      // il punto parte verso l'alto, in una direzione a caso
      const a = (-90 + (Math.random() - 0.5) * 120) * Math.PI / 180;
      const v = 7200 + Math.random() * 2400;
      play = { mode: 'free', t: 0, x: ballNow.x, y: ballNow.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, hit: 0, hx: false };
      start();
      return;
    }
    bursts.push({ x: px, y: py, t: performance.now(), w: w < 700 ? 100 : 150 });
    if (bursts.length > 4) bursts.shift();
    start();
  });
  section.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !interactive()) return;
    const r = host.getBoundingClientRect();
    host.style.cursor = !play && onBall(e.clientX - r.left, e.clientY - r.top) ? 'pointer' : '';
  });
  // un passo della pallina libera: gravità, rimbalzi sui bordi della hero, poi torna a casa
  const stepPlay = (dt: number) => {
    if (!play) return null;
    play.t += dt;
    const sq = { sx: 1, sy: 1 };
    if (play.mode === 'free') {
      const L = toLogo(0, 0), B = toLogo(w, h);
      const minX = L.x + R, maxX = B.x - R, minY = L.y + R, maxY = B.y - R;
      const steps = 4, d = dt / steps;
      for (let i = 0; i < steps; i++) {
        play.vy += 15000 * d;
        play.x += play.vx * d; play.y += play.vy * d;
        if (play.x < minX || play.x > maxX) { play.x = Math.min(maxX, Math.max(minX, play.x)); play.vx *= -0.86; play.hit = play.t; play.hx = true; }
        if (play.y < minY) { play.y = minY; play.vy *= -0.8; play.hit = play.t; play.hx = false; }
        if (play.y > maxY) { play.y = maxY; play.vy *= -0.74; play.vx *= 0.92; play.hit = play.t; play.hx = false; }
      }
      // schiacciata all'urto, nella direzione giusta
      const k = play.hit ? Math.max(0, 1 - (play.t - play.hit) / 0.12) : 0;
      const amt = 0.24 * Math.sin(Math.PI * Math.min(1, (play.t - play.hit) / 0.12)) * (k > 0 ? 1 : 0);
      if (play.hx) { sq.sx = 1 - amt; sq.sy = 1 + amt * 0.6; } else { sq.sx = 1 + amt; sq.sy = 1 - amt; }
      if (play.t < 0.1) { const s0 = 0.22 * Math.sin(Math.PI * play.t / 0.1); sq.sx = 1 - s0; sq.sy = 1 + s0 * 0.6; }
      ballNow = { x: play.x, y: play.y };
      if (play.t > 2.1) play = { mode: 'back', t: 0, x0: play.x, y0: play.y };
    } else if (play.mode === 'back') {
      // torna a casa su un arco, poi atterra col saltello
      const u = Math.min(1, play.t / 0.75), e2 = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const cx = (play.x0 + LOGO.dot.x) / 2, cy = Math.min(play.y0, LOGO.dot.y) - 900;
      const o = 1 - e2;
      ballNow = { x: o * o * play.x0 + 2 * o * e2 * cx + e2 * e2 * LOGO.dot.x, y: o * o * play.y0 + 2 * o * e2 * cy + e2 * e2 * LOGO.dot.y };
      if (u >= 1) play = { mode: 'land', t: 0 };
    } else {
      const hh = landingHop(play.t);
      ballNow = { x: LOGO.dot.x, y: LOGO.dot.y + hh.dy }; sq.sx = hh.sx; sq.sy = hh.sy;
      if (hh.done) { play = null; ballNow = { x: LOGO.dot.x, y: LOGO.dot.y }; }
    }
    return { x: ballNow.x, y: ballNow.y, sx: sq.sx, sy: sq.sy, front: true, alpha: 1 };
  };

  // secondi d'intro trascorsi (avanzano solo mentre si disegna, così l'intro non si perde)
  let progress = reduced ? 99 : 0;
  let scatter = 0;
  const t0 = performance.now();
  let raf = 0, visible = true, last = t0;
  const frame = (now: number) => {
    raf = 0;
    // tempo vero (fino a 100 ms per fotogramma): se il computer fatica l'animazione
    // salta qualche fotogramma ma non rallenta
    const dt = Math.min(100, now - last); last = now;
    watch(dt);
    if (progress < 99) progress = Math.min(99, progress + dt / 1000);
    // inseguimenti indipendenti dai fotogrammi al secondo (0,16 a 60 fps)
    const ease = (k: number) => 1 - Math.pow(1 - k, dt / 16.67);
    if (mouse.tx < -9000) { mouse.x = -9999; mouse.y = -9999; }
    else { const m = ease(0.16); mouse.x += (mouse.tx - mouse.x) * m; mouse.y += (mouse.ty - mouse.y) * m; }
    // quanto la hero è già uscita in alto (0..1)
    const sr = section.getBoundingClientRect();
    const target = Math.min(1, Math.max(0, -sr.top / (sr.height * 0.75)));
    scatter += (target - scatter) * ease(0.12);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uProg, progress);
    gl.uniform1f(uTime, reduced ? 0 : (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uScatter, reduced ? 0 : scatter);
    gl.uniform1f(uKick, reduced ? 0 : -kickAngle(progress) * Math.PI / 180);
    // esplosioni attive (al massimo 4, durano circa 2,5 s)
    burstData.fill(0);
    bursts.forEach((b, i) => {
      const age = (now - b.t) / 1000;
      if (age < 3) burstData.set([b.x, b.y, age, b.w], i * 4);
    });
    gl.uniform4fv(uBursts, burstData);
    if (balls.back && balls.front) {
      const free = stepPlay(dt / 1000);
      const b = free ?? ballAt(progress);
      if (!free) ballNow = { x: b.x, y: b.y };
      const tr = ballTransform(b), fade = b.alpha * (1 - (reduced ? 0 : scatter));
      balls.back.setAttribute('transform', tr); balls.front.setAttribute('transform', tr);
      balls.front.style.opacity = String(b.front ? fade : 0);
      balls.back.style.opacity = String(b.front ? 0 : fade);
    }
    gl.drawArrays(gl.POINTS, 0, cloud.count);
    if (visible && !reduced) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  // controllo una volta sola: se i primi fotogrammi sono lenti, passa alla versione leggera
  const times: number[] = [];
  function watch(dt: number) {
    if (pr === 1 || times.length >= 45) return;
    times.push(dt);
    if (times.length < 45) return;
    const med = times.slice(5).sort((a, b) => a - b)[20];
    // solo la risoluzione del disegno: le particelle restano dove sono, nessun salto
    if (med > 24 && pr > 1) {
      pr = 1;
      canvas.width = Math.round(w); canvas.height = Math.round(h);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uPR, pr);
    }
  }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    if (visible) start();
  }).observe(host);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) start(); });

  let rt: number | undefined;
  let lastW = w;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      const r = host.getBoundingClientRect();
      // su telefono la barra degli indirizzi cambia solo l'altezza: non ricampionare per quello
      if (Math.abs(r.width - lastW) < 2 && Math.abs(r.height - h) < 120) return;
      lastW = r.width;
      layout(); if (reduced) requestAnimationFrame(frame); else start();
    }, 150);
  }).observe(host);

  host.classList.add('is-lit');
  start();
}
