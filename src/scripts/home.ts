/**
 * Home: movimento legato allo scroll (GSAP ScrollTrigger).
 * - servizi: le schede si impilano; quella sotto si ritrae e si scurisce
 *   mentre arriva la successiva (lo "stack" lo fa il CSS sticky);
 * - lavori: un prisma 3D in CSS che gira con lo scroll, una faccia per
 *   cliente e l'ultima per "il prossimo sito". Solo il video della faccia
 *   davanti è in riproduzione, così il giro resta fluido.
 * Con "riduci movimento" tutto resta fermo e leggibile.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------------- servizi: schede impilate ---------------- */

function stack(reduced: boolean) {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-scard]'));
  if (cards.length < 2 || reduced) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const sts = cards.slice(0, -1).map((card, i) => {
      const next = cards[i + 1];
      const shade = card.querySelector<HTMLElement>('.scard__shade');
      return ScrollTrigger.create({
        trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top) || 96}px`,
        scrub: 0.3, invalidateOnRefresh: true,
        onUpdate: (s) => {
          const t = easeOut(s.progress);
          card.style.transform = `scale(${(1 - 0.06 * t).toFixed(4)})`;
          if (shade) shade.style.opacity = (0.55 * t).toFixed(3);
        },
      });
    });
    return () => { sts.forEach((s) => s.kill()); cards.forEach((c) => (c.style.transform = '')); };
  });
}

/* ---------------- lavori: prisma ---------------- */

function prism(reduced: boolean) {
  const section = document.querySelector<HTMLElement>('[data-prism]');
  const pin = document.querySelector<HTMLElement>('[data-prism-pin]');
  const body = document.querySelector<HTMLElement>('[data-prism-body]');
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-prism-item]'));
  const faces = Array.from(document.querySelectorAll<HTMLElement>('[data-face]'));
  if (!section || !pin || !body || faces.length < 2 || reduced) return;
  const n = faces.length;
  const step = 360 / n;
  const videos = faces.map((f) => f.querySelector<HTMLVideoElement>('video'));

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1000px) and (min-height: 620px)', () => {
    document.documentElement.classList.add('prism-on');
    body.style.setProperty('--step', `${step}deg`);
    let ap = 0;
    const setApothem = () => {
      ap = body.clientWidth / (2 * Math.tan(Math.PI / n));
      body.style.setProperty('--apothem', `${ap.toFixed(1)}px`);
    };
    setApothem();

    let active = -1;
    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      items.forEach((el, k) => el.classList.toggle('is-active', k === i));
      // un solo video alla volta: quello della faccia davanti
      videos.forEach((v, k) => {
        if (!v) return;
        if (k === i) {
          if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
          v.play().then(() => v.classList.add('is-playing')).catch(() => {});
        } else v.pause();
      });
    };

    const turn = (p: number) => {
      const f = p * (n - 1);
      const between = Math.sin((f % 1) * Math.PI); // 0 sulla faccia, 1 a metà giro
      body.style.transform =
        `translateZ(${(-ap - between * 90).toFixed(1)}px) rotateX(${(3 + between * 5).toFixed(2)}deg) rotateY(${(-f * step - 10).toFixed(2)}deg)`;
      setActive(Math.round(f));
    };

    const st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: () => `+=${window.innerHeight * (n - 1)}`,
      pin, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      onRefreshInit: setApothem,
      onUpdate: (s) => turn(s.progress),
      onToggle: (s) => { if (!s.isActive) videos.forEach((v) => v?.pause()); else { const i = active; active = -1; setActive(i < 0 ? 0 : i); } },
    });
    turn(st.progress);

    return () => {
      st.kill();
      document.documentElement.classList.remove('prism-on');
      body.style.transform = '';
      items.forEach((el) => el.classList.remove('is-active'));
      videos.forEach((v) => v?.pause());
    };
  });

  // telefono e schermi bassi: le anteprime si raddrizzano mentre entrano
  mm.add('(max-width: 999.98px), (max-height: 619.98px)', () => {
    const thumbs = Array.from(document.querySelectorAll<HTMLElement>('[data-thumb]'));
    const sts = thumbs.map((el) => {
      el.style.transformOrigin = '50% 100%';
      return ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'top 50%', scrub: 0.4,
        onUpdate: (s) => {
          const t = easeOut(clamp01(s.progress));
          el.style.transform = `perspective(900px) rotateX(${((1 - t) * 26).toFixed(2)}deg) scale(${(0.88 + 0.12 * t).toFixed(4)})`;
        },
      });
    });
    return () => { sts.forEach((s) => s.kill()); thumbs.forEach((el) => (el.style.transform = '')); };
  });
}

export function initHome() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  stack(reduced);
  prism(reduced);
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
}
