// Theme toggle. The *initial* theme (avoiding a flash) is applied by an
// inline snippet in <head>, before this file loads — see templates/layout.mjs.
(function () {
  const STORAGE_KEY = 'tinydi-theme';

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable (private mode / disabled) — theme still
        // toggles for this page load, it just won't persist.
      }
    });
    button.setAttribute('aria-pressed', String(currentTheme() === 'light'));
  });
})();
