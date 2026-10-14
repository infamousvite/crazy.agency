import type { APIRoute } from 'astro';

/**
 * robots.txt generato: il dominio arriva da astro.config.mjs (site).
 * Politica: TUTTI i motori di ricerca e gli assistenti AI possono leggere il sito,
 * perché vogliamo essere trovati su Google/Bing e citati da ChatGPT, Gemini,
 * Perplexity, Claude, Copilot, Apple Intelligence.
 * Nomi dei crawler verificati a ottobre 2026 sulle pagine ufficiali:
 * OpenAI (developers.openai.com/api/docs/bots), Anthropic (support.claude.com),
 * Perplexity (docs.perplexity.ai/guides/bots), Google (developers.google.com/search/docs/crawling-indexing/google-common-crawlers).
 * Per escluderne uno: aggiungi un blocco "User-agent: NomeBot" con "Disallow: /".
 */
const groups: [string, string[]][] = [
  ['Motori di ricerca', ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot', 'Applebot', 'YandexBot']],
  ['OpenAI / ChatGPT (ricerca, link aperti dagli utenti, addestramento)', ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot']],
  ['Google Gemini e Vertex AI (addestramento e grounding)', ['Google-Extended', 'Google-CloudVertexBot']],
  ['Anthropic / Claude', ['Claude-SearchBot', 'Claude-User', 'ClaudeBot']],
  ['Perplexity', ['PerplexityBot', 'Perplexity-User']],
  ['Apple Intelligence', ['Applebot-Extended']],
  ['Altri assistenti AI', ['MistralAI-User', 'Meta-ExternalAgent', 'CCBot']],
];

export const GET: APIRoute = ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const body = [
    '# Crazy. web agency: tutti i motori di ricerca e gli assistenti AI sono i benvenuti.',
    '',
    ...groups.flatMap(([label, bots]) => [`# ${label}`, ...bots.map((b) => `User-agent: ${b}`), 'Allow: /', '']),
    '# Tutti gli altri',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
