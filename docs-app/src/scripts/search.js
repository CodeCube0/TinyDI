// Client-side, local search. No external service: the index is a static JSON
// file generated at build time (see tools/build-search-index.mjs), fetched
// once and searched entirely in the browser.
(function () {
  const dialog = document.querySelector('[data-search-dialog]');
  if (!dialog) return;

  const input = dialog.querySelector('[data-search-input]');
  const resultsEl = dialog.querySelector('[data-search-results]');
  const emptyEl = dialog.querySelector('[data-search-empty]');
  const openButtons = document.querySelectorAll('[data-search-trigger]');
  const indexUrl = dialog.dataset.indexUrl;

  let entries = null;
  let activeIndex = -1;
  let currentResults = [];

  async function loadIndex() {
    if (entries) return entries;
    const response = await fetch(indexUrl);
    entries = await response.json();
    return entries;
  }

  function score(entry, terms) {
    const title = entry.title.toLowerCase();
    const page = entry.page.toLowerCase();
    const snippet = entry.snippet.toLowerCase();
    let total = 0;
    for (const term of terms) {
      if (title.includes(term)) total += 4;
      if (page.includes(term)) total += 2;
      if (snippet.includes(term)) total += 1;
      if (total === 0) return 0;
    }
    return total;
  }

  function search(query, allEntries) {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (terms.length === 0) return [];

    return allEntries
      .map((entry) => ({ entry, s: score(entry, terms) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(({ entry }) => entry);
  }

  function render(results) {
    currentResults = results;
    activeIndex = results.length > 0 ? 0 : -1;
    resultsEl.innerHTML = '';
    emptyEl.hidden = results.length > 0 || input.value.trim() === '';

    results.forEach((entry, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'search-result';
      a.href = entry.url;
      a.dataset.active = String(i === activeIndex);
      a.innerHTML =
        `<p class="search-result__page">${entry.page}</p>` +
        `<p class="search-result__title">${entry.title}</p>` +
        `<p class="search-result__snippet">${entry.snippet}</p>`;
      li.appendChild(a);
      resultsEl.appendChild(li);
    });
  }

  function setActive(delta) {
    if (currentResults.length === 0) return;
    activeIndex = (activeIndex + delta + currentResults.length) % currentResults.length;
    resultsEl.querySelectorAll('.search-result').forEach((el, i) => {
      el.dataset.active = String(i === activeIndex);
      if (i === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  async function openDialog() {
    await loadIndex();
    dialog.showModal();
    input.value = '';
    input.focus();
    render([]);
  }

  openButtons.forEach((button) => button.addEventListener('click', openDialog));

  document.addEventListener('keydown', (event) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const shortcutModifier = isMac ? event.metaKey : event.ctrlKey;
    const targetTag = event.target?.tagName;
    const inEditable = targetTag === 'INPUT' || targetTag === 'TEXTAREA';

    if (
      (event.key === '/' && !inEditable) ||
      (shortcutModifier && event.key.toLowerCase() === 'k')
    ) {
      event.preventDefault();
      if (!dialog.open) openDialog();
    }
  });

  input?.addEventListener('input', async () => {
    const allEntries = await loadIndex();
    render(search(input.value, allEntries));
  });

  input?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = currentResults[activeIndex];
      if (target) window.location.href = target.url;
    }
  });

  dialog.querySelectorAll('[data-search-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
