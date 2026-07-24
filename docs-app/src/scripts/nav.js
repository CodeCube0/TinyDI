// Mobile nav drawer (native <dialog>) + "on this page" scroll spy.
(function () {
  const drawer = document.querySelector('[data-drawer]');
  const openButtons = document.querySelectorAll('[data-drawer-open]');
  const closeButtons = document.querySelectorAll('[data-drawer-close]');

  if (drawer) {
    openButtons.forEach((button) => {
      button.addEventListener('click', () => {
        drawer.showModal();
      });
    });
    closeButtons.forEach((button) => {
      button.addEventListener('click', () => drawer.close());
    });
    drawer.addEventListener('click', (event) => {
      if (event.target === drawer) drawer.close();
    });
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => drawer.close());
    });
  }

  const tocLinks = Array.from(document.querySelectorAll('[data-toc-link]'));
  if (tocLinks.length > 0) {
    const headings = tocLinks.map((link) =>
      document.getElementById(decodeURIComponent(link.hash.slice(1))),
    );

    // A heading stays "active" for its whole section — from the moment it
    // crosses the trigger line near the top until the next heading does —
    // rather than only while the heading itself is on screen. Recomputed on
    // scroll (rAF-throttled) instead of via IntersectionObserver, since that
    // API reports transient crossings, not "which section am I in right now".
    const TRIGGER_LINE = 96;
    let ticking = false;

    function updateActive() {
      ticking = false;
      let activeIndex = -1;
      for (let i = 0; i < headings.length; i += 1) {
        const heading = headings[i];
        if (heading && heading.getBoundingClientRect().top <= TRIGGER_LINE) {
          activeIndex = i;
        }
      }
      tocLinks.forEach((link, i) => {
        link.classList.toggle('active', i === activeIndex);
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateActive);
        }
      },
      { passive: true },
    );

    updateActive();
  }
})();
