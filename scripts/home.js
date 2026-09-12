// Keep same-page navigation clear of the mobile menu overlay.
const homeMenu = document.querySelector('.home-page .mobile-menu');
if (homeMenu) {
  homeMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) homeMenu.open = false;
  });
  homeMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && homeMenu.open) {
      homeMenu.open = false;
      homeMenu.querySelector('summary').focus();
    }
  });
}

// Cycle the hero greeting through a few languages; width animates so the
// sentence after it stays put.
const greeting = document.querySelector('.home-page [data-greeting]');
if (greeting) {
  const greetings = ['Hola', 'こんにちは', 'नमस्ते'];
  let widths = [];
  let index = 0;

  const measure = () => {
    greeting.style.width = 'auto';
    widths = greetings.map((word) => {
      greeting.textContent = word;
      return Math.ceil(greeting.getBoundingClientRect().width);
    });
    greeting.textContent = greetings[index];
    greeting.style.width = `${widths[index]}px`;
  };

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduceMotion.matches) {
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

// Type the second half of the hero eyebrow, one role after another.
const typedRole = document.querySelector('.home-page [data-typed]');
if (typedRole) {
  const roles = ['Researcher', 'Vibe Coder'];
  const TYPE_MS = 70;
  const ERASE_MS = 40;
  const HOLD_MS = 1900;

  const lockWidth = () => {
    typedRole.style.minWidth = '';
    const widest = roles.reduce((max, role) => {
      typedRole.textContent = role;
      return Math.max(max, typedRole.getBoundingClientRect().width);
    }, 0);
    typedRole.textContent = roles[0];
    typedRole.style.minWidth = `${Math.ceil(widest)}px`;
  };

  lockWidth();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockWidth);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
