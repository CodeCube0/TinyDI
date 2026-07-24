// Small, hand-rolled, build-time syntax highlighter. No external dependency:
// same zero-dependency ethic as the library this site documents. Covers just
// the languages this site actually uses in code samples.

const TS_KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'class',
  'interface',
  'extends',
  'implements',
  'new',
  'typeof',
  'as',
  'type',
  'enum',
  'public',
  'private',
  'protected',
  'readonly',
  'static',
  'void',
  'this',
  'throw',
  'try',
  'catch',
  'finally',
  'async',
  'await',
  'default',
  'in',
  'of',
  'instanceof',
  'satisfies',
  'declare',
  'namespace',
  'break',
  'continue',
  'switch',
  'case',
  'do',
  'delete',
  'yield',
  'true',
  'false',
  'null',
  'undefined',
  'super',
  'abstract',
]);

const TS_BUILTIN_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'object',
  'any',
  'unknown',
  'never',
  'symbol',
  'bigint',
]);

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function highlightTypeScript(code) {
  const TOKEN_RE =
    /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\];:,.<>?=+\-*/%!&|^~@]+)|(\s+)/g;

  let out = '';
  let match;
  let lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) out += escapeHtml(code.slice(lastIndex, match.index));
    lastIndex = TOKEN_RE.lastIndex;
    const [full, lineComment, blockComment, template, dquote, squote, number, ident, punct] = match;

    if (lineComment || blockComment) {
      out += `<span class="tok-comment">${escapeHtml(full)}</span>`;
    } else if (template || dquote || squote) {
      out += `<span class="tok-string">${escapeHtml(full)}</span>`;
    } else if (number) {
      out += `<span class="tok-number">${escapeHtml(full)}</span>`;
    } else if (ident) {
      if (TS_KEYWORDS.has(ident)) {
        out += `<span class="tok-keyword">${escapeHtml(full)}</span>`;
      } else if (TS_BUILTIN_TYPES.has(ident)) {
        out += `<span class="tok-type">${escapeHtml(full)}</span>`;
      } else {
        const rest = code.slice(TOKEN_RE.lastIndex);
        const followedByParen = /^\s*\(/.test(rest);
        const isCapitalized = /^[A-Z]/.test(ident);
        if (followedByParen) {
          out += `<span class="tok-function">${escapeHtml(full)}</span>`;
        } else if (isCapitalized) {
          out += `<span class="tok-type">${escapeHtml(full)}</span>`;
        } else {
          out += escapeHtml(full);
        }
      }
    } else if (punct) {
      out += `<span class="tok-punct">${escapeHtml(full)}</span>`;
    } else {
      out += escapeHtml(full);
    }
  }
  if (lastIndex < code.length) out += escapeHtml(code.slice(lastIndex));
  return out;
}

function highlightBash(code) {
  const TOKEN_RE = /(#[^\n]*)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(--?[A-Za-z][\w-]*)|(\s+)/g;
  let out = '';
  let match;
  let lastIndex = 0;
  let atLineStart = true;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) {
      const between = code.slice(lastIndex, match.index);
      out += escapeHtml(between);
      if (between.length > 0) atLineStart = false;
    }
    lastIndex = TOKEN_RE.lastIndex;
    const [full, comment, dquote, squote, flag, ws] = match;
    if (comment) {
      out += `<span class="tok-comment">${escapeHtml(full)}</span>`;
    } else if (dquote || squote) {
      out += `<span class="tok-string">${escapeHtml(full)}</span>`;
      atLineStart = false;
    } else if (flag) {
      out += `<span class="tok-type">${escapeHtml(full)}</span>`;
      atLineStart = false;
    } else if (ws) {
      out += escapeHtml(full);
      if (full.includes('\n')) atLineStart = true;
    }
  }
  if (lastIndex < code.length) out += escapeHtml(code.slice(lastIndex));
  return out;
}

function highlightJson(code) {
  const TOKEN_RE =
    /("(?:\\.|[^"\\])*"(?=\s*:))|("(?:\\.|[^"\\])*")|(\b(?:true|false|null)\b)|(-?\b\d+(?:\.\d+)?\b)|([{}[\]:,])|(\s+)/g;
  let out = '';
  let match;
  let lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) out += escapeHtml(code.slice(lastIndex, match.index));
    lastIndex = TOKEN_RE.lastIndex;
    const [full, key, str, bool, num, punct] = match;
    if (key) {
      out += `<span class="tok-function">${escapeHtml(full)}</span>`;
    } else if (str) {
      out += `<span class="tok-string">${escapeHtml(full)}</span>`;
    } else if (bool) {
      out += `<span class="tok-keyword">${escapeHtml(full)}</span>`;
    } else if (num) {
      out += `<span class="tok-number">${escapeHtml(full)}</span>`;
    } else if (punct) {
      out += `<span class="tok-punct">${escapeHtml(full)}</span>`;
    } else {
      out += escapeHtml(full);
    }
  }
  if (lastIndex < code.length) out += escapeHtml(code.slice(lastIndex));
  return out;
}

const HIGHLIGHTERS = {
  ts: highlightTypeScript,
  typescript: highlightTypeScript,
  tsx: highlightTypeScript,
  js: highlightTypeScript,
  javascript: highlightTypeScript,
  bash: highlightBash,
  sh: highlightBash,
  shell: highlightBash,
  json: highlightJson,
};

/**
 * Renders `code` (raw source, in `lang`) to highlighted HTML, one
 * `<span class="code-line">` per line, each line already syntax-highlighted.
 * Falls back to plain (escaped) text for unrecognized languages.
 */
export function highlightToLines(code, lang) {
  const highlighter = HIGHLIGHTERS[lang?.toLowerCase()] ?? ((c) => escapeHtml(c));
  const lines = code.replace(/\n$/, '').split('\n');
  return lines
    .map((line) => `<span class="code-line">${highlighter(line) || ' '}</span>`)
    .join('\n');
}
