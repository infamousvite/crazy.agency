/**
 * Dati generali dell'agenzia. Tutto ciò che è marcato DA CONFERMARE
 * va sostituito prima della messa online.
 */
export const site = {
  name: 'Crazy.',
  legalName: 'Crazy. Web Agency', // DA CONFERMARE: ragione sociale
  city: 'Thiene',
  region: 'Vicenza, Veneto',
  country: 'IT',
  email: 'ciao@crazyagency.it', // DA CONFERMARE (poi metti emailConfirmed: true)
  emailConfirmed: false,
  whatsapp: '393391616757', // +39 339 161 6757 (senza + e spazi). Vuoto = pulsante nascosto
  vat: '', // DA CONFERMARE: es. 'P.IVA 01234567890'. Vuoto = riga nascosta
  team: {
    names: ['Marco', 'Giorgia'], // chi risponde e costruisce i siti
    monogram: 'G&M', // segnaposto finché non c'è la foto
    photo: '', // DA COMPLETARE: es. '/media/giorgia-marco.webp' (foto verticale 4:5). Vuoto = monogramma
  },
  social: {
    instagram: 'https://www.instagram.com/', // DA CONFERMARE
    linkedin: '', // DA CONFERMARE
  },
  /**
   * Profili ufficiali e VERI dell'agenzia (finiscono nei dati strutturati come `sameAs`
   * e aiutano Google e gli assistenti AI a riconoscere Crazy. come un'unica entità).
   * DA COMPLETARE quando esistono: link della scheda Google Business Profile,
   * profilo Instagram, pagina LinkedIn, Facebook, Bing Places… Solo link reali.
   */
  sameAs: [] as string[],
  /** Dove lavoriamo (dati strutturati): in zona di persona, a distanza ovunque. */
  areaServed: {
    province: 'Provincia di Vicenza',
    regionName: 'Veneto',
    countryName: 'Italia',
  },
  /**
   * Data dell'ultimo aggiornamento dei contenuti (AAAA-MM-GG): finisce nella sitemap
   * (lastmod) e nei dati strutturati. Aggiornala quando cambi testi, lavori o prezzi.
   */
  updated: '2026-10-10',
  /**
   * Chiave IndexNow (Bing, Yandex, Seznam…): il file /<chiave>.txt è in public/.
   * Serve per avvisare subito i motori quando pubblichi una pagina nuova (vedi README).
   */
  indexNowKey: 'bb73be1ff5fb4e6ea12b734a1388080e',
};

/** Prezzi di partenza del configuratore (euro, IVA esclusa). */
export const pricing = {
  landing: 400,
  multipage: 700,
  ecommerce: 1200,
  /** mantenimento annuale: hosting, dominio e piccole modifiche */
  care: 130,
};

/** Numero WhatsApp leggibile: +39 339 161 6757 */
export const whatsappLabel = (n: string) => n ? `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : '';

export const formatEuro = (n: number, lang: 'it' | 'en') =>
  new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    useGrouping: 'always',
  } as Intl.NumberFormatOptions).format(n);
