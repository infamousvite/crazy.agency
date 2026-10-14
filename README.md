# Crazy. | sito della web agency

> **Tema chiaro ("Giorno")**: fondo lavanda chiarissimo, testo inchiostro, viola come campo pieno.
> La versione scura precedente è salvata nella cronologia Git: vedi "Tornare indietro" qui sotto.

## Tornare indietro

I punti di ripristino sono nella cartella `C:\Projects\Crazy - punti di ripristino`:

- `versione-scura.zip`: il sito scuro com'era prima del cambio;
- `versione-chiara.zip`: il tema chiaro così come l'avete approvato;
- `crazy-sito.bundle`: tutta la cronologia Git (le due versioni sopra più quella attuale).

**Senza Git:** estrai lo zip che ti serve in una cartella nuova, poi `npm install` e `npm run dev`.

**Con Git** (per avere la cronologia dentro questa cartella), da terminale:

```
cd "C:\Projects\Web Agency"
git init -b main
git fetch --update-head-ok "C:\Projects\Crazy - punti di ripristino\crazy-sito.bundle" "+refs/heads/*:refs/heads/*" "+refs/tags/*:refs/tags/*"
git reset
git log --oneline --decorate
```

Da lì in poi, con GitHub Desktop o VS Code vedi la cronologia, e `git switch -c prova-scura versione-scura`
apre la versione scura su un ramo a parte (`git switch main` per tornare).

Sito in **Astro + GSAP** (niente Three.js), in italiano e inglese.
Versione 3, tema chiaro: particelle "Crazy." nella hero (viola che sfuma nel verde acqua),
titoli larghi in Unbounded, tre schede dei servizi che si impilano mentre scorri, clienti su un
prisma 3D che gira con lo scroll, laboratorio con schede che si allargano al passaggio (e portano
all'anteprima del sito) e la chiusura "Facciamo qualcosa di folle?" su campo viola con il bottone
rotondo che gira.

Slogan: **"Siti su misura, curati in ogni dettaglio."** Niente template pre-confezionati.

## Avvio

Serve Node.js 22 o superiore.

```bash
npm install        # da rifare dopo il redesign: Three.js è stato tolto
npm run dev        # http://localhost:4321
npm run build      # sito statico in dist/
npm run preview    # prova la build di produzione
```

`dist/` si pubblica così com'è su Netlify, Vercel, Cloudflare Pages o qualsiasi hosting statico.

## Dove si cambia cosa

| Cosa | File |
|---|---|
| Email, WhatsApp, social, P.IVA, prezzi | `src/data/site.ts` |
| Clienti e case study (Saimon, ScriptKiosk, Vania) | `src/data/projects.ts` |
| Laboratorio (i concept, con link all'anteprima su Vercel) | `src/data/concepts.ts` |
| Testi dell'interfaccia e indirizzi IT/EN | `src/i18n/index.ts` |
| Colori, font, misure | `src/styles/global.css` (blocco `:root`) |
| Home: hero, schede servizi, prisma lavori, laboratorio, chiusura | `src/views/HomeView.astro` |
| Altre pagine | `src/views/*View.astro` |
| Bottone, fila del laboratorio, chiusura "Facciamo qualcosa di folle?" | `src/components/Cta.astro`, `Strip.astro`, `CtaBand.astro` |
| Immagini e video | `public/media/` |
| Regole di design (colori, font, animazioni, cosa non fare) | `DESIGN.md`, `PRODUCT.md` |

Ogni pagina esiste due volte (`src/pages/it/…` e `src/pages/en/…`), ma i testi stanno in un
solo posto: la vista riceve `lang` e sceglie la lingua.

### Aggiungere Fioreria Vania

1. Metti screenshot e video in `public/media/work/` (`.webp` 1440 px, video `.mp4` 1280 px, muto, pochi secondi).
2. In `src/data/projects.ts` compila il blocco `fioreria-vania` e cambia `status: 'soon'` in `status: 'live'`.
3. `npm run build`: le pagine del case study si creano da sole.

## Le animazioni (leggere e veloci)

| Script | Cosa fa |
|---|---|
| `src/scripts/particles.ts` | Il logo di particelle in WebGL2, solo nella hero: compare la z, calcia il punto viola che fa un'orbita attorno a "zy" mentre si compongono le altre lettere, poi si posa dopo la y. Il mouse le scansa; un clic sulle particelle fa una piccola esplosione (poi tornano al loro posto), un clic sul punto lo fa schizzare e rimbalzare per la hero prima di tornare a casa. Si sciolgono quando scorri via e si fermano fuori schermo. `?gl=0` le spegne. |
| `src/scripts/logo-motion.ts` | Il movimento del punto (calcio, orbita, rimbalzo) e della z. |
| `src/data/logo.ts`, `src/components/Logo.astro` | Il logo in SVG (z inclinata, punto viola): tracciati e componente per barra e footer, con l'animazione breve al passaggio del mouse. Favicon e icona: `public/favicon.svg`, `public/apple-touch-icon.png`. |
| `src/scripts/home.ts` | GSAP ScrollTrigger: le schede dei servizi che si impilano; il prisma 3D dei clienti (desktop da 1000 px, gira solo il video della faccia davanti), sul telefono le anteprime si raddrizzano. |
| `src/scripts/magnet.ts` | Il bottone rotondo della chiusura segue appena il mouse. |
| `src/scripts/reveal.ts`, `nav.ts`, `media.ts` | Comparse leggere, menu, video che partono solo quando sono visibili o al passaggio del mouse. |
| `src/scripts/quote.ts` | Configuratore del preventivo. |

Pagina Lavori: le finestre si raddrizzano con le timeline di scroll del CSS (nessun JavaScript; nei browser che non le supportano restano ferme).
Niente cursore personalizzato, niente tendina tra le pagine, niente scroll "finto": le pagine si aprono subito.
Con "riduci movimento" tutto resta fermo nello stato finale.

## Configuratore preventivo

Prezzi di partenza in `src/data/site.ts` (landing 400 €, multipagina 700 €, sito + e-commerce 1.200 €): compaiono solo nel configuratore, al primo passo.
Tre passi: tipo di sito, tempi, contatti (nome, cognome, azienda facoltativa, email, telefono facoltativo, note).
Per ricevere le richieste via email senza backend crea un form su [Formspree](https://formspree.io)
e copia `.env.example` in `.env`:

```
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Se la variabile è vuota, il configuratore apre il programma di posta con il riepilogo già scritto.

## Prima di andare online

Cerca `DA CONFERMARE` e `DA COMPLETARE` nel progetto:

- email: in `src/data/site.ts` metti l'indirizzo vero e `emailConfirmed: true` (finché è `false` l'email non compare da nessuna parte)
- P.IVA (`vat`), ragione sociale, WhatsApp, Instagram (`src/data/site.ts`); i campi vuoti non vengono mostrati
- dominio definitivo: solo in `astro.config.mjs` (`site`). Canonical, hreflang, sitemap, `robots.txt`, `llms.txt` e dati strutturati lo prendono da lì
- profili veri dell'agenzia in `sameAs` (`src/data/site.ts`): scheda Google Business Profile, Instagram, LinkedIn, Bing Places… solo link reali
- `updated` in `src/data/site.ts`: la data dell'ultimo aggiornamento dei contenuti (finisce in sitemap e dati strutturati)
- togliere `urlPlaceholder` da Saimon quando il sito è online (anteprima attuale: saimon-two.vercel.app)
- foto di Marco e Giorgia (`team.photo` in `src/data/site.ts`, verticale 4:5); finché manca c'è il monogramma G&M
- prezzo del mantenimento annuale: `pricing.care` in `src/data/site.ts` (oggi 130 €), usato nelle FAQ e nel configuratore
- privacy e cookie policy (`src/views/LegalView.astro`): sono scritte per com'è fatto il sito oggi; aggiungi fornitore di hosting/email e falle rileggere a un consulente
- risultati e citazioni dei clienti (`results` e `quote` in `projects.ts`), solo dati veri e con il loro permesso

## SEO e AI SEO già inclusi

Metodo: checklist delle skill **seo-audit**, **ai-seo** e **schema** (coreyhaines31/marketingskills) e
**seo-geo** / **seo-local** (AgriciDaniel/claude-seo), più le guide ufficiali di Google sulle funzioni AI.

| Cosa | Dove |
|---|---|
| Title, description, canonical, hreflang (it, en, x-default), Open Graph, Twitter, `robots` | `src/layouts/Base.astro` + i `title`/`description` in ogni `src/pages/**` |
| Dati strutturati JSON-LD in un unico `@graph`: ProfessionalService (Thiene, senza via) con fondatori, zone servite e listino con i prezzi di partenza, Person, WebSite, WebPage/AboutPage/ContactPage/CollectionPage, BreadcrumbList, FAQPage (solo Servizi), CreativeWork per i casi studio, ItemList dei lavori | `src/data/seo.ts` |
| `sitemap.xml` con `lastmod` e alternative di lingua | `src/pages/sitemap.xml.ts` |
| `robots.txt`: tutti i motori e gli assistenti AI ammessi (Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, Claude-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot…) | `src/pages/robots.txt.ts` |
| `llms.txt` e `llms-full.txt`: i fatti sull'agenzia, servizi e prezzi, lavori e FAQ, generati dai dati | `src/data/llms.ts` |
| Frase "chi, cosa, dove" nel footer di ogni pagina | `ui.footer.based` in `src/i18n/index.ts` |

Tutto si genera dai dati (`site.ts`, `projects.ts`, `faqs.ts`): se cambi un prezzo o aggiungi un lavoro,
pagine, dati strutturati e `llms.txt` si aggiornano da soli.

### IndexNow (Bing, quindi anche Copilot e ChatGPT search)

Il file `public/<chiave>.txt` (chiave in `indexNowKey`, `src/data/site.ts`) dimostra che il dominio è vostro.
Dopo ogni pubblicazione importante apri nel browser (con il dominio vero):

```
https://api.indexnow.org/indexnow?url=https://www.crazyagency.it/it/&key=<chiave>
```

oppure collega il sito a Bing Webmaster Tools, che può usare IndexNow in automatico.

## Skill di design usate (Claude)

Per il redesign sono state usate: **Impeccable** (pbakaus/impeccable), **Emil Kowalski**
(emilkowalski/skills: design engineering e animazioni) e **taste-skill** (Leonxlnx/taste-skill:
redesign-existing-projects, high-end-visual-design, design-taste-frontend-v1). Claude Code le legge da lì quando lavora in questa cartella.
Per installarle in modo globale sul tuo computer:

```bash
npx skills@latest add emilkowalski/skills
npx impeccable install
npx skills@latest add Leonxlnx/taste-skill
```
