import { icon } from '../lib/icons.mjs';
import { resolutionGraphSvg } from '../lib/graph-diagram.mjs';
import { highlightToLines } from '../lib/highlight.mjs';
import { docsHref, LIBRARY_VERSION } from '../nav.mjs';

const COPY = {
  en: {
    eyebrow: 'Zero dependencies',
    heroTitleMain: 'Modern Type-Safe Dependency Injection ',
    heroTitleAccent: 'Without Reflection',
    heroLede:
      'A minimal, type-safe, decorator-free Dependency Injection container for TypeScript. No reflection. No decorators. No metadata. Just explicit code you can read top to bottom.',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'View on GitHub',
    heroMeta: ['Zero runtime dependencies', 'TypeScript strict', 'ESM & CJS, tree-shakable'],
    featuresTitle: 'Explicit over magic',
    featuresLede:
      'Every trade-off TinyDI makes is deliberate. Here is exactly what you get, stated plainly.',
    features: [
      {
        key: 'zero-deps',
        icon: 'check',
        title: 'Zero Dependencies',
        body: 'No reflect-metadata, no decorators, no runtime library at all. `npm ls` on TinyDI shows nothing.',
        headline: true,
      },
      {
        key: 'type-safe',
        icon: 'shieldCheck',
        title: 'Type-Safe Tokens',
        body: '`resolve(token)` infers the exact service type. No explicit generics, no `as` casts.',
      },
      {
        key: 'singleton',
        icon: 'singleton',
        title: 'Singleton Support',
        body: 'The default lifetime. One instance, built once, reused for every resolution.',
      },
      {
        key: 'transient',
        icon: 'transient',
        title: 'Transient Support',
        body: 'A fresh instance on every `resolve()` call, when that is genuinely what you need.',
      },
      {
        key: 'agnostic',
        icon: 'puzzle',
        title: 'Framework Agnostic',
        body: 'Plain TypeScript. Works the same in Node.js, Bun, Deno, and the browser — Vue, React, Nuxt, or none at all.',
      },
      {
        key: 'tiny',
        icon: 'feather',
        title: 'Tiny Runtime',
        body: 'The whole container is a `Map` lookup and a function call. No startup cost to "discover" your graph.',
      },
    ],
    archTitle: 'How resolution actually works',
    archLede:
      'No hidden step. A token identifies a service; the container looks up its registration and calls the factory, which resolves its own dependencies the same way.',
    quickStartTitle: 'Quick Start',
    quickStartLede: 'This is the entire mental model. There is no step you are not seeing.',
    quickStartCta: 'Read the full guide',
    quickStartCode: `import { Container, createToken } from 'tinydi-container';

interface IGreeter {
  greet(name: string): string;
}

class EnglishGreeter implements IGreeter {
  greet(name: string): string {
    return \`Hello, \${name}!\`;
  }
}

const GreeterToken = createToken<IGreeter>('Greeter');

const container = new Container();
container.registerInstance(GreeterToken, new EnglishGreeter());

const greeter = container.resolve(GreeterToken); // typed as IGreeter
console.log(greeter.greet('TinyDI'));`,
  },
  it: {
    eyebrow: 'Zero dipendenze',
    heroTitleMain: 'Dependency Injection Moderna e Type-Safe, ',
    heroTitleAccent: 'Senza Reflection',
    heroLede:
      'Un container di Dependency Injection per TypeScript minimale, type-safe e senza decorator. Niente reflection. Niente decorator. Niente metadata. Solo codice esplicito, leggibile dall’inizio alla fine.',
    ctaPrimary: 'Inizia ora',
    ctaSecondary: 'Vedi su GitHub',
    heroMeta: ['Zero dipendenze a runtime', 'TypeScript strict', 'ESM & CJS, tree-shakable'],
    featuresTitle: 'Explicit over magic',
    featuresLede:
      'Ogni compromesso di TinyDI è deliberato. Ecco esattamente cosa ottieni, detto senza fronzoli.',
    features: [
      {
        key: 'zero-deps',
        icon: 'check',
        title: 'Zero Dipendenze',
        body: 'Nessun reflect-metadata, nessun decorator, nessuna libreria a runtime. `npm ls` su TinyDI non mostra nulla.',
        headline: true,
      },
      {
        key: 'type-safe',
        icon: 'shieldCheck',
        title: 'Token Type-Safe',
        body: '`resolve(token)` inferisce il tipo esatto del servizio. Nessun generic esplicito, nessun cast `as`.',
      },
      {
        key: 'singleton',
        icon: 'singleton',
        title: 'Supporto Singleton',
        body: 'Il lifetime di default. Un’istanza, costruita una volta, riusata ad ogni risoluzione.',
      },
      {
        key: 'transient',
        icon: 'transient',
        title: 'Supporto Transient',
        body: 'Una nuova istanza ad ogni chiamata a `resolve()`, quando è davvero ciò che ti serve.',
      },
      {
        key: 'agnostic',
        icon: 'puzzle',
        title: 'Framework Agnostic',
        body: 'TypeScript puro. Funziona identico su Node.js, Bun, Deno e nel browser — Vue, React, Nuxt, o nessuno di questi.',
      },
      {
        key: 'tiny',
        icon: 'feather',
        title: 'Runtime Minuscolo',
        body: 'L’intero container è una lookup su `Map` e una chiamata a funzione. Nessun costo di avvio per "scoprire" il grafo.',
      },
    ],
    archTitle: 'Come funziona davvero la risoluzione',
    archLede:
      'Nessun passaggio nascosto. Un token identifica un servizio; il container cerca la sua registrazione e chiama la factory, che risolve le proprie dipendenze allo stesso modo.',
    quickStartTitle: 'Quick Start',
    quickStartLede:
      'Questo è l’intero modello mentale. Non c’è nessun passaggio che non stai vedendo.',
    quickStartCta: 'Leggi la guida completa',
    quickStartCode: `import { Container, createToken } from 'tinydi-container';

interface IGreeter {
  greet(name: string): string;
}

class EnglishGreeter implements IGreeter {
  greet(name: string): string {
    return \`Hello, \${name}!\`;
  }
}

const GreeterToken = createToken<IGreeter>('Greeter');

const container = new Container();
container.registerInstance(GreeterToken, new EnglishGreeter());

const greeter = container.resolve(GreeterToken); // tipizzato come IGreeter
console.log(greeter.greet('TinyDI'));`,
  },
};

function heroSection(lang, c) {
  return `
  <section class="hero">
    <div class="container hero__inner">
      <div>
        <span class="hero__eyebrow">v${LIBRARY_VERSION} · ${c.eyebrow}</span>
        <h1>${c.heroTitleMain}<span class="hero__accent">${c.heroTitleAccent}</span></h1>
        <p class="hero__lede">${c.heroLede}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="${docsHref(lang, 'installation')}">${c.ctaPrimary} ${icon('arrowRight')}</a>
          <a class="btn btn--ghost" href="https://github.com/CodeCube0/TinyDI" target="_blank" rel="noopener">${icon('github')} ${c.ctaSecondary}</a>
        </div>
        <ul class="hero__meta">
          ${c.heroMeta.map((m) => `<li>${icon('check')}${m}</li>`).join('')}
        </ul>
      </div>
      <div class="hero__diagram">${resolutionGraphSvg({ labeled: false, lang })}</div>
    </div>
  </section>`;
}

function featuresSection(c) {
  const cards = c.features
    .map(
      (f) => `
    <div class="feature${f.headline ? ' feature--headline' : ''}">
      <div class="feature__icon">${icon(f.icon)}</div>
      <h3>${f.title}</h3>
      <p>${f.body}</p>
    </div>`,
    )
    .join('');
  return `
  <section class="section">
    <div class="container">
      <div class="section__head">
        <h2>${c.featuresTitle}</h2>
        <p>${c.featuresLede}</p>
      </div>
      <div class="feature-grid">${cards}</div>
    </div>
  </section>`;
}

function architectureSection(lang, c) {
  return `
  <section class="section" style="background:var(--surface);">
    <div class="container">
      <div class="section__head">
        <h2>${c.archTitle}</h2>
        <p>${c.archLede}</p>
      </div>
      ${resolutionGraphSvg({ labeled: true, lang })}
    </div>
  </section>`;
}

function quickStartSection(lang, c) {
  const lines = highlightToLines(c.quickStartCode, 'ts');
  const encoded = c.quickStartCode
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
  return `
  <section class="section">
    <div class="container">
      <div class="section__head">
        <h2>${c.quickStartTitle}</h2>
        <p>${c.quickStartLede}</p>
      </div>
      <div class="code-block">
        <div class="code-block__header">
          <span class="code-block__lang">ts</span>
          <button type="button" class="code-block__copy" data-copy-button data-code="${encoded}" data-copied-label="${lang === 'it' ? 'Copiato!' : 'Copied!'}">
            ${icon('copy')}<span>${lang === 'it' ? 'Copia' : 'Copy'}</span>
          </button>
        </div>
        <pre><code>${lines}</code></pre>
      </div>
      <p style="margin-top: var(--space-6);">
        <a class="btn btn--ghost" href="${docsHref(lang, 'quick-start')}">${c.quickStartCta} ${icon('arrowRight')}</a>
      </p>
    </div>
  </section>`;
}

export function renderHome(lang) {
  const c = COPY[lang];
  return (
    heroSection(lang, c) +
    featuresSection(c) +
    architectureSection(lang, c) +
    quickStartSection(lang, c)
  );
}
