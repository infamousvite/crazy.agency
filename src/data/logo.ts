/**
 * Logo "Crazy." (direzione B, "Fuori riga"): Unbounded 700 convertito in tracciati,
 * la z inclinata di 12° e il punto viola. Unità: quelle del font (1000 = 1 em),
 * con l'asse y in su; la linea di base è a y = 800 nel viewBox.
 * Usato da Logo.astro (barra, footer) e dalla hero (particelle + punto che orbita).
 */
export const LOGO = {
  /** viewBox della scritta ferma: x, y, larghezza, altezza */
  viewBox: [-20, 0, 3900, 1010] as const,
  baseline: 800,
  /** inclinazione della z (gradi, nello spazio del font) e suo perno */
  zTilt: 12,
  zPivot: [330, 290] as const,
  /** punto: posizione a riposo e raggio (unità del viewBox) */
  dot: { x: 3734, y: 690, r: 115 },
  /** dove il punto aspetta il calcio, accanto alla z */
  dotStart: { x: 2960, y: 690 },
  letters: [
    { ch: 'C', x: 0, d: 'M903 314Q892 215 835 141Q778 66 685 25Q593 -16 473 -16Q342 -16 244 33Q146 82 92 170Q37 258 37 375Q37 492 92 580Q146 668 244 717Q342 766 473 766Q593 766 685 725Q778 684 835 609Q892 535 903 436H695Q685 484 656 517Q627 551 581 569Q534 587 473 587Q403 587 352 562Q301 536 274 488Q247 441 247 375Q247 309 274 262Q301 214 352 189Q403 163 473 163Q534 163 581 180Q627 197 656 231Q685 265 695 314Z' },
    { ch: 'r', x: 894, d: 'M29 571H237L271 367V0H67V379ZM539 580V406Q509 412 483 414Q456 417 434 417Q390 417 353 399Q316 382 293 342Q271 302 271 235L232 283Q240 345 256 400Q272 454 299 497Q327 539 368 563Q409 588 468 588Q485 588 503 586Q521 584 539 580Z' },
    { ch: 'a', x: 1407, d: 'M572 0 546 206 573 285 546 364 572 571H784L748 286L784 0ZM620 285Q606 195 565 127Q523 59 460 21Q396 -16 315 -16Q231 -16 168 21Q104 59 68 127Q32 196 32 285Q32 376 68 444Q104 512 168 550Q231 588 315 588Q396 588 460 550Q523 513 565 445Q607 378 620 285ZM239 285Q239 243 256 210Q274 177 305 159Q336 140 376 140Q418 140 455 159Q492 177 520 210Q548 243 562 285Q548 328 520 361Q492 394 455 413Q418 432 376 432Q336 432 305 413Q274 394 256 361Q239 328 239 285Z' },
    { ch: 'z', x: 2193, d: 'M38 0V142L432 452L576 425H41V571H653V429L260 120L138 147H655V0Z' },
    { ch: 'y', x: 2847, d: 'M244 -181Q181 -181 132 -166Q83 -150 37 -118V24Q84 -6 125 -19Q166 -32 215 -32Q256 -32 288 -14Q320 4 340 52L559 571H776L502 -11Q473 -74 431 -112Q390 -149 342 -165Q294 -181 244 -181ZM251 53 8 571H233L448 53Z' },
  ],
} as const;

export type LogoLetter = (typeof LOGO.letters)[number];
