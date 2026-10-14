/**
 * Clienti reali. Un oggetto per progetto (Amici del Cuore è passato al laboratorio): per aggiungere Fioreria Vania
 * basta compilare il suo blocco e mettere `status: 'live'`.
 * Niente numeri inventati: `results` resta vuoto finché il cliente non
 * fornisce dati veri.
 */
import type { Lang } from '../i18n';

type L = { it: string; en: string };

export type Project = {
  slug: string;
  index: string;
  status: 'live' | 'soon';
  client: string;
  location: string;
  year: string;
  sector: L;
  services: L[];
  url?: string; // indirizzo del sito online
  urlPlaceholder?: boolean; // true = link non ancora attivo
  accent: [string, string];
  title: L;
  blurb: L;
  challenge: L;
  solution: L;
  highlights: L[];
  results: { label: L; value: string }[];
  quote?: { text: L; author: string };
  media: {
    poster: string;
    video?: string;
    gallery: { src: string; alt: L; mobile?: boolean; w?: number; h?: number }[];
  };
};

export const projects: Project[] = [
  {
    slug: 'gelateria-saimon',
    index: '01',
    status: 'live',
    client: 'Gelateria Saimon',
    location: 'Thiene (VI)',
    year: '2026',
    sector: { it: 'Gelateria artigianale', en: 'Artisan gelato shop' },
    services: [
      { it: 'Sito multipagina', en: 'Multi-page website' },
      { it: 'Design system', en: 'Design system' },
      { it: 'Logo animato', en: 'Animated logo' },
    ],
    url: 'https://www.saimongelateria.it',
    urlPlaceholder: true, // DA TOGLIERE quando il sito è online
    accent: ['#BFCFB4', '#5E7351'],
    title: { it: 'Un gelato che si scioglie nel logo', en: 'Gelato that melts into the logo' },
    blurb: {
      it: 'Panna, salvia e un marchio che cola nel monogramma: il sito racconta il laboratorio prima ancora del gusto.',
      en: 'Cream, sage and a wordmark that drips into its monogram: the site tells the story of the lab before the first taste.',
    },
    challenge: {
      it: 'Saimon fa gelato artigianale a Thiene dal 2018, con una clientela affezionata e un laboratorio che lavora anche su semifreddi e torte nuziali. Mancava un sito capace di raccontare la qualità delle materie prime e di trasformare le visite in prenotazioni.',
      en: 'Saimon has made artisan gelato in Thiene since 2018, with loyal customers and a lab that also makes semifreddi and wedding cakes. What was missing was a site that could convey the quality of the ingredients and turn visits into bookings.',
    },
    solution: {
      it: "Un sito multipagina calmo ed elegante, costruito su un design system documentato (panna, salvia, legno chiaro). In home il marchio SAIMON si fonde in una goccia che vola e cola dentro il monogramma. Le pagine prodotti, semifreddi e matrimoni hanno video e foto ad alta saturazione, mentre il modulo prenotazioni compone il messaggio e lo apre su WhatsApp, già pronto da inviare.",
      en: 'A calm, elegant multi-page site built on a documented design system (cream, sage, light wood). On the homepage the SAIMON wordmark melts into a drop that flies up and fills the monogram. Product, semifreddo and wedding pages lead with saturated video and photography, while the booking form writes the message and opens it in WhatsApp, ready to send.',
    },
    highlights: [
      { it: 'Logo animato su misura: il marchio cola nel monogramma', en: 'Custom logo animation: the wordmark drips into the monogram' },
      { it: 'Design system con token di colore, tipografia e spaziature', en: 'Design system with colour, type and spacing tokens' },
      { it: 'Prenotazioni via WhatsApp con messaggio precompilato', en: 'WhatsApp bookings with a pre-written message' },
      { it: 'Pagine dedicate a gelati, semifreddi, matrimoni e allergeni', en: 'Dedicated pages for gelato, semifreddi, weddings and allergens' },
    ],
    results: [],
    media: {
      poster: '/media/work/saimon-scroll.webp',
      video: '/media/work/saimon-scroll.mp4',
      gallery: [
        { src: '/media/work/saimon-filosofia-d-2.webp', w: 1440, h: 900, alt: { it: 'Pagina filosofia', en: 'Philosophy page' } },
        { src: '/media/work/saimon-index-m.webp', w: 390, h: 844, alt: { it: 'Home su smartphone', en: 'Homepage on mobile' }, mobile: true },
        { src: '/media/work/saimon-prodotti-d-2.webp', w: 1440, h: 900, alt: { it: 'Pagina prodotti', en: 'Products page' } },
        { src: '/media/work/saimon-matrimoni-d-2.webp', w: 1440, h: 900, alt: { it: 'Pagina matrimoni', en: 'Weddings page' } },
        { src: '/media/work/saimon-matrimoni-m.webp', w: 390, h: 844, alt: { it: 'Matrimoni su smartphone', en: 'Weddings on mobile' }, mobile: true },
      ],
    },
  },
  {
    slug: 'scriptkiosk',
    index: '02',
    status: 'live',
    client: 'ScriptKiosk',
    location: 'Schio (VI)',
    year: '2026',
    sector: { it: 'Automazione per farmacie', en: 'Pharmacy automation' },
    services: [
      { it: 'Landing di prodotto', en: 'Product landing page' },
      { it: 'Copy in inglese', en: 'English copywriting' },
      { it: 'Animazioni', en: 'Motion' },
    ],
    url: 'https://www.scriptkiosk.com',
    accent: ['#2E8C93', '#0F4C5C'],
    title: { it: 'Un distributore di ricette spiegato in tre passaggi', en: 'A prescription kiosk explained in three steps' },
    blurb: {
      it: 'Il distributore automatico che consegna le ricette 24 ore su 24: un prodotto tecnico raccontato in modo semplice, per farmacisti e pazienti.',
      en: 'The automated kiosk that hands out prescriptions around the clock: a technical product told simply, for pharmacists and patients.',
    },
    challenge: {
      it: 'ScriptKiosk è il distributore di farmaci su prescrizione progettato e costruito in Italia da Videosystem, a Schio. Il ritiro avviene 24 ore su 24, anche a farmacia chiusa. Serviva un sito in inglese che spiegasse un prodotto tecnico a due pubblici molto diversi: il farmacista che lo compra e il paziente che lo usa.',
      en: 'ScriptKiosk is the prescription pick-up kiosk designed and built in Italy by Videosystem in Schio. Patients collect their medicine 24/7, even when the pharmacy is closed. It needed an English site that explains a technical product to two very different audiences: the pharmacist who buys it and the patient who uses it.',
    },
    solution: {
      it: 'Una landing chiara e luminosa che parte dal prodotto e lo racconta in tre passaggi: il farmacista carica la ricetta, il paziente riceve un PIN via SMS, ritira dal touchscreen. Due percorsi paralleli, uno per il paziente e uno per la farmacia, poi le caratteristiche tecniche spiegate senza gergo e la storia dell’azienda, attiva nell’automazione dal 1991.',
      en: 'A clear, bright landing page that starts from the product and tells it in three steps: the pharmacist loads the prescription, the patient gets a PIN by SMS, then collects it from the touchscreen. Two parallel paths, one for patients and one for the pharmacy, then the technical features explained without jargon and the story of a company working in automation since 1991.',
    },
    highlights: [
      { it: 'Il funzionamento in tre passaggi: carica, notifica, ritira', en: 'How it works in three steps: load, notify, collect' },
      { it: 'Due percorsi: uno per il paziente, uno per il farmacista', en: 'Two paths: one for patients, one for pharmacists' },
      { it: 'Caratteristiche tecniche raccontate senza gergo', en: 'Technical features told without jargon' },
      { it: 'Contatti e richieste di informazioni in primo piano', en: 'Contact and enquiries up front' },
    ],
    results: [],
    media: {
      poster: '/media/work/scriptkiosk-poster.webp',
      video: '/media/work/scriptkiosk-scroll.mp4',
      gallery: [
        { src: '/media/work/scriptkiosk-kiosk.webp', w: 960, h: 510, alt: { it: 'Il distributore in evidenza', en: 'The kiosk up front' } },
        { src: '/media/work/scriptkiosk-esperienze.webp', w: 960, h: 510, alt: { it: 'I due percorsi, paziente e farmacia', en: 'The two paths, patient and pharmacy' } },
        { src: '/media/work/scriptkiosk-passaggi.webp', w: 960, h: 510, alt: { it: 'Il funzionamento in tre passaggi', en: 'How it works in three steps' } },
      ],
    },
  },
  {
    slug: 'fioreria-vania',
    index: '03',
    status: 'soon',
    client: 'Fioreria Vania',
    location: '',
    year: '2026',
    sector: { it: 'Fioreria', en: 'Florist' },
    services: [],
    accent: ['#F472B6', '#7C3AED'],
    title: { it: 'Sta sbocciando', en: 'In bloom' },
    blurb: {
      it: 'Un nuovo progetto sta prendendo forma. Torna presto.',
      en: 'A new project is taking shape. Check back soon.',
    },
    challenge: { it: '', en: '' },
    solution: { it: '', en: '' },
    highlights: [],
    results: [],
    media: { poster: '', gallery: [] },
  },
];

export const liveProjects = projects.filter((p) => p.status === 'live');
export const pick = (v: L, lang: Lang) => v[lang];
