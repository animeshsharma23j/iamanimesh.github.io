(() => {
  const main = document.querySelector('main.case-study-shell');
  if (!main || document.body.classList.contains('itba-page')) return;

  const pageKey = window.location.pathname.split('/').pop().replace('.html', '');
  const summaries = {
    'income-tax': {
      challenge: 'Make a high-stakes filing journey understandable for first-time taxpayers and senior citizens.',
      response: 'A confidence-first concept that explains one decision at a time and keeps guidance close to the action.',
      evidence: 'Independent concept, research synthesis, prototypes, and accessibility-focused testing, not an official portal.'
    },
    'unitx-case-study': {
      challenge: 'Give people a conversion answer immediately without ads, account setup, or avoidable network dependence.',
      response: 'Intent-first input with manual precision, voice, camera, history, favourites, and Apple Watch support.',
      evidence: 'A shipped iOS product, product screens, competitive audit, and customer-review evidence.'
    },
    'cgda-case-study': {
      challenge: 'A bill moved through five roles, and nothing in the system said whose turn it was.',
      response: 'Mapped the lived process role by role, audited the paper workarounds, and coded four blockers into two themes.',
      evidence: 'Working sessions and a workaround audit; recommendations submitted, with no measured before/after claimed.'
    },
    'trade-cloud-apps': {
      challenge: 'Four products for solo tradespeople, built on assumptions about a user nobody in the team had watched work.',
      response: 'Mined and coded the competitor review corpus, then traced every product decision back to a named finding.',
      evidence: 'Secondary research only: 7,439 reviews, trade forums and national surveys; no user of these apps observed yet.'
    }
  };
  const summary = summaries[pageKey];
  if (!summary) return;

  document.body.classList.add('unified-case-study');

  const story = document.createElement('article');
  story.className = 'case-layout-story';
  while (main.firstChild) story.append(main.firstChild);

  const sections = [...story.querySelectorAll(':scope > section.case-detail-grid')];
  const overview = document.createElement('section');
  overview.className = 'case-layout-overview';
  overview.id = 'overview';
  const firstSection = sections[0] || null;
  while (story.firstChild && story.firstChild !== firstSection) overview.append(story.firstChild);
  overview.querySelectorAll('.case-meta > span').forEach(item => {
    const [label, ...valueParts] = item.textContent.split(' - ');
    if (!valueParts.length) return;
    item.textContent = '';
    const heading = document.createElement('strong');
    heading.textContent = label;
    const value = document.createElement('span');
    value.textContent = valueParts.join(' - ');
    item.append(heading, value);
  });

  const usedIds = new Set(['overview']);
  const slugify = value => value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  sections.forEach((section, index) => {
    const label = section.querySelector('.detail-label')?.textContent.trim() || `Section ${index + 2}`;
    let id = slugify(label) || `section-${index + 2}`;
    let suffix = 2;
    while (usedIds.has(id)) id = `${id}-${suffix++}`;
    usedIds.add(id);
    section.id = section.id || id;
    section.classList.add('case-layout-section');
  });

  const contents = document.createElement('aside');
  contents.className = 'case-layout-contents';
  contents.setAttribute('aria-label', 'Case study contents');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'On this page');
  const navTitle = document.createElement('p');
  navTitle.textContent = 'In this case study';
  const list = document.createElement('ol');
  const entries = [
    { id: 'overview', label: 'Overview' },
    ...sections.map(section => ({ id: section.id, label: section.querySelector('.detail-label')?.textContent.trim() || 'Section' }))
  ];
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${entry.id}`;
    link.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>${entry.label}`;
    item.append(link);
    list.append(item);
  });
  nav.append(navTitle, list);
  contents.append(nav);

  const quickSummary = document.createElement('aside');
  quickSummary.className = 'case-layout-summary';
  quickSummary.setAttribute('aria-label', 'Case study summary');
  quickSummary.innerHTML = `<div><section class="case-summary-card" aria-labelledby="case-summary-title"><p class="case-summary-eyebrow">In a hurry?</p><h2 id="case-summary-title">The case, in brief.</h2><dl><div><dt>Challenge</dt><dd>${summary.challenge}</dd></div><div><dt>Response</dt><dd>${summary.response}</dd></div><div><dt>Evidence</dt><dd>${summary.evidence}</dd></div></dl></section><section class="case-feedback" aria-labelledby="case-feedback-title"><h2 id="case-feedback-title">Was this case study useful?</h2><p class="case-feedback-total" hidden><strong data-feedback-total></strong> <span data-feedback-total-label>appreciations</span> online</p><div class="case-feedback-actions" role="group" aria-label="Rate this case study"><button type="button" data-feedback="up" aria-pressed="false"><span aria-hidden="true">👍</span><span>Yes</span></button><button type="button" data-feedback="down" aria-pressed="false"><span aria-hidden="true">👎</span><span>Not quite</span></button></div><p class="case-feedback-status" aria-live="polite"></p></section></div>`;

  main.classList.add('case-layout-shell');
  main.append(contents, overview, story, quickSummary);

  const links = [...contents.querySelectorAll('a[href^="#"]')];
  const targets = links.map(link => document.getElementById(link.hash.slice(1)));
  let scheduled = false;
  const updateNav = () => {
    let active = 0;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= 160) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  const scheduleNav = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNav);
    }
  };
  window.addEventListener('scroll', scheduleNav, { passive: true });
  window.addEventListener('resize', scheduleNav);
  updateNav();

  const buttons = [...quickSummary.querySelectorAll('[data-feedback]')];
  const status = quickSummary.querySelector('.case-feedback-status');
  const total = quickSummary.querySelector('[data-feedback-total]');
  const storageKey = `case-study-feedback-${pageKey}`;
  const recordedKey = `case-study-feedback-up-recorded-${pageKey}`;
  let feedback = null;
  let thumbsUpRecorded = false;
  try { feedback = localStorage.getItem(storageKey); } catch (error) { /* Storage may be unavailable. */ }
  try { thumbsUpRecorded = localStorage.getItem(recordedKey) === 'true'; } catch (error) { /* Storage may be unavailable. */ }

  const totalLabel = quickSummary.querySelector('[data-feedback-total-label]');
  const renderTotal = count => {
    if (!total || count === null) return;
    total.textContent = new Intl.NumberFormat().format(count);
    if (totalLabel) totalLabel.textContent = count === 1 ? 'appreciation' : 'appreciations';
    total.closest('.case-feedback-total')?.removeAttribute('hidden');
  };

  window.CaseStudyFeedbackCounter?.get(pageKey)
    .then(renderTotal)
    .catch(() => {
      if (total) total.closest('.case-feedback-total')?.setAttribute('hidden', '');
    });

  const renderFeedback = announce => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.feedback === feedback)));
    status.textContent = announce && feedback ? 'Thanks for the feedback.' : feedback ? 'Your feedback is saved on this device.' : '';
  };

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const nextValue = button.dataset.feedback;
      feedback = feedback === nextValue ? null : nextValue;
      try {
        if (feedback) localStorage.setItem(storageKey, feedback);
        else localStorage.removeItem(storageKey);
      } catch (error) { /* The control still works for this page view. */ }
      renderFeedback(true);
      if (feedback === 'up' && !thumbsUpRecorded) {
        thumbsUpRecorded = true;
        try { localStorage.setItem(recordedKey, 'true'); } catch (error) { /* Avoid duplicate clicks where storage is available. */ }
        try {
          renderTotal(await window.CaseStudyFeedbackCounter?.recordThumbsUp(pageKey));
        } catch (error) {
          thumbsUpRecorded = false;
          try { localStorage.removeItem(recordedKey); } catch (storageError) { /* No-op. */ }
          status.textContent = 'Feedback saved here; the online total is temporarily unavailable.';
        }
      }
      if (feedback && typeof window.gtag === 'function') {
        window.gtag('event', 'case_study_feedback', {
          case_study: pageKey,
          feedback,
          page_path: window.location.pathname
        });
      }
    });
  });
  renderFeedback(false);
})();
