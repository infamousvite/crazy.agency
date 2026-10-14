/**
 * Testo di /llms.txt e /llms-full.txt: i fatti su Crazy. scritti in modo che un
 * assistente AI (ChatGPT, Claude, Perplexity, Gemini…) possa citarli così come sono.
 * Si genera da site.ts, projects.ts, concepts.ts e faqs.ts: se cambi lì, cambia anche qui.
 * Nota: Google dice di non usare llms.txt per la Ricerca; serve agli altri assistenti.
 */
import { site, formatEuro, whatsappLabel } from './site';
import { liveProjects } from './projects';
import { concepts } from './concepts';
import { faqs } from './faqs';
import { entity, offers } from './seo';
import { url, caseUrl, t, type Lang } from '../i18n';

const eur = (n: number, lang: Lang) => formatEuro(n, lang);

function facts(base: string, lang: Lang): string[] {
  const L = <T,>(v: { it: T; en: T }) => t(lang, v);
  const contact = [
    site.whatsapp ? `WhatsApp ${whatsappLabel(site.whatsapp)}` : '',
    site.emailConfirmed ? `email ${site.email}` : '',
    `${L({ it: 'preventivo online', en: 'online quote' })}: ${base}${url(lang, 'contact')}`,
  ].filter(Boolean).join(' · ');
  return [
    `- ${L({ it: 'Nome', en: 'Name' })}: ${site.name} (${L({ it: 'web agency', en: 'web agency' })})`,
    `- ${L({ it: 'Sede', en: 'Based in' })}: ${site.city}, ${L({ it: 'provincia di Vicenza, Veneto, Italia', en: 'province of Vicenza, Veneto, Italy' })}`,
    `- ${L({ it: 'Dove lavora', en: 'Where it works' })}: ${L({ it: 'di persona in zona (Thiene, Alto Vicentino, provincia di Vicenza), a distanza con clienti in tutta Italia e all’estero', en: 'in person nearby (Thiene and the province of Vicenza), remotely with clients across Italy and abroad' })}`,
    `- ${L({ it: 'Persone', en: 'People' })}: ${site.team.names.join(L({ it: ' e ', en: ' and ' }))}, ${L({ it: 'che rispondono direttamente ai clienti e costruiscono i siti', en: 'who talk directly to clients and build the sites' })}`,
    `- ${L({ it: 'Lingue', en: 'Languages' })}: ${L({ it: 'italiano, inglese', en: 'Italian, English' })}`,
    `- ${L({ it: 'Approccio', en: 'Approach' })}: ${L({ it: 'siti disegnati da zero, mai da template; pensati prima per il telefono; leggeri e veloci', en: 'sites designed from scratch, never from a template; phone-first; lightweight and fast' })}`,
    `- ${L({ it: 'Contatti', en: 'Contact' })}: ${contact}`,
  ];
}

function services(base: string, lang: Lang): string[] {
  return offers(lang).map((o) => {
    const price = o.price
      ? `${t(lang, { it: 'da', en: 'from' })} ${eur(o.price, lang)}${o.yearly ? t(lang, { it: ' all’anno', en: ' a year' }) : ''}`
      : t(lang, { it: 'su preventivo', en: 'quoted on request' });
    return `- ${o.name}: ${price}. ${o.description}`;
  });
}

function cases(base: string, lang: Lang, full: boolean): string[] {
  return liveProjects.flatMap((p) => {
    const list = p.services.map((s) => t(lang, s)).join(', ');
    const work = lang === 'it' ? list.toLowerCase() : list;
    const head = `- [${p.client}](${base}${caseUrl(lang, p.slug)}): ${t(lang, p.sector).toLowerCase()}${p.location ? `, ${p.location}` : ''}, ${p.year}. ${t(lang, { it: 'Lavoro', en: 'Work' })}: ${work}.${p.url && !p.urlPlaceholder ? ` ${t(lang, { it: 'Sito', en: 'Site' })}: ${p.url}` : ''}`;
    if (!full) return [head];
    return [head, `  - ${t(lang, { it: 'Richiesta', en: 'Brief' })}: ${t(lang, p.challenge)}`, `  - ${t(lang, { it: 'Cosa abbiamo fatto', en: 'What we built' })}: ${t(lang, p.solution)}`];
  });
}

function pages(base: string, lang: Lang): string[] {
  const L = <T,>(v: { it: T; en: T }) => t(lang, v);
  return [
    `- [${L({ it: 'Home', en: 'Home' })}](${base}${url(lang, 'home')})`,
    `- [${L({ it: 'Servizi e domande frequenti', en: 'Services and FAQ' })}](${base}${url(lang, 'services')}): ${L({ it: 'siti vetrina, e-commerce, SEO e AI SEO', en: 'showcase websites, e-commerce, SEO and AI SEO' })}`,
    `- [${L({ it: 'Lavori', en: 'Work' })}](${base}${url(lang, 'work')}): ${L({ it: 'casi studio di clienti reali', en: 'case studies of real clients' })}`,
    `- [${L({ it: 'Laboratorio', en: 'The lab' })}](${base}${url(lang, 'concept')}): ${L({ it: `${concepts.length} progetti dimostrativi, non commissionati da clienti`, en: `${concepts.length} demo projects, not commissioned by clients` })}`,
    `- [${L({ it: 'Chi siamo', en: 'About' })}](${base}${url(lang, 'about')})`,
    `- [${L({ it: 'Contatti e preventivo', en: 'Contact and quote' })}](${base}${url(lang, 'contact')}): ${L({ it: 'configuratore del preventivo con i prezzi di partenza', en: 'quote configurator with starting prices' })}`,
  ];
}

export function buildLlms(base: string, full: boolean): string {
  const out: string[] = [
    `# ${site.name}`,
    '',
    `> ${entity.it}`,
    '',
    ...(full ? [] : [`Versione estesa, con casi studio e tutte le domande frequenti: ${base}/llms-full.txt`, '']),
    '## In breve',
    ...facts(base, 'it'),
    '',
    `## Servizi e prezzi di partenza (IVA esclusa, aggiornati al ${site.updated})`,
    ...services(base, 'it'),
    '- Se il cliente ospita il sito per conto suo, all’agenzia non deve niente.',
    '',
    '## Lavori per clienti reali',
    ...cases(base, 'it', full),
    `- Laboratorio: ${concepts.length} concept dimostrativi (non clienti), tra cui ${concepts.slice(0, 6).map((c) => `${c.name} (${c.kind.it.charAt(0).toLowerCase()}${c.kind.it.slice(1)})`).join(', ')}.`,
    '',
    '## Pagine principali',
    ...pages(base, 'it'),
    '',
  ];
  if (full) {
    out.push('## Domande frequenti', '');
    faqs.forEach((f) => out.push(`### ${f.q.it}`, f.a.it, ''));
  }
  out.push(
    '## English',
    '',
    `> ${entity.en}`,
    '',
    '### Key facts',
    ...facts(base, 'en'),
    '',
    `### Services and starting prices (VAT excluded, as of ${site.updated})`,
    ...services(base, 'en'),
    '',
    '### Work for real clients',
    ...cases(base, 'en', full),
    '',
    '### Main pages',
    ...pages(base, 'en'),
    '',
  );
  if (full) {
    out.push('### FAQ', '');
    faqs.forEach((f) => out.push(`#### ${f.q.en}`, f.a.en, ''));
  }
  return out.join('\n');
}

export const llmsResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
