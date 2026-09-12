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
// it reads as depth rather than as a trick. Pointer devices only.
const avatar = document.querySelector('[data-avatar]');
const avatarTilt = document.querySelector('[data-avatar-tilt]');
if (avatar && avatarTilt
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && window.matchMedia('(hover: hover)').matches) {
  let queued = false;
  window.addEventListener('pointermove', (event) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const box = avatar.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / window.innerWidth * 2));
      const y = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / window.innerHeight * 2));
      avatarTilt.style.transform =
        `translate3d(${(x * 7).toFixed(2)}px, ${(y * 5).toFixed(2)}px, 0)` +
        ` rotateY(${(x * 3.2).toFixed(2)}deg) rotateX(${(-y * 2.4).toFixed(2)}deg)`;
    });
  });
  document.addEventListener('pointerleave', () => { avatarTilt.style.transform = ''; });
}
