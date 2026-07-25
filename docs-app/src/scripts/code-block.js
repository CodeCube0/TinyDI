// Copy-to-clipboard for code blocks. Highlighting and line numbers are
// rendered at build time (see build.mjs / lib/highlight.mjs); this is the
// only client-side behavior a code block needs.
(function () {
  document.querySelectorAll('[data-copy-button]').forEach((button) => {
    const code = button.dataset.code;
    if (code === undefined) return;

    // Only the label <span> is swapped, never button.textContent directly —
    // setting textContent on the button would also delete its icon <svg>
    // (which contributes nothing to textContent), permanently losing the
    // icon after the very first click.
    const label = button.querySelector('span');
    const originalLabel = label ? label.textContent : button.textContent;
    let revertTimeout;

    button.addEventListener('click', async () => {
      window.clearTimeout(revertTimeout);
      button.classList.remove('code-block__copy--copied', 'code-block__copy--error');

      try {
        await navigator.clipboard.writeText(code);
        if (label) label.textContent = button.dataset.copiedLabel ?? 'Copied!';
        button.classList.add('code-block__copy--copied');
      } catch {
        if (label) label.textContent = button.dataset.errorLabel ?? 'Could not copy';
        button.classList.add('code-block__copy--error');
      }

      revertTimeout = window.setTimeout(() => {
        if (label) label.textContent = originalLabel;
        button.classList.remove('code-block__copy--copied', 'code-block__copy--error');
      }, 1800);
    });
  });
})();
