// Copy-to-clipboard for code blocks. Highlighting and line numbers are
// rendered at build time (see build.mjs / lib/highlight.mjs); this is the
// only client-side behavior a code block needs.
(function () {
  document.querySelectorAll('[data-copy-button]').forEach((button) => {
    const code = button.dataset.code;
    if (code === undefined) return;

    const originalLabel = button.textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = button.dataset.copiedLabel ?? 'Copied!';
      } catch {
        button.textContent = button.dataset.errorLabel ?? 'Could not copy';
      }
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1800);
    });
  });
})();
