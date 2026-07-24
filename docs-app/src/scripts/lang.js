// Language preference persistence. Deliberately does NOT auto-redirect
// (that breaks deep links, back-navigation, and confuses search-engine
// crawlers evaluating hreflang alternates). Instead: remember the reader's
// choice, and on a page that doesn't match it, offer a small dismissible
// banner to switch — never a forced redirect.
//
// Whether the banner *starts* visible is decided synchronously in <head>
// (see langBannerInitScript in templates/layout.mjs), before first paint —
// not here, since this script runs deferred (after the page has already
// rendered) and toggling visibility this late caused a layout-shift flash
// on every load for readers with a stored language preference.
(function () {
  const STORAGE_KEY = 'tinydi-lang';

  document.querySelectorAll('[data-lang-link]').forEach((link) => {
    link.addEventListener('click', () => {
      try {
        localStorage.setItem(STORAGE_KEY, link.dataset.langLink);
      } catch {
        // localStorage unavailable — the switch still works, it just won't
        // be remembered for the next visit.
      }
    });
  });

  const banner = document.querySelector('[data-lang-banner]');
  if (!banner) return;

  banner.querySelector('[data-lang-banner-dismiss]')?.addEventListener('click', () => {
    delete document.documentElement.dataset.langBannerShow;
    try {
      sessionStorage.setItem('tinydi-lang-banner-dismissed', banner.dataset.langBanner);
    } catch {
      // ignore
    }
  });
})();
