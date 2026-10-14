/**
 * Entry point comune. Scroll del browser (niente scroll "finto"),
 * niente tendine tra le pagine: il sito resta veloce.
 * Le parti pesanti si caricano solo dove servono.
 */
import { initReveal } from './reveal';
import { initNav } from './nav';
import { initMedia } from './media';

export function boot() {
  initReveal();
  initNav();
  initMedia();

  const particles = document.querySelector<HTMLElement>('[data-particles]');
  if (particles) import('./particles').then((m) => m.initParticles(particles));
  if (document.querySelector('[data-stack], [data-prism]')) import('./home').then((m) => m.initHome());
  if (document.querySelector('[data-magnet]')) import('./magnet').then((m) => m.initMagnet());
  if (document.querySelector('[data-quote]')) import('./quote').then((m) => m.initQuote());
  if (document.querySelector('[data-logo-play]')) import('./logo-play').then((m) => m.initLogoPlay());
}
