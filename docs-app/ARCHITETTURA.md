# Architettura di `docs-app`

> Analisi tecnica completa di come funziona il sito di documentazione di TinyDI, scritta per orientarsi rapidamente prima di modificarlo. Per il razionale strategico/di design (perché certe scelte sono state fatte) vedi `../PRODUCT.md` e `../DESIGN.md`; per il contesto di fase vedi `../reports/03-docs-website.md` (gitignored, presente solo in locale).

## 1. Cos'è, in una frase

`docs-app` è il sito di documentazione e progetto di TinyDI: **HTML/CSS/JS statico**, generato da uno **static-site generator scritto a mano** (`build.mjs`, ~160 righe di Node puro), **senza alcun framework frontend** (niente React/Vue/Astro/11ty) e **zero dipendenze runtime** — solo due font self-hosted come `devDependencies` di build. Coerente con l'etica "zero dipendenze" della libreria che documenta.

Il sito è live su:

- EN: <https://codecube0.github.io/TinyDI/>
- IT: <https://codecube0.github.io/TinyDI/it/>

deployato automaticamente da `.github/workflows/docs.yml` a ogni push su `main` che tocca `docs-app/**`.

## 2. Comandi

```bash
cd docs-app
npm install    # esegue anche postinstall: copia i 2 file font self-hosted da node_modules
npm run build  # node build.mjs  ->  src/content + src/templates  ->  dist/
npm run serve  # node serve.mjs  ->  serve dist/ su http://localhost:4550
npm run dev    # build + serve in sequenza
```

Non c'è hot-reload: dopo ogni modifica a `src/` bisogna rilanciare `npm run build` (o `npm run dev`).

## 3. Mappa delle cartelle

```
docs-app/
├── build.mjs              # generatore statico (entry point della build)
├── serve.mjs               # server statico minimale per dist/ (no dipendenze)
├── package.json            # solo devDependencies (2 pacchetti di font)
├── src/
│   ├── nav.mjs              # UNICA fonte di verità: nav docs, stringhe i18n, helper URL
│   ├── content/
│   │   ├── en/docs/*.mjs    # 10 pagine doc in inglese (una per file), raggruppate in Guide/Reference/Adopt
│   │   └── it/docs/*.mjs    # le stesse 10, in italiano
│   ├── templates/
│   │   ├── layout.mjs       # shell di pagina: <head>, header, sidebar, drawer, TOC, ricerca, footer
│   │   └── home.mjs         # sezioni della homepage (hero, feature, architettura, quick start)
│   ├── lib/
│   │   ├── blocks.mjs       # renderer del DSL a blocchi + estrazione indice di ricerca
│   │   ├── highlight.mjs    # syntax highlighter fatto a mano (ts/bash/json)
│   │   ├── icons.mjs        # set di icone SVG inline, disegnate a mano
│   │   └── graph-diagram.mjs# unica immagine "bespoke": SVG del flusso di resolve()
│   ├── scripts/             # JS lato client, spediti as-is (nessun bundler)
│   │   ├── theme.js         # toggle tema chiaro/scuro
│   │   ├── nav.js            # drawer mobile + scroll-spy "On this page"
│   │   ├── search.js         # ricerca client-side sull'indice JSON prebuilt
│   │   ├── lang.js           # persistenza lingua + banner di suggerimento (+ animazione di chiusura)
│   │   ├── code-block.js     # pulsante "copia" sui blocchi di codice (+ feedback di successo/errore)
│   │   └── faq.js            # accordion FAQ animato via Web Animations API
│   ├── styles/
│   │   ├── tokens.css        # design tokens (colori OKLCH, spaziature, tipografia)
│   │   ├── base.css          # reset + stili elementari
│   │   ├── components.css    # tutti gli stili dei componenti (~1165 righe)
│   │   └── fonts.css         # @font-face self-hosted
│   └── assets/
│       ├── favicon.svg
│       └── fonts/            # generata da tools/copy-fonts.mjs — gitignored
├── tools/
│   ├── copy-fonts.mjs       # postinstall: copia i 2 woff2 da node_modules
│   └── contrast-check.mjs   # verifica manuale contrasto WCAG dei token colore
└── dist/                    # OUTPUT generato — gitignored, non toccare a mano
```

> **Nota:** nella working directory sono presenti anche `docs-app/.nuxt/` e `docs-app/.output/`, entrambi gitignored e **non tracciati da git** (contengono artefatti di una build Nuxt/Nitro con i18n e nuxt-content). Non fanno parte dell'architettura attuale descritta qui — sono residui locali di build non ripuliti, scollegati dal generatore statico realmente usato (`build.mjs`). Puoi ignorarli o rimuoverli, non vengono letti da nessuno script del progetto.

## 4. La pipeline di build (`build.mjs`)

Flusso di `main()`:

1. **`reset()`** — cancella e ricrea `dist/`.
2. **Copia asset statici** — `src/styles`, `src/scripts`, `src/assets` vengono copiati 1:1 in `dist/`.
3. **`buildHomePage(lang)`** per `'en'` e `'it'` — chiama `renderHome(lang)` (da `templates/home.mjs`), avvolge il risultato con `renderLayout(...)` (da `templates/layout.mjs`) e scrive `dist/index.html` / `dist/it/index.html`.
4. **`buildDocsPages(lang, searchEntries)`** per ciascuna lingua — per ogni voce di `docsNav` (da `src/nav.mjs`):
   - importa dinamicamente `src/content/{lang}/docs/{id}.mjs` (`import()` su un `file://` URL costruito da `pathToFileURL`);
   - passa `mod.blocks` a `renderBlocks()` (da `lib/blocks.mjs`), ottenendo sia l'HTML del corpo pagina sia i **chunk per l'indice di ricerca**;
   - estrae il sommario ("On this page") prendendo tutti i blocchi `heading` di livello 2 (`extractToc`);
   - scrive `dist/docs/{id}.html` (EN) o `dist/it/docs/{id}.html` (IT).
5. **`buildSearchIndex(lang, entries)`** — scrive `dist/search-index.en.json` / `dist/search-index.it.json`, consumati a runtime da `scripts/search.js`.
6. **`buildSitemap()`** — genera `dist/sitemap.xml` (tutte le home + tutte le pagine doc, EN+IT) e `dist/robots.txt`.

Punto chiave da ricordare: **contenuto e indice di ricerca vengono generati dalla stessa unica fonte** (`renderBlocks`), quindi non possono mai andare fuori sincrono l'uno con l'altro.

### `BASE_PATH` — attenzione a non confondere due cose diverse

`src/nav.mjs` espone:

- `BASE_PATH` (da `DOCS_BASE_PATH`, default `''`) — prefisso usato in **ogni URL interno che finisce nell'HTML** (`href`, `canonical`, `hreflang`, voci della sitemap, URL dell'indice di ricerca): `docsHref()`/`homeHref()` in `nav.mjs`.
- I **percorsi fisici dentro `dist/`** (`docsFilePath()`/`homeFilePath()` in `build.mjs`) sono invece **sempre privi di `BASE_PATH`**.

In CI (`.github/workflows/docs.yml`), la build viene lanciata con `DOCS_BASE_PATH=/TinyDI` e `DOCS_SITE_URL=https://codecube0.github.io`, perché GitHub Pages (project site) serve il contenuto sotto `/TinyDI/` aggiungendo lui stesso quel prefisso all'artifact caricato. Se si "cuocesse" `/TinyDI` anche nei percorsi fisici, il prefisso verrebbe raddoppiato. In locale (`npm run dev`) le env var non sono impostate, quindi `BASE_PATH` è vuoto e tutto funziona sotto `/`.

## 5. Il DSL dei contenuti (`src/content/{lang}/docs/*.mjs` + `lib/blocks.mjs`)

Ogni pagina di documentazione è **dati, non markup**: un modulo `.mjs` che esporta:

```js
export const meta = { title: '...', description: '...' };
export const blocks = [/* array di blocchi tipizzati */];
```

Tipi di blocco supportati (gestiti in `renderBlocks()`, `src/lib/blocks.mjs:119`):

| `type`          | Scopo                                               | Campi principali                       |
| --------------- | --------------------------------------------------- | -------------------------------------- |
| `heading`       | Titolo (con `id` per ancore/TOC)                    | `level`, `id`, `text`                  |
| `p`             | Paragrafo (HTML inline consentito, es. `<code>`)    | `html`                                 |
| `list`          | Lista puntata/numerata                              | `ordered`, `items[]`                   |
| `code`          | Blocco di codice con syntax highlight + copy button | `lang`, `code`, `noLines?`             |
| `callout`       | Riquadro "tip"/"warning"                            | `kind`, `title?`, `html`               |
| `api-table`     | Tabella di riferimento API                          | `headers[]`, `rows[][]`                |
| `compare-table` | Tabella di confronto (pagina "Comparison")          | `headers[]`, `rows[][]`                |
| `example-grid`  | Griglia di card verso gli esempi                    | `items[]` (title/description/href/cta) |
| `faq-list`      | Elenco di `<details>` accordion                     | `items[]` (q/a/id)                     |
| `raw`           | HTML già pronto, inserito senza modifiche           | `html`                                 |

`renderBlocks()` fa **due cose insieme, dalla stessa iterazione**:

1. produce l'HTML della pagina (`html`);
2. accumula `chunks` — un frammento per ogni h2/h3/voce FAQ, con `id`/`heading`/`text` — che diventano le voci dell'indice di ricerca in `build.mjs`.

Per aggiungere una nuova pagina doc: creare `src/content/en/docs/<id>.mjs` e `src/content/it/docs/<id>.mjs`, poi aggiungere `{ id, en, it }` a `docsNav` in `src/nav.mjs` (vedi §7) — è l'unico posto da toccare oltre ai due file di contenuto.

## 6. I template (`src/templates/`)

### `layout.mjs` — lo scheletro di ogni pagina

`renderLayout({ lang, pageId, title, description, section, bodyHtml, tocItems })` produce l'intero documento HTML:

- **`head()`** — meta tag, `<title>`, `canonical`/`hreflang` (EN/IT/`x-default`), Open Graph, link ai 4 CSS, e **tre script inline sincroni** (vedi §8.1 per il perché sono inline e non deferred):
  - `themeInitScript()` — imposta `data-theme` su `<html>` da `localStorage`, prima del primo paint (default `dark`).
  - `platformInitScript()` — imposta `data-platform` (`mac`/`other`) per mostrare la scorciatoia di ricerca corretta (⌘K vs Ctrl K).
  - `langBannerInitScript()` — decide se il banner "disponibile anche in..." deve partire visibile.
- **`headerMarkup()`** — logo, nav primaria (Docs/Examples/GitHub), pulsante ricerca, toggle tema, switch lingua, hamburger mobile.
- **`langBannerMarkup()`** — il banner dismissibile (mai un redirect forzato, vedi §9).
- **`sidebarMarkup()` / `tocMarkup()`** — usati solo quando `section === 'docs'`: sidebar di navigazione a sinistra, sommario "On this page" a destra (generato da `extractToc` in `build.mjs`). `sidebarMarkup()` delega a `docsGroupsMarkup(lang, pageId)`, che raggruppa `docsNav` per `docsNavGroups` (Guide/Reference/Adopt) invece di renderizzare un'unica lista piatta.
- **`drawerMarkup()`** — lo stesso menu, in versione `<dialog>` per mobile; usa la stessa `docsGroupsMarkup()` della sidebar desktop, quindi i due non possono andare fuori sincrono tra loro.
- **`searchDialogMarkup()`** — il `<dialog>` di ricerca, con `data-index-url` che punta al JSON generato per quella lingua.
- **`footerMarkup()`**.
- In coda al `<body>`, i 6 script in `src/scripts/` sono caricati con `defer`.

### `home.mjs` — la homepage

`renderHome(lang)` concatena 4 sezioni, ciascuna con copy separata EN/IT nell'oggetto `COPY`:

1. `heroSection` — titolo, CTA, e il diagramma SVG (non etichettato, decorativo) da `graph-diagram.mjs`.
2. `featuresSection` — griglia "bento" asimmetrica di feature card (icone da `icons.mjs`).
3. `architectureSection` — lo stesso diagramma SVG, ma **etichettato** (`labeled: true`), con didascalie.
4. `quickStartSection` — il blocco di codice "quick start", evidenziato con `highlightToLines`.

`LIBRARY_VERSION` (da `nav.mjs`) è iniettata nell'eyebrow dell'hero: **letta a build-time dal `package.json` della root del repo**, mai scritta a mano — non reintrodurre una stringa di versione hardcoded qui.

## 7. `src/nav.mjs` — la fonte di verità unica

Un solo file espone tutto ciò che è condiviso tra build e pagine:

- `LIBRARY_VERSION` — letta da `../../package.json` (root del repo).
- `SITE_URL` / `BASE_PATH` — override via `DOCS_SITE_URL` / `DOCS_BASE_PATH` (vedi §4).
- `docsNav` — array `{ id, en, it, group }`: **l'unico posto** che elenca le 10 pagine doc (usato per sidebar, drawer, sitemap e raggruppamento dell'indice di ricerca). Il campo `group` (`'guide' | 'reference' | 'adopt'`) determina il cluster in cui la pagina appare in sidebar/drawer.
- `docsNavGroups` — array `{ key, en, it }`: le 3 etichette di cluster (Guide/Reference/Adopt in EN, Guida/Riferimento/Adozione in IT), usate da `docsGroupsMarkup()` in `layout.mjs`.
- `strings.en` / `strings.it` — ogni stringa di UI (nav, placeholder di ricerca, label dei toggle, footer, ecc.) per entrambe le lingue.
- `docsHref(lang, id)` / `homeHref(lang)` / `otherLang(lang)` — helper per costruire URL coerenti con `BASE_PATH`.

Per cambiare l'ordine delle voci in sidebar, aggiungere/rimuovere una pagina, o modificare una stringa di UI: si tocca solo questo file (più eventualmente i file di contenuto).

## 8. Script lato client (`src/scripts/*.js`)

Nessun bundler: questi file vengono copiati **as-is** in `dist/scripts/` e caricati con `<script defer>`. Ognuno è una IIFE autonoma.

- **`theme.js`** — legge/scrive `localStorage['tinydi-theme']`, alterna `data-theme` su `<html>`.
- **`nav.js`** — apre/chiude il drawer mobile (`<dialog>` nativo) e implementa lo scroll-spy del sommario: **non usa `IntersectionObserver`**, ma un listener di scroll throttled via `requestAnimationFrame`, perché serve sapere "in quale sezione mi trovo ora" (l'ultimo heading superato), non "quale heading è visibile in questo istante".
- **`search.js`** — fetch (una volta, lazy) dell'indice `search-index.{lang}.json`, scoring locale con un semplice matcher per sottostringa pesato (titolo ×4, pagina ×2, snippet ×1), navigazione da tastiera (↑/↓/Invio), scorciatoie `/` e ⌘K/Ctrl+K.
- **`lang.js`** — persiste la scelta di lingua in `localStorage['tinydi-lang']` e gestisce il dismiss del banner (in `sessionStorage`, con animazione di chiusura — vedi §9). **Non fa mai redirect automatico.**
- **`code-block.js`** — pulsante "copia" via `navigator.clipboard`, con fallback di messaggio d'errore e classi di feedback (§9). Cambia solo il `textContent` dello `<span>` di etichetta, mai `button.textContent` direttamente — settarlo sul bottone distruggerebbe l'icona SVG al suo interno (un bug reale, corretto).
- **`faq.js`** — anima l'apertura/chiusura dei pannelli FAQ (§9).

### 8.1 Perché tre script sono inline in `<head>` e non in questi file

`themeInitScript`, `platformInitScript` e `langBannerInitScript` (in `layout.mjs`) leggono `localStorage`/`sessionStorage`/`navigator.*` e impostano attributi `data-*` su `<html>` **sincronicamente, prima del primo paint**. Se questa logica finisse in uno script `defer` (come gli altri), il valore verrebbe applicato solo dopo che la pagina è già stata dipinta — causando un flash del tema sbagliato o (già successo in passato con il banner lingua) uno scatto di layout visibile a ogni caricamento. Regola pratica: **qualunque stato visivo che dipende da storage/navigator va deciso inline in `<head>`**, non in uno script deferred.

## 9. Animazioni e motion

Il razionale (cosa animare e perché, i token di durata/easing) è in `../DESIGN.md`, sezione "Motion". Qui la parte implementativa:

- **Il diagramma hero** (`lib/graph-diagram.mjs` + `[data-reveal]`/`graph-reveal`/`graph-draw` in `components.css`) resta l'unico "momento autoriale" del sito — nodi ed edge si disegnano in sequenza staggered al caricamento della home.
- **Tutto il resto è motion "quieto"**: transizioni CSS su singola proprietà (colore/sfondo/bordo, `--duration-fast`) su header, sidebar, TOC, lang-switch e icon-btn.
- **Toggle tema** (`.theme-toggle` in `components.css`) — sole e luna sono sovrapposti (posizionamento assoluto centrato) e fanno crossfade+rotazione tra loro, non più uno swap `display:none` istantaneo: l'icona che cambia è l'unica conferma visibile del click.
- **Pulsante "copia"** (`scripts/code-block.js`) — al successo/errore riceve una classe (`code-block__copy--copied` / `--error`) che il CSS anima (tinta accento/danger + scale-pop dell'icona).
- **Accordion FAQ** (`scripts/faq.js`) — l'altezza di `.faq-item` è animata via Web Animations API (`details.animate({ height: [...] })`), perché `<details>` nativo rimuove il contenuto dal layout istantaneamente alla chiusura: niente per cui il CSS possa fare una transizione. **Nota di affidabilità verificata empiricamente**: `Animation.onfinish` non è garantito scattare se la tab passa in background/viene throttled a metà animazione (anche un `Element.animate()` banale su un `<div>` può non risolvere mai, in quel caso) — per questo `runAnimation()` accoppia `onfinish` a un `setTimeout` di sicurezza (`DURATION + 50`ms), altrimenti il pannello resterebbe bloccato a un'altezza intermedia per sempre. Se il JS fallisce a caricare, `<details>` continua a funzionare nativamente, solo senza animazione.
- **Dialog di ricerca** — entrata con fade + leggero scale/drop tramite `@starting-style` (puro CSS; i browser senza supporto vedono il dialog apparire istantaneo, senza bisogno di un ramo di fallback). Il drawer mobile mantiene il proprio slide laterale preesistente — due componenti diversi meritano due tipi di movimento diversi.
- **Banner lingua** — solo la _chiusura_ (azione dell'utente, in `scripts/lang.js`) è animata (fade + risalita, classe `.is-dismissing`, rimossa a `transitionend`). La _comparsa iniziale_ resta deliberatamente istantanea — è decisa in modo sincrono pre-paint (§8.1) proprio per non causare lo scatto di layout già risolto in passato; animarla di nuovo reintrodurrebbe lo stesso bug.
- **Tentato e scartato**: le View Transitions cross-document (`@view-transition { navigation: auto; }`) per la continuità tra le pagine — anche nella forma minima, senza personalizzazioni, lanciavano un'eccezione reale (`AbortError`/`InvalidStateError`) in console a ogni navigazione durante i test. Rimossa prima di essere spedita; non reintrodurla senza aver prima verificato con un test reale che sia pulita.
- Tutte le animazioni rispettano `prefers-reduced-motion: reduce` — inclusi i casi che il selettore universale `*` non copre (`::backdrop`) e le animazioni guidate da WAAPI, che vanno controllate esplicitamente in JS (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`) perché l'override CSS `transition-duration` non le raggiunge.

## 10. Internazionalizzazione (EN/IT)

- Contenuto duplicato per lingua sotto `src/content/{en,it}/docs/`, stesso `id` di file.
- Stringhe di UI in `nav.mjs` → `strings.en` / `strings.it`.
- **Nessun redirect automatico basato sulla lingua del browser.** La preferenza salvata in `localStorage` mostra solo un banner dismissibile ("Continue in English" / "Continua in italiano") quando la lingua salvata non corrisponde alla pagina corrente — mai un redirect forzato (romperebbe deep link, navigazione all'indietro, e la valutazione di `hreflang` da parte dei crawler).
- Ogni pagina espone i tre `<link rel="alternate" hreflang="...">` (`en`, `it`, `x-default`) in `head()`.

## 11. Ricerca client-side

Nessun servizio esterno, nessuna libreria (niente Fuse.js): un JSON prebuilt per lingua (`search-index.{lang}.json`, generato in `build.mjs` da `renderBlocks()`), scaricato una volta e interamente interrogato nel browser da `scripts/search.js`. Ogni voce dell'indice: `{ url, page, title, snippet }`.

## 12. Stili e design tokens (`src/styles/`)

- **`tokens.css`** — variabili CSS: tipografia (font, scale `--text-*` con `clamp()` fluido), spaziatura (`--space-*`), raggio, easing/durata delle transizioni, `--measure` (misura di prosa), scala z-index. Colori in **OKLCH**, con blocco `:root[data-theme='dark']` (default) e `:root[data-theme='light']` separati — `tools/contrast-check.mjs` verifica manualmente che i rapporti di contrasto rispettino WCAG per entrambi i temi.
- **`base.css`** — reset moderno + stili elementari (heading, link, focus-visible, `.container`, `prefers-reduced-motion`). Nota: la regola difensiva `svg { width: 1em; height: 1em; }` esiste perché un'icona SVG senza una regola di dimensione dedicata altrimenti verrebbe renderizzata alla sua dimensione intrinseca (~300×150) invece di fallire in modo silenzioso.
- **`components.css`** (~1165 righe) — organizzato in sezioni commentate (`/* ===== Nome ===== */`): Buttons, Site header, Language switch, Docs layout (sidebar/content/TOC), Mobile drawer, Hero, Resolution-graph diagram, Sections & prose, Feature list (bento), Language banner, Callouts, Code blocks (+ colori token di sintassi), API reference tables, Example cards, Comparison table, FAQ, Search overlay, Footer.
- **`fonts.css`** — due `@font-face` variabili self-hosted (Archivo Variable per display/corpo, Spline Sans Mono per il codice), solo subset Latin (copre EN+IT), nessuna richiesta a CDN esterni.

## 13. SEO e deploy

- **`buildSitemap()`** in `build.mjs` genera `sitemap.xml` (tutte le home + pagine doc, EN+IT) e `robots.txt`. Limite noto e non risolto: un sito GitHub Pages di tipo _project_ serve `robots.txt` solo dalla vera radice del dominio, quindi `/TinyDI/robots.txt` non viene mai effettivamente letto da un crawler — limite strutturale di GitHub Pages, non un bug di questo repo.
- **`.github/workflows/docs.yml`** — build+deploy su GitHub Pages (Source = "GitHub Actions", impostazione manuale una tantum sul repo). Gira su push a `main` che tocca `docs-app/**`, o manualmente (`workflow_dispatch`). Imposta `DOCS_BASE_PATH=/TinyDI` e `DOCS_SITE_URL=https://codecube0.github.io` prima della build, poi carica `docs-app/dist` con `actions/upload-pages-artifact` + `actions/deploy-pages` (nessun branch `gh-pages`).

## 14. Ricette per modifiche comuni

- **Aggiungere una pagina doc**: creare `src/content/en/docs/<id>.mjs` + `src/content/it/docs/<id>.mjs` (stesso `id`), poi aggiungere `{ id, en, it }` a `docsNav` in `src/nav.mjs`. Ricompilare.
- **Modificare l'ordine/le voci della sidebar**: riordinare/editare l'array `docsNav` in `src/nav.mjs`.
- **Cambiare una stringa di UI** (label, placeholder, testo del footer, ecc.): `strings.en` / `strings.it` in `src/nav.mjs`.
- **Cambiare colori/tema**: `src/styles/tokens.css` (blocchi `:root[data-theme='dark']` / `light`). Dopo aver cambiato un colore, rilanciare `node tools/contrast-check.mjs` per verificare che il contrasto resti conforme a WCAG.
- **Aggiungere un'icona**: aggiungere una entry SVG a `icons` in `src/lib/icons.mjs`, poi richiamarla con `icon('nome')`. Ogni nuova icona usata a una dimensione non standard va accompagnata da una regola CSS dedicata in `components.css` (vedi la nota sul fallback difensivo in `base.css`, §12).
- **Cambiare il contenuto di una pagina esistente**: editare direttamente l'array `blocks` nel relativo `.mjs` sotto `src/content/{lang}/docs/`, usando i tipi di blocco elencati in §5.
- **Aggiungere un linguaggio di syntax highlighting**: estendere `HIGHLIGHTERS` in `src/lib/highlight.mjs` con una nuova funzione `highlightXxx(code)` e la relativa entry nella mappa.
- **Cambiare il numero di versione mostrato in home**: non va toccato qui — è letto automaticamente dal campo `version` di `package.json` alla root del repo (vedi `LIBRARY_VERSION` in `nav.mjs`).
- **Non modificare mai `dist/` a mano**: è output generato, rigenerato da zero a ogni `npm run build` (`reset()` lo cancella e ricrea).
- **Aggiungere un'animazione**: preferire transizioni CSS su singola proprietà quando basta uno stato hover/focus/attivo (vedi §9); ricorrere a WAAPI (`Element.animate()`) solo quando serve animare qualcosa che il CSS non può esprimere da solo (es. l'altezza di un `<details>`) — e in quel caso accoppiare sempre `onfinish` a un `setTimeout` di sicurezza (§9, `scripts/faq.js`), altrimenti una tab in background può lasciare l'animazione bloccata a metà per sempre.

## 15. Cose da sapere prima di toccare certe parti (gotcha storici)

Alcuni di questi bug si sono già manifestati in passato e sono documentati nei commenti del codice — utile conoscerli prima di "semplificare" qualcosa che sembra ridondante:

- **Ordine banner lingua / tema**: la _visibilità iniziale_ di tema, scorciatoia di piattaforma e banner lingua deve essere decisa da script inline sincroni in `<head>` (§8.1), mai da uno script `defer` — altrimenti si rivede lo scatto di layout già osservato in passato.
- **`IntersectionObserver.rootMargin`** accetta solo `px`/`%`, mai `rem` — lancia un `SyntaxError` silenzioso in console (non visibile in UI). È anche per questo che `nav.js` usa un listener di scroll manuale invece di `IntersectionObserver`.
- **`robots.txt` su GitHub Pages project site** non viene letto dai crawler alla vera radice — limite noto, non un difetto da "correggere".
- **Indice di ricerca e contenuto non possono divergere**: entrambi provengono dalla stessa chiamata a `renderBlocks()` — se serve cambiare cosa finisce nell'indice, si tocca `pushText`/i `chunks` dentro `lib/blocks.mjs`, non un secondo generatore.
- **`docs-app` è escluso dal linting/type-checking della root** (`eslint.config.js`, `tsconfig.json`) perché non ha il proprio `tsconfig.json`/config di lint — non aspettarti che `npm run lint` dalla root catturi errori qui dentro.
- **Link interni hardcoded rompono il sito pubblicato, non quello locale**: un `href="/docs/xxx.html"` scritto a mano dentro un blocco `p`/`example-grid` (invece di passare per `docsHref()`) funziona in locale (`BASE_PATH` vuoto) ma diventa un 404 su GitHub Pages (`BASE_PATH=/TinyDI`) — già successo in 6 file, 12 link, prima di essere corretto usando percorsi relativi tra pagine sorelle (`lifetimes.html`, non `/docs/lifetimes.html`). `npm run dev` da solo non lo avrebbe mai fatto notare.
- **`.docs-sidebar` senza `display: none` di base duplica la navigazione su mobile**: la regola `@media (min-width: 1024px)` che la rende `sticky` non basta da sola a nasconderla sotto quella soglia — va impostato esplicitamente `display: none` di default e `display: block` solo dentro la media query, altrimenti la sidebar intera appare in-flow sopra il contenuto oltre al drawer con la stessa lista.
