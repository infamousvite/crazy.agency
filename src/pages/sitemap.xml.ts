import type { APIRoute } from 'astro';
import { alt, altCase, type RouteKey } from '../i18n';
import { liveProjects } from '../data/projects';
import { site as data } from '../data/site';

/**
 * Sitemap con le due lingue collegate (hreflang it, en e x-default) e la data
 * dell'ultimo aggiornamento (site.updated). Privacy e cookie restano fuori (noindex).
 */
export const GET: APIRoute = ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const keys: RouteKey[] = ['home', 'services', 'work', 'concept', 'about', 'contact'];
  const groups = [...keys.map(alt), ...liveProjects.map((p) => altCase(p.slug))];
  const urls = groups.flatMap((g) => (['it', 'en'] as const).map((l) => `  <url>
    <loc>${base}${g[l]}</loc>
    <lastmod>${data.updated}</lastmod>
    <xhtml:link rel="alternate" hreflang="it" href="${base}${g.it}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${base}${g.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${g.it}"/>
  </url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
