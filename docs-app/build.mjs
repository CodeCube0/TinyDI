// Static-site generator (dev-time Node script — the shipped output is plain
// HTML/CSS/JS, no runtime framework). Reads src/content + src/templates and
// emits the full site into dist/.
import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { renderLayout } from './src/templates/layout.mjs';
import { renderHome } from './src/templates/home.mjs';
import { renderBlocks } from './src/lib/blocks.mjs';
import { docsNav, docsHref, homeHref, SITE_URL } from './src/nav.mjs';

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(rootDir, 'dist');

function reset() {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });
}

function write(relPath, content) {
  const fullPath = join(distDir, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function copyDir(srcDir, destDir) {
  if (!existsSync(srcDir)) return;
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function extractToc(blocks) {
  return blocks
    .filter((b) => b.type === 'heading' && b.level === 2)
    .map((b) => ({ id: b.id, text: b.text }));
}

async function loadDocPage(lang, id) {
  const modUrl = pathToFileURL(join(rootDir, 'src/content', lang, 'docs', `${id}.mjs`)).href;
  return import(modUrl);
}

async function buildDocsPages(lang, searchEntries) {
  for (const navItem of docsNav) {
    const mod = await loadDocPage(lang, navItem.id);
    const { html, chunks } = renderBlocks(mod.blocks, lang);
    const tocItems = extractToc(mod.blocks);

    const pageHtml = renderLayout({
      lang,
      pageId: navItem.id,
      title: mod.meta.title,
      description: mod.meta.description,
      section: 'docs',
      bodyHtml: `<h1>${mod.meta.title}</h1>${html}`,
      tocItems,
    });

    write(docsHref(lang, navItem.id).slice(1), pageHtml);

    const pageUrl = docsHref(lang, navItem.id);
    for (const chunk of chunks) {
      searchEntries.push({
        url: chunk.id ? `${pageUrl}#${chunk.id}` : pageUrl,
        page: navItem[lang],
        title: chunk.heading ?? mod.meta.title,
        snippet: chunk.text.slice(0, 180),
      });
    }
  }
}

function buildHomePage(lang) {
  const isEn = lang === 'en';
  const title = isEn
    ? 'TinyDI — Modern Type-Safe Dependency Injection Without Reflection'
    : 'TinyDI — Dependency Injection Moderna e Type-Safe, Senza Reflection';
  const description = isEn
    ? 'A minimal, type-safe, decorator-free Dependency Injection container for TypeScript. Zero dependencies, no reflection, no decorators.'
    : 'Un container di Dependency Injection per TypeScript minimale, type-safe e senza decorator. Zero dipendenze, niente reflection, niente decorator.';

  const pageHtml = renderLayout({
    lang,
    pageId: 'home',
    title,
    description,
    section: 'home',
    bodyHtml: renderHome(lang),
  });

  write(homeHref(lang).slice(1) + 'index.html', pageHtml);
}

function buildSearchIndex(lang, entries) {
  write(`search-index.${lang}.json`, JSON.stringify(entries));
}

function buildSitemap() {
  const urls = [
    '/',
    '/it/',
    ...docsNav.flatMap((n) => [docsHref('en', n.id), docsHref('it', n.id)]),
  ];
  const entries = urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n');
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

async function main() {
  reset();

  copyDir(join(rootDir, 'src/styles'), join(distDir, 'styles'));
  copyDir(join(rootDir, 'src/scripts'), join(distDir, 'scripts'));
  copyDir(join(rootDir, 'src/assets'), join(distDir, 'assets'));

  buildHomePage('en');
  buildHomePage('it');

  const searchEntriesEn = [];
  const searchEntriesIt = [];
  await buildDocsPages('en', searchEntriesEn);
  await buildDocsPages('it', searchEntriesIt);
  buildSearchIndex('en', searchEntriesEn);
  buildSearchIndex('it', searchEntriesIt);

  buildSitemap();

  console.log(`Built ${docsNav.length * 2 + 2} pages into dist/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
