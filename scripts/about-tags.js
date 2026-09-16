/* Interest tags on About: each pill reveals a line about itself.
 *
 * Three input modes have to work, so none of them is special-cased away:
 *   pointer   hover shows, leaving clears, unless something is pinned
 *   keyboard  focus shows, blurring clears
 *   touch     tap pins, tapping the same tag again unpins
 *
 * The copy is not created here. It already sits in the DOM twice - visually
 * hidden inside the button for screen readers, and in a hidden span for this
 * script - so the page still says everything it has to say with JS switched
 * off. The visible line is decorative duplication, which is why it carries
 * aria-hidden and never announces.
 */
(function () {
  const list = document.querySelector('.about-tags');
  const out = document.querySelector('[data-tag-detail]');
  if (!list || !out) return;

  const triggers = [...list.querySelectorAll('[data-tag-trigger]')];
  if (!triggers.length) return;

  const copyFor = (btn) => {
    const span = btn.parentElement.querySelector('.about-tag-copy');
    return span ? span.textContent.trim() : '';
  };

  let pinned = null;

  const paint = (btn) => {
    const text = btn ? copyFor(btn) : '';
    if (out.textContent === text) return;
    out.textContent = text;
    out.classList.toggle('is-shown', Boolean(text));
    triggers.forEach((t) => t.classList.toggle('is-active', t === btn));
  };

  const show = (btn) => paint(btn);
  const clear = () => paint(pinned);

  triggers.forEach((btn) => {
    btn.addEventListener('mouseenter', () => show(btn));
    btn.addEventListener('focus', () => show(btn));
    btn.addEventListener('mouseleave', clear);
    btn.addEventListener('blur', clear);
    btn.addEventListener('click', () => {
      pinned = pinned === btn ? null : btn;
      paint(pinned);
    });
  });

  // A tap outside, or Escape, releases whatever is pinned.
  document.addEventListener('click', (e) => {
    if (pinned && !list.contains(e.target)) { pinned = null; paint(null); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pinned) { pinned = null; paint(null); }
  });
})();
