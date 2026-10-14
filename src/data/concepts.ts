/**
 * Concept / Lab: progetti dimostrativi, non commissionati da clienti.
 * Sul sito sono sempre etichettati come "Concept".
 */
type L = { it: string; en: string };

export type Concept = {
  slug: string;
  name: string;
  kind: L;
  note: L;
  tags: string[];
  url?: string; // anteprima online del concept
};

export const concepts: Concept[] = [
  { slug: 'amici-del-cuore', name: 'Amici del Cuore', kind: { it: 'Sito associazione', en: 'Non-profit website' }, note: { it: 'Un sito per un’associazione di volontariato, leggibile anche da chi ha più di settant’anni.', en: 'A site for a volunteer association, readable even for people over seventy.' }, tags: ['Accessibilità', 'Non profit'] },
  { slug: 'soda', name: 'Hypr Fizz', kind: { it: 'Landing prodotto 3D', en: '3D product landing' }, note: { it: 'Una lattina cromata che ruota mentre scorri.', en: 'A chrome can that spins as you scroll.' }, tags: ['WebGL', 'Landing'], url: 'https://soda-fizz.vercel.app' },
  { slug: 'gioielleria', name: 'Gioielleria', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Luce, mare e tipografia classica per un marchio di gioielli.', en: 'Light, sea and classic type for a jewellery brand.' }, tags: ['Video', 'Brand'], url: 'https://gioielleria-dun.vercel.app' },
  { slug: 'impresa-edile', name: 'Impresa edile', kind: { it: 'Sito vetrina 3D', en: '3D showcase site' }, note: { it: 'Una casa in legno che si costruisce davanti ai tuoi occhi.', en: 'A timber house that builds itself in front of you.' }, tags: ['3D', 'Scroll'], url: 'https://impresa-edile-lime.vercel.app' },
  { slug: 'gelateria', name: 'Il Gelato Perfetto', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Ingredienti in volo e panna che esplode al rallentatore.', en: 'Flying ingredients and cream in slow motion.' }, tags: ['Video', 'Food'], url: 'https://gelateria-blush.vercel.app' },
  { slug: 'abbigliamento', name: 'Atelier', kind: { it: 'E-commerce moda', en: 'Fashion e-commerce' }, note: { it: 'Catalogo editoriale con schede prodotto in rosso pieno.', en: 'An editorial catalogue with bold red product cards.' }, tags: ['E-commerce'], url: 'https://abbigliamento.vercel.app' },
  { slug: 'farmacia', name: 'Farmacia', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Un caduceo animato e servizi chiari per la salute di tutti i giorni.', en: 'An animated caduceus and clear everyday health services.' }, tags: ['SVG', 'Local'], url: 'https://farmacia-hazel-seven.vercel.app' },
  { slug: 'ultra-watch', name: 'Ultra Watch', kind: { it: 'Landing prodotto 3D', en: '3D product landing' }, note: { it: 'Uno smartwatch in 3D che si esplora con lo scroll.', en: 'A 3D smartwatch you explore by scrolling.' }, tags: ['WebGL', 'Product'], url: 'https://watch-ultra-rho.vercel.app' },
  { slug: 'dentista', name: 'Studio dentistico', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Toni chiari e numeri che rassicurano prima della visita.', en: 'Light tones and reassuring numbers before the visit.' }, tags: ['Local', 'Health'], url: 'https://dentista-sooty-seven.vercel.app' },
  { slug: 'parrucchiera', name: 'Salone', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Calligrafia, bianco e nero e prenotazione in primo piano.', en: 'Calligraphy, black and white and booking up front.' }, tags: ['Booking', 'Beauty'], url: 'https://parrucchiera.vercel.app' },
  { slug: 'toelettatura', name: 'Toelettatura', kind: { it: 'Sito vetrina', en: 'Showcase site' }, note: { it: 'Servizi spiegati con calma per chi ama il proprio cane.', en: 'Services explained calmly for people who love their dogs.' }, tags: ['Local', 'Pets'], url: 'https://toelettatura-sooty.vercel.app' },
];
