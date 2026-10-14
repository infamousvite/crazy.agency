export type Lang = 'it' | 'en';
export const langs: Lang[] = ['it', 'en'];

export type RouteKey =
  | 'home'
  | 'services'
  | 'work'
  | 'concept'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'cookies';

const routes: Record<Lang, Record<RouteKey, string>> = {
  it: {
    home: '/it/',
    services: '/it/servizi/',
    work: '/it/lavori/',
    concept: '/it/lavori/concept/',
    about: '/it/chi-siamo/',
    contact: '/it/contatti/',
    privacy: '/it/privacy/',
    cookies: '/it/cookie/',
  },
  en: {
    home: '/en/',
    services: '/en/services/',
    work: '/en/work/',
    concept: '/en/work/concept/',
    about: '/en/about/',
    contact: '/en/contact/',
    privacy: '/en/privacy/',
    cookies: '/en/cookies/',
  },
};

export const url = (lang: Lang, key: RouteKey) => routes[lang][key];
export const caseUrl = (lang: Lang, slug: string) => `${routes[lang].work}${slug}/`;

/** Same page in the other language (for the switcher and hreflang). */
export type Alternates = Record<Lang, string>;
export const alt = (key: RouteKey): Alternates => ({ it: url('it', key), en: url('en', key) });
export const altCase = (slug: string): Alternates => ({
  it: caseUrl('it', slug),
  en: caseUrl('en', slug),
});

/** Pick the string for the current language. */
export const t = <T>(lang: Lang, v: { it: T; en: T }): T => v[lang];

export const ui = {
  nav: {
    services: { it: 'Servizi', en: 'Services' },
    work: { it: 'Lavori', en: 'Work' },
    about: { it: 'Chi siamo', en: 'About' },
    contact: { it: 'Contatti', en: 'Contact' },
    cta: { it: 'Fai il preventivo', en: 'Get a quote' },
    menu: { it: 'Menu', en: 'Menu' },
    close: { it: 'Chiudi', en: 'Close' },
    skip: { it: 'Vai al contenuto', en: 'Skip to content' },
  },
  footer: {
    claim: {
      it: 'Siti su misura, curati in ogni dettaglio.',
      en: 'Made-to-measure websites, crafted down to the detail.',
    },
    // frase "entità" (chi, cosa, dove): aiuta Google e gli assistenti AI a capire chi siamo
    based: {
      it: 'Crazy. è una web agency di Thiene (Vicenza): siti vetrina, e-commerce, SEO e AI SEO. Lavoriamo anche a distanza, con clienti ovunque.',
      en: 'Crazy. is a web agency in Thiene (Vicenza, Italy): websites, e-commerce, SEO and AI SEO. We also work remotely, with clients anywhere.',
    },
    legal: { it: 'Privacy', en: 'Privacy' },
    cookies: { it: 'Cookie', en: 'Cookies' },
    rights: { it: 'Tutti i diritti riservati.', en: 'All rights reserved.' },
    sections: { it: 'Pagine', en: 'Pages' },
    contacts: { it: 'Contatti', en: 'Contact' },
    top: { it: 'Torna su', en: 'Back to top' },
  },
  common: {
    from: { it: 'da', en: 'from' },
    viewCase: { it: 'Guarda il progetto', en: 'View project' },
    comingSoon: { it: 'In arrivo', en: 'Coming soon' },
    concept: { it: 'Concept', en: 'Concept' },
    client: { it: 'Cliente', en: 'Client' },
    year: { it: 'Anno', en: 'Year' },
    services: { it: 'Servizi', en: 'Services' },
    sector: { it: 'Settore', en: 'Sector' },
    live: { it: 'Visita il sito', en: 'Visit the site' },
    quote: { it: 'Fai il preventivo', en: 'Get a quote' },
    allWork: { it: 'Tutti i lavori', en: 'All work' },
    scroll: { it: 'Scorri', en: 'Scroll' },
  },
} as const;
