/**
 * Lettere "fuori riga", come la z del logo: in pochi titoli scelti una sola
 * lettera è inclinata. Nel testo si segna fra parentesi quadre:
 * tilt('cra[z]y') → cra<span class="tilt">z</span>y.
 * Il testo resta leggibile e intero per i lettori di schermo.
 * Usarla con set:html e solo su testi scritti da noi.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function tilt(text: string) {
  // la parola che contiene la lettera non va a capo a metà
  return esc(text).replace(/([^\s]*)\[(.)\]([^\s]*)/gu, '<span class="tilt-word">$1<span class="tilt">$2</span>$3</span>');
}

/** il testo senza segni, per title, aria-label e simili */
export const plain = (text: string) => text.replace(/\[(.)\]/gu, '$1');
