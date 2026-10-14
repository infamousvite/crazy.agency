/**
 * Domande frequenti. `home: true` = compare anche in home.
 * Il prezzo del mantenimento arriva da `pricing.care` in site.ts.
 */
import { pricing } from './site';
type L = { it: string; en: string };
export type Faq = { q: L; a: L; home?: boolean };

const care = `${pricing.care} €`;

export const faqs: Faq[] = [
  {
    home: true,
    q: { it: 'Quanto tempo ci vuole?', en: 'How long does it take?' },
    a: {
      it: 'Dipende da pagine e contenuti: una landing è il lavoro più rapido, un e-commerce quello più lungo. Nel preventivo trovi una data di consegna precisa, e durante il lavoro ti mostriamo i progressi.',
      en: 'It depends on pages and content: a landing page is the quickest job, an e-commerce site the longest. Your quote includes a precise delivery date, and we show you progress along the way.',
    },
  },
  {
    home: true,
    q: { it: 'Il sito è mio?', en: 'Do I own the site?' },
    a: {
      it: 'Sì, il sito è tuo. Noi teniamo solo hosting e dominio, e se li vuoi te li cediamo. Se preferisci arrangiarti, ti consegniamo il sito completo e lo metti online dove vuoi.',
      en: 'Yes, the site is yours. We only look after hosting and the domain, and we hand them over if you want them. If you’d rather manage it yourself, we deliver the complete site and you put it online wherever you like.',
    },
  },
  {
    home: true,
    q: { it: 'Ci sono costi ogni anno?', en: 'Are there yearly costs?' },
    a: {
      it: `Sì: il mantenimento, con hosting, dominio e piccole modifiche, parte da ${care} all’anno. Se ospiti il sito per conto tuo, a noi non devi niente.`,
      en: `Yes: upkeep, covering hosting, the domain and small changes, starts at ${care} a year. If you host the site yourself, you owe us nothing.`,
    },
  },
  {
    home: true,
    q: { it: 'E se dopo voglio cambiare qualcosa?', en: 'What if I want to change something later?' },
    a: {
      it: 'Le piccole modifiche, come testi, foto, orari o prezzi, sono comprese nel mantenimento: ci scrivi e le facciamo noi. Per cambiamenti più grandi ti mandiamo un preventivo a parte.',
      en: 'Small changes, such as text, photos, opening hours or prices, are included in the upkeep: message us and we do them. For bigger changes we send you a separate quote.',
    },
  },
  {
    q: { it: 'Quanto costa un sito?', en: 'How much does a website cost?' },
    a: {
      it: `Dipende dal tipo di sito, dalle pagine e dai contenuti. Nel configuratore del preventivo scegli il tipo di sito e vedi subito il prezzo di partenza; poi ti mandiamo un preventivo su misura.`,
      en: `It depends on the type of site, the pages and the content. In the quote configurator you pick the type of site and see the starting price right away; then we send you a tailored quote.`,
    },
  },
  {
    q: { it: 'Cos’è l’AI SEO?', en: 'What is AI SEO?' },
    a: {
      it: 'Sono gli accorgimenti che rendono il tuo sito comprensibile e citabile dagli assistenti come ChatGPT, Gemini, Perplexity e dalle risposte AI di Google.',
      en: 'It’s the work that makes your site understandable and quotable by assistants such as ChatGPT, Gemini, Perplexity and Google’s AI answers.',
    },
  },
  {
    q: { it: 'Lavorate solo in zona?', en: 'Do you only work locally?' },
    a: {
      it: 'Siamo a Thiene (VI): in zona ci incontriamo di persona, ma lavoriamo anche a distanza con clienti in Italia e all’estero.',
      en: 'We are based in Thiene, Italy: nearby we meet in person, but we also work remotely with clients in Italy and abroad.',
    },
  },
  {
    q: { it: 'Fate anche siti in inglese?', en: 'Do you build websites in English?' },
    a: {
      it: 'Sì, lavoriamo in italiano e in inglese. La landing di ScriptKiosk, per esempio, è tutta in inglese.',
      en: 'Yes, we work in Italian and English. The ScriptKiosk landing page, for example, is entirely in English.',
    },
  },
  {
    q: { it: 'Le animazioni rallentano il sito?', en: 'Does motion slow the site down?' },
    a: {
      it: 'Non se sono fatte bene: prima arrivano i contenuti, poi gli effetti, e chi preferisce meno movimento li vede spenti.',
      en: 'Not when done right: content loads first, effects after, and people who prefer less motion see them switched off.',
    },
  },
];
