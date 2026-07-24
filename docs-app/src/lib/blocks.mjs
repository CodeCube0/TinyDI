import { highlightToLines } from './highlight.mjs';
import { icon } from './icons.mjs';

const COPY_LABELS = {
  en: { copy: 'Copy', copied: 'Copied!', error: 'Could not copy' },
  it: { copy: 'Copia', copied: 'Copiato!', error: 'Copia non riuscita' },
};

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderCode(block) {
  const lines = highlightToLines(block.code, block.lang);
  const encodedCode = block.code
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
  const labels = COPY_LABELS[block.lang === 'it-copy' ? 'it' : (block._lang ?? 'en')];
  return `
    <div class="code-block${block.noLines ? ' code-block--no-lines' : ''}">
      <div class="code-block__header">
        <span class="code-block__lang">${block.lang}</span>
        <button type="button" class="code-block__copy" data-copy-button data-code="${encodedCode}" data-copied-label="${labels.copied}" data-error-label="${labels.error}">
          ${icon('copy')}<span>${labels.copy}</span>
        </button>
      </div>
      <pre><code>${lines}</code></pre>
    </div>`;
}

function renderCallout(block) {
  const kindLabel =
    block.kind === 'warning'
      ? block._lang === 'it'
        ? 'Attenzione'
        : 'Warning'
      : block._lang === 'it'
        ? 'Suggerimento'
        : 'Tip';
  return `
    <div class="callout callout--${block.kind}">
      ${icon(block.kind === 'warning' ? 'warning' : 'tip', 'callout__icon')}
      <div class="callout__body">
        <p class="callout__title">${block.title ?? kindLabel}</p>
        <p>${block.html}</p>
      </div>
    </div>`;
}

function renderApiTable(block) {
  const rows = block.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
  const headers = block.headers.map((h) => `<th>${h}</th>`).join('');
  return `
    <div class="api-table-wrap">
      <table class="api-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderCompareTable(block) {
  const rows = block.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
  const headers = block.headers.map((h) => `<th>${h}</th>`).join('');
  return `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderExampleGrid(block) {
  const items = block.items
    .map(
      (item) => `
      <a class="example-card" href="${item.href}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="example-card__cta">${item.cta}${icon('arrowRight')}</span>
      </a>`,
    )
    .join('');
  return `<div class="example-grid">${items}</div>`;
}

function renderFaqList(block) {
  const items = block.items
    .map(
      (item, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-item__question">${item.q}${icon('chevronDown')}</summary>
        <div class="faq-item__answer">${item.a}</div>
      </details>`,
    )
    .join('');
  return items;
}

function renderList(block) {
  const tag = block.ordered ? 'ol' : 'ul';
  const items = block.items.map((item) => `<li>${item}</li>`).join('');
  return `<${tag}>${items}</${tag}>`;
}

/**
 * Renders a page's block list to HTML, and extracts search-index chunks
 * (grouped by the nearest preceding h2/h3) from the same source of truth.
 */
export function renderBlocks(blocks, lang) {
  let html = '';
  const chunks = [];
  let current = null;

  const pushText = (text) => {
    if (!current) {
      current = { id: null, heading: null, text: '' };
      chunks.push(current);
    }
    current.text += (current.text ? ' ' : '') + text;
  };

  for (const raw of blocks) {
    const block = { ...raw, _lang: lang };

    switch (block.type) {
      case 'heading': {
        html += `<h${block.level} id="${block.id}">${block.text}</h${block.level}>`;
        current = { id: block.id, heading: block.text, text: '' };
        chunks.push(current);
        break;
      }
      case 'p': {
        html += `<p>${block.html}</p>`;
        pushText(stripTags(block.html));
        break;
      }
      case 'list': {
        html += renderList(block);
        pushText(block.items.map(stripTags).join('. '));
        break;
      }
      case 'code': {
        html += renderCode(block);
        pushText(block.code.slice(0, 400));
        break;
      }
      case 'callout': {
        html += renderCallout(block);
        pushText(stripTags(block.html));
        break;
      }
      case 'api-table': {
        html += renderApiTable(block);
        pushText(block.rows.map((r) => r.map(stripTags).join(' — ')).join('. '));
        break;
      }
      case 'compare-table': {
        html += renderCompareTable(block);
        break;
      }
      case 'example-grid': {
        html += renderExampleGrid(block);
        pushText(block.items.map((i) => `${i.title}: ${i.description}`).join('. '));
        break;
      }
      case 'faq-list': {
        html += renderFaqList(block);
        for (const item of block.items) {
          chunks.push({ id: item.id, heading: item.q, text: stripTags(item.a) });
        }
        current = null;
        break;
      }
      case 'raw': {
        html += block.html;
        break;
      }
      default:
        throw new Error(`Unknown block type "${block.type}"`);
    }
  }

  return { html, chunks: chunks.filter((c) => c.text.trim().length > 0 || c.heading) };
}
