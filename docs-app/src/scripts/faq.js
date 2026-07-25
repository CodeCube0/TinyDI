// Smooth expand/collapse for FAQ <details>. The chevron rotation is plain
// CSS (see components.css); the panel's height cannot be — native <details>
// removes its content from layout the instant it closes, which CSS
// transitions have nothing to animate from. This intercepts the toggle and
// drives the height with the Web Animations API instead, the same
// well-established vanilla pattern used for animating <details> anywhere.
// If this script fails to load, <details> still works natively — just
// without the animation — so nothing is ever hidden by a failed script.
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = prefersReducedMotion ? 0 : 250;
  const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

  document.querySelectorAll('.faq-item').forEach((details) => {
    const summary = details.querySelector('.faq-item__question');
    const answer = details.querySelector('.faq-item__answer');
    if (!summary || !answer) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (isClosing || !details.open) {
        expand();
      } else if (isExpanding || details.open) {
        collapse();
      }
    });

    function runAnimation(startHeight, endHeight, onFinish) {
      if (animation) animation.cancel();
      if (DURATION === 0) {
        onFinish();
        return;
      }

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        animation = null;
        onFinish();
      };

      animation = details.animate(
        { height: [startHeight, endHeight] },
        {
          duration: DURATION,
          easing: EASING,
        },
      );
      animation.onfinish = settle;
      animation.oncancel = () => {
        animation = null;
      };
      // Safety net: rAF-driven playback can stall in a backgrounded/throttled
      // tab (e.g. the reader alt-tabs away mid-animation), which would
      // otherwise leave the panel pinned at an intermediate height forever
      // since `onfinish` never fires. A plain timer still fires either way,
      // so the panel always settles to its final state.
      window.setTimeout(settle, DURATION + 50);
    }

    function expand() {
      details.style.height = `${details.offsetHeight}px`;
      details.open = true;
      isExpanding = true;
      window.requestAnimationFrame(() => {
        const endHeight = summary.offsetHeight + answer.offsetHeight;
        runAnimation(`${details.offsetHeight}px`, `${endHeight}px`, () => {
          details.style.height = '';
          isExpanding = false;
        });
      });
    }

    function collapse() {
      isClosing = true;
      details.classList.add('faq-item--closing');
      const startHeight = details.offsetHeight;
      const endHeight = summary.offsetHeight;
      runAnimation(`${startHeight}px`, `${endHeight}px`, () => {
        details.open = false;
        details.style.height = '';
        details.classList.remove('faq-item--closing');
        isClosing = false;
      });
    }
  });
})();
