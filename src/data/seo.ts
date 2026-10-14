/**
 * Dati strutturati (schema.org, JSON-LD) e testi "entità" per Google e per
 * gli assistenti AI (ChatGPT, Gemini, Perplexity, Claude…).
 * Tutto parte da site.ts, projects.ts e faqs.ts: niente dati scritti due volte.
 * Regola: solo fatti veri. Niente recensioni, voti, indirizzi o numeri inventati.
 */
import { site, pricing, formatEuro } from './site';
import { faqs } from './faqs';
import { url, caseUrl, t, type Lang } from '../i18n';
import type { Project } from './projects';

type Json = Record<string, unknown>;
export type Crumb = { name: string; path: string };

export const ids = (base: string) => ({
  org: `${base}/#organization`,
  website: `${base}/#website`,
  person: (name: string) => `${base}/#${name.toLowerCase()}`,
});

/** Frase che dice chi, cosa e dove: la stessa in footer, llms.txt e dati strutturati. */
export const entity = {
  it: `Crazy. è una web agency di ${site.city} (Vicenza, Veneto): siti vetrina, e-commerce, SEO e AI SEO su misura, mai da template. Dietro ci sono ${site.team.names.join(' e ')}, che rispondono ai clienti e costruiscono i siti. Lavoriamo in italiano e in inglese, di persona in zona e a distanza con clienti in Italia e all’estero.`,
  en: `Crazy. is a web agency in ${site.city} (Vicenza, Veneto, Italy): made-to-measure showcase websites, e-commerce, SEO and AI SEO, never from a template. It is run by ${site.team.names.join(' and ')}, who talk to clients and build the sites. We work in Italian and English, in person nearby and remotely with clients in Italy and abroad.`,
};

/** I servizi con i prezzi di partenza (IVA esclusa), per OfferCatalog e llms.txt. */
export const offers = (lang: Lang) => {
  const L = <T,>(v: { it: T; en: T }) => t(lang, v);
  return [
    {
      key: 'landing',
      name: 'Landing page',
      description: L({ it: 'Una pagina sola, su misura: perfetta per un prodotto, un evento o per partire subito.', en: 'A single made-to-measure page: perfect for a product, an event or getting started fast.' }),
      price: pricing.landing,
      serviceType: L({ it: 'Sito vetrina', en: 'Showcase website' }),
    },
    {
      key: 'multipage',
      name: L({ it: 'Sito multipagina', en: 'Multi-page website' }),
      description: L({ it: 'Sito vetrina su misura con home, servizi, chi siamo, contatti e tutte le pagine che servono.', en: 'Made-to-measure showcase website with home, services, about, contact and every page you need.' }),
      price: pricing.multipage,
      serviceType: L({ it: 'Sito vetrina', en: 'Showcase website' }),
    },
    {
      key: 'ecommerce',
      name: L({ it: 'Sito + e-commerce', en: 'Website + e-commerce' }),
      description: L({ it: 'Il sito completo con negozio online: catalogo, carrello, pagamenti sicuri, ordini e spedizioni.', en: 'The full website plus an online shop: catalogue, cart, secure payments, orders and shipping.' }),
      price: pricing.ecommerce,
      serviceType: 'E-commerce',
    },
    {
      key: 'seo',
      name: 'SEO & AI SEO',
      description: L({ it: 'Struttura tecnica, velocità, contenuti, dati strutturati e scheda Google Business per farsi trovare su Google e citare da assistenti come ChatGPT, Gemini e Perplexity.', en: 'Technical structure, speed, content, structured data and Google Business profile to get found on Google and quoted by assistants such as ChatGPT, Gemini and Perplexity.' }),
      price: 0,
      serviceType: 'SEO',
    },
    {
      key: 'care',
      name: L({ it: 'Mantenimento annuale', en: 'Yearly upkeep' }),
      description: L({ it: 'Hosting, dominio e piccole modifiche (testi, foto, orari, prezzi). Il sito resta del cliente.', en: 'Hosting, domain and small changes (text, photos, opening hours, prices). The site stays the client’s.' }),
      price: pricing.care,
      serviceType: L({ it: 'Manutenzione siti web', en: 'Website maintenance' }),
      yearly: true,
    },
  ];
};

/** Organizzazione: ProfessionalService (sottotipo di LocalBusiness) senza via, solo città. */
export function orgSchema(lang: Lang, base: string): Json {
  const id = ids(base);
  const L = <T,>(v: { it: T; en: T }) => t(lang, v);
  const catalog = offers(lang).map((o) => {
    const service = {
      '@type': 'Service',
      name: o.name,
      description: o.description,
      serviceType: o.serviceType,
      provider: { '@id': id.org },
      areaServed: L({ it: 'Italia e resto del mondo (a distanza)', en: 'Italy and worldwide (remotely)' }),
    };
    if (!o.price) return { '@type': 'Offer', itemOffered: service, url: base + url(lang, 'contact') };
    return {
      '@type': 'Offer',
      itemOffered: service,
      url: base + url(lang, 'contact'),
      priceCurrency: 'EUR',
      price: o.price,
      priceSpecification: {
        '@type': o.yearly ? 'UnitPriceSpecification' : 'PriceSpecification',
        price: o.price,
        minPrice: o.price,
        priceCurrency: 'EUR',
        valueAddedTaxIncluded: false,
        ...(o.yearly ? { unitCode: 'ANN', unitText: L({ it: 'all’anno', en: 'per year' }) } : {}),
      },
    };
  });
  return {
    '@type': 'ProfessionalService',
    '@id': id.org,
    name: site.name,
    alternateName: ['Crazy', 'Crazy web agency', 'Crazy. web agency'],
    url: base + '/',
    logo: { '@type': 'ImageObject', url: base + '/apple-touch-icon.png', width: 180, height: 180 },
    image: base + '/og.png',
    description: t(lang, entity),
    slogan: L({ it: 'Siti su misura, curati in ogni dettaglio.', en: 'Made-to-measure websites, crafted down to the detail.' }),
    ...(site.emailConfirmed ? { email: site.email } : {}),
    ...(site.whatsapp ? { telephone: '+' + site.whatsapp } : {}),
    ...(site.vat ? { vatID: site.vat.replace(/^P\.?\s?IVA\s*/i, '') } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      ...(site.whatsapp ? { telephone: '+' + site.whatsapp } : {}),
      ...(site.emailConfirmed ? { email: site.email } : {}),
      url: base + url(lang, 'contact'),
      availableLanguage: ['Italian', 'English'],
    },
    founder: site.team.names.map((name) => ({ '@id': id.person(name) })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: 'VI',
      addressCountry: site.country,
    },
    areaServed: [
      { '@type': 'City', name: site.city },
      { '@type': 'AdministrativeArea', name: site.areaServed.province },
      { '@type': 'AdministrativeArea', name: site.areaServed.regionName },
      { '@type': 'Country', name: site.areaServed.countryName },
      'Worldwide',
    ],
    knowsLanguage: ['it', 'en'],
    knowsAbout: L({
      it: ['Siti vetrina', 'Landing page', 'Siti multipagina', 'E-commerce', 'Web design', 'SEO', 'SEO locale', 'AI SEO', 'Dati strutturati', 'Google Business Profile'],
      en: ['Showcase websites', 'Landing pages', 'Multi-page websites', 'E-commerce', 'Web design', 'SEO', 'Local SEO', 'AI SEO', 'Structured data', 'Google Business Profile'],
    }),
    priceRange: `${formatEuro(pricing.landing, lang)}+`,
    currenciesAccepted: 'EUR',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: L({ it: 'Servizi di Crazy.', en: 'Crazy. services' }),
      itemListElement: catalog,
    },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function peopleSchema(base: string): Json[] {
  const id = ids(base);
  return site.team.names.map((name) => ({
    '@type': 'Person',
    '@id': id.person(name),
    name,
    worksFor: { '@id': id.org },
    knowsLanguage: ['it', 'en'],
  }));
}

export function websiteSchema(lang: Lang, base: string): Json {
  const id = ids(base);
  return {
    '@type': 'WebSite',
    '@id': id.website,
    url: base + '/',
    name: site.name,
    alternateName: 'Crazy web agency',
    description: t(lang, {
      it: 'Sito di Crazy., web agency di Thiene (Vicenza): siti vetrina, e-commerce, SEO e AI SEO.',
      en: 'Website of Crazy., a web agency in Thiene (Vicenza, Italy): showcase websites, e-commerce, SEO and AI SEO.',
    }),
    inLanguage: ['it', 'en'],
    publisher: { '@id': id.org },
  };
}

export function breadcrumbSchema(lang: Lang, base: string, pageUrl: string, crumbs: Crumb[]): Json {
  const all: Crumb[] = [{ name: 'Home', path: url(lang, 'home') }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: base + c.path })),
  };
}

export function faqSchema(lang: Lang, pageUrl: string): Json {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    inLanguage: lang,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: t(lang, f.q),
      acceptedAnswer: { '@type': 'Answer', text: t(lang, f.a) },
    })),
  };
}

/** Caso studio: il lavoro fatto per un cliente reale. */
export function caseSchema(lang: Lang, base: string, p: Project): Json {
  const id = ids(base);
  const pageUrl = base + caseUrl(lang, p.slug);
  return {
    '@type': 'CreativeWork',
    '@id': `${pageUrl}#work`,
    url: pageUrl,
    name: `${p.client}: ${t(lang, p.title)}`,
    headline: t(lang, p.title),
    description: t(lang, p.blurb),
    abstract: t(lang, p.challenge),
    genre: t(lang, { it: 'Caso studio', en: 'Case study' }),
    keywords: p.services.map((s) => t(lang, s)).join(', '),
    inLanguage: lang,
    dateCreated: p.year,
    image: base + p.media.poster,
    creator: { '@id': id.org },
    publisher: { '@id': id.org },
    about: {
      '@type': 'Organization',
      name: p.client,
      description: t(lang, p.sector),
      ...(p.location ? { location: { '@type': 'Place', name: p.location } } : {}),
      ...(p.url && !p.urlPlaceholder ? { url: p.url } : {}),
    },
    ...(p.url && !p.urlPlaceholder
      ? { workExample: { '@type': 'WebSite', name: p.client, url: p.url, creator: { '@id': id.org } } }
      : {}),
  };
}

/** Elenco dei casi studio (pagina Lavori). */
export function caseListSchema(lang: Lang, base: string, pageUrl: string, list: Project[]): Json {
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#cases`,
    name: t(lang, { it: 'Casi studio di Crazy.', en: 'Crazy. case studies' }),
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: base + caseUrl(lang, p.slug),
      name: p.client,
    })),
  };
}
