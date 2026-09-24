// Home hero animations: the eyebrow types through its roles, the lede greets
// in three languages. Both lock their width first so the surrounding line
// stays put, and both sit out entirely under prefers-reduced-motion.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lockWidest = (element, variants, index) => {
  element.style.width = 'auto';
  const widths = variants.map((variant) => {
    element.textContent = variant;
    return Math.ceil(element.getBoundingClientRect().width);
  });
  element.textContent = variants[index];
  return widths;
};

// The lede greeting: fades between languages and animates its width so the
// sentence after it glides rather than jumps.
const greeting = document.querySelector('[data-greeting]');
if (greeting) {
  const greetings = [
    'Hola',       // Spanish
    'Bonjour',    // French
    'Hallo',      // German
    'Ciao',       // Italian
    'Olá',        // Portuguese
    '你好',        // Chinese
    '안녕하세요',   // Korean
    'こんにちは',   // Japanese
    'नमस्ते',       // Hindi
  ];
  let widths = [];
  let index = 0;

  const measure = () => {
    widths = lockWidest(greeting, greetings, index);
    greeting.style.width = `${widths[index]}px`;
  };

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);

  if (!reduceMotion) {
    setInterval(() => {
      index = (index + 1) % greetings.length;
      greeting.classList.add('is-swapping');
      setTimeout(() => {
        greeting.textContent = greetings[index];
        greeting.style.width = `${widths[index]}px`;
        greeting.classList.remove('is-swapping');
      }, 220);
    }, 2600);
  }
}

// The eyebrow role: erased and retyped a character at a time.
const typedRole = document.querySelector('[data-typed]');
if (typedRole) {
  const roles = ['Researcher', 'Vibe Coder'];
  const TYPE_MS = 70;
  const ERASE_MS = 40;
  const HOLD_MS = 1900;

  const measure = () => {
    const widths = lockWidest(typedRole, roles, 0);
    typedRole.style.width = `${Math.max(...widths)}px`;
  };

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  if (!reduceMotion) {
    let index = 0;
    let count = roles[0].length;
    let erasing = true;

    const tick = () => {
      const role = roles[index];
      if (erasing) {
        count -= 1;
        typedRole.textContent = role.slice(0, count);
        if (count === 0) {
          erasing = false;
          index = (index + 1) % roles.length;
        }
        setTimeout(tick, ERASE_MS);
        return;
      }
      count += 1;
      typedRole.textContent = role.slice(0, count);
      if (count < role.length) {
        setTimeout(tick, TYPE_MS);
        return;
      }
      erasing = true;
      setTimeout(tick, HOLD_MS);
    };

    setTimeout(tick, HOLD_MS);
  }
}

// Local time, ticking on the minute.
const clock = document.querySelector('[data-clock]');
if (clock) {
  const tick = () => {
    clock.textContent = 'New Delhi, IND · IST ' + new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date());
  };
  tick();
  setInterval(tick, 15000);
}

// Avatar parallax: a few pixels of drift and a few degrees of tilt, eased, so
// it reads as depth rather than as a trick.
//
// The cursor comes from the shared listener in site.js — already throttled to
// one read per frame, and already gated on a hovering pointer and on the
// reader not having asked for less motion — rather than from a second global
// pointermove of our own.
const avatar = document.querySelector('[data-avatar]');
const avatarTilt = document.querySelector('[data-avatar-tilt]');
const pointer = window.SitePointer;
if (avatar && avatarTilt && pointer && pointer.available) {
  pointer.onMove((clientX, clientY) => {
    const box = avatar.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (clientX - (box.left + box.width / 2)) / window.innerWidth * 2));
    const y = Math.max(-1, Math.min(1, (clientY - (box.top + box.height / 2)) / window.innerHeight * 2));
    avatarTilt.style.transform =
      `translate3d(${(x * 7).toFixed(2)}px, ${(y * 5).toFixed(2)}px, 0)` +
      ` rotateY(${(x * 3.2).toFixed(2)}deg) rotateX(${(-y * 2.4).toFixed(2)}deg)`;
  });
  pointer.onLeave(() => { avatarTilt.style.transform = ''; });
}

// The field reacts to the pointer. Spheres and motes are shoved out of its way
// and drift back once it has gone by, so the background is something you can
// disturb rather than something you only look at.
//
// Written to the independent `translate` property, never to `transform`: the
// drift and mote-drift keyframes already own transform, and writing there would
// cancel them the moment the pointer arrived. The easing back lives in
// styles.css, on .home .spark / .home .mote.
//
// The cursor again comes from site.js's shared, frame-throttled listener, which
// is already gated on a hovering pointer and on the reader not having asked for
// less motion — so on touch, and under prefers-reduced-motion, none of this
// runs and nothing is ever written.
const FIELD_SEL = '.spark, .mote';
const REPEL_RADIUS = 260;   // px; beyond this a shape is left alone
const REPEL_MAX = 58;       // px of displacement at the very centre

if (pointer && pointer.available && document.querySelector('.space-field')) {
  // Both the field and the cursor-lens clone of it are collected. The clone
  // registers pixel for pixel on the original, so each element resolves the
  // same displacement from its own centre and the two stay in lockstep without
  // having to be paired up.
  let shapes = [];

  // Measured at rest, in one read pass after one write pass — interleaving the
  // two would force a reflow per element across eighty-odd of them.
  const measureField = () => {
    const nodes = document.querySelectorAll(FIELD_SEL);
    nodes.forEach((el) => { el.style.translate = ''; });
    shapes = Array.from(nodes, (el) => {
      const box = el.getBoundingClientRect();
      return { el, cx: box.left + box.width / 2, cy: box.top + box.height / 2, tx: 0, ty: 0 };
    });
  };

  // .space-field is position: fixed, so these centres are viewport coordinates
  // and survive scrolling. Only a resize invalidates them.
  measureField();
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureField, 200);
  });

  pointer.onMove((px, py) => {
    for (let i = 0; i < shapes.length; i += 1) {
      const shape = shapes[i];
      const dx = shape.cx - px;
      const dy = shape.cy - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let tx = 0;
      let ty = 0;

      if (dist < REPEL_RADIUS && dist > 0.01) {
        // Squared falloff rather than linear: the push collapses to nothing
        // well before the radius, so the edge of the effect is never a visible
        // ring of shapes all leaning the same way.
        const fade = 1 - dist / REPEL_RADIUS;
        const force = fade * fade * REPEL_MAX;
        tx = (dx / dist) * force;
        ty = (dy / dist) * force;
      }

      // Sub-pixel churn is invisible and still costs a style write each frame.
      if (Math.abs(tx - shape.tx) < 0.5 && Math.abs(ty - shape.ty) < 0.5) continue;
      shape.tx = tx;
      shape.ty = ty;
      shape.el.style.translate = (tx || ty) ? `${tx.toFixed(1)}px ${ty.toFixed(1)}px` : '';
    }
  });

  pointer.onLeave(() => {
    shapes.forEach((shape) => {
      shape.tx = 0;
      shape.ty = 0;
      shape.el.style.translate = '';
    });
  });
}
