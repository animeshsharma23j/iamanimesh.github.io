/* Progressive enhancement: anchors and research disclosure work without JS. */
(() => {
  const feedbackCounter = window.CaseStudyFeedbackCounter || {
    async get() {
      const response = await fetch('https://my-own-counter-api-production.up.railway.app/get/iamanimesh/case-itba-up-4e8d1b', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Counter request failed with ${response.status}`);
      const count = Number((await response.json()).count);
      return Number.isFinite(count) ? count : null;
    },
    async recordThumbsUp() {
      const response = await fetch('https://my-own-counter-api-production.up.railway.app/hit/iamanimesh/case-itba-up-4e8d1b', { method: 'POST', cache: 'no-store' });
      if (!response.ok) throw new Error(`Counter request failed with ${response.status}`);
      const count = Number((await response.json()).count);
      return Number.isFinite(count) ? count : null;
    }
  };

  const nav = document.querySelector('.itba-sidebar');
  if (!nav) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  let scheduled = false;
  function update() {
    let active = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 160) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  const appreciationButtons = [...document.querySelectorAll('[data-appreciation]')];
  const appreciationStatus = document.querySelector('.itba-appreciation-status');
  const appreciationTitle = document.getElementById('appreciation-title');
  const appreciationTotalRow = document.createElement('p');
  appreciationTotalRow.className = 'itba-appreciation-total';
  appreciationTotalRow.innerHTML = '<strong data-appreciation-total></strong> <span data-appreciation-total-label>appreciations</span> online';
  appreciationTotalRow.hidden = true;
  appreciationTitle?.after(appreciationTotalRow);
  const appreciationTotal = appreciationTotalRow.querySelector('[data-appreciation-total]');
  const appreciationKey = 'itba-case-study-appreciation';
  const recordedKey = 'itba-case-study-appreciation-up-recorded';
  let appreciation = null;
  let thumbsUpRecorded = false;

  try { appreciation = localStorage.getItem(appreciationKey); } catch (error) { /* Storage can be unavailable in privacy modes. */ }
  try { thumbsUpRecorded = localStorage.getItem(recordedKey) === 'true'; } catch (error) { /* Storage can be unavailable in privacy modes. */ }

  function renderTotal(count) {
    if (appreciationTotal && count !== null) {
      appreciationTotal.textContent = new Intl.NumberFormat().format(count);
      const label = appreciationTotalRow.querySelector('[data-appreciation-total-label]');
      if (label) label.textContent = count === 1 ? 'appreciation' : 'appreciations';
      appreciationTotalRow.hidden = false;
    }
  }

  feedbackCounter.get('itba')
    .then(renderTotal)
    .catch(() => {
      if (appreciationTotal) appreciationTotal.closest('.itba-appreciation-total')?.setAttribute('hidden', '');
    });

  function renderAppreciation(announce = false) {
    appreciationButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.appreciation === appreciation));
    });
    if (appreciationStatus) {
      appreciationStatus.textContent = announce && appreciation
        ? 'Thanks for the feedback.'
        : appreciation
          ? 'Your feedback is saved on this device.'
          : '';
    }
  }

  appreciationButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const nextValue = button.dataset.appreciation;
      appreciation = appreciation === nextValue ? null : nextValue;
      try {
        if (appreciation) localStorage.setItem(appreciationKey, appreciation);
        else localStorage.removeItem(appreciationKey);
      } catch (error) { /* The control still works for the current page view. */ }
      renderAppreciation(true);
      if (appreciation === 'up' && !thumbsUpRecorded) {
        thumbsUpRecorded = true;
        try { localStorage.setItem(recordedKey, 'true'); } catch (error) { /* Avoid duplicate clicks where storage is available. */ }
        try {
          renderTotal(await feedbackCounter.recordThumbsUp('itba'));
        } catch (error) {
          thumbsUpRecorded = false;
          try { localStorage.removeItem(recordedKey); } catch (storageError) { /* No-op. */ }
          appreciationStatus.textContent = 'Feedback saved here; the online total is temporarily unavailable.';
        }
      }
      if (appreciation && typeof window.gtag === 'function') {
        window.gtag('event', 'case_study_feedback', {
          case_study: 'itba',
          feedback: appreciation,
          page_path: window.location.pathname
        });
      }
    });
  });
  // The shared back-to-top handler requests smooth scrolling; respect the
  // reader's motion preference here without changing other portfolio pages.
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
  renderAppreciation();
  update();
})();
