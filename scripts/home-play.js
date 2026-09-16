// A small endless runner along the foot of the home page. It is an easter egg,
// not a feature: the lane is a hairline, the strip sits at 45% opacity until
// you touch it, and it stays clear of the hero copy and the two CTAs above it.
//
// It only exists when JavaScript runs and motion is welcome — the markup ships
// hidden and nothing below unhides it under prefers-reduced-motion.
(function () {
  var strip = document.querySelector('[data-hero-play]');
  if (!strip) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var surface = strip.querySelector('[data-hero-play-surface]');
  var canvas = strip.querySelector('[data-hero-play-canvas]');
  var hint = strip.querySelector('[data-hero-play-hint]');
  var scoreEl = strip.querySelector('[data-hero-play-score]');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!surface || !ctx) return;

  strip.hidden = false;

  // The apex is derived from the lane height in resize(), so the shorter
  // mobile strip still clears its blocks with a few pixels to spare.
  var GRAVITY = 0.62;
  var RUNNER = 10;
  var RUNNER_X = 26;
  var BASE_SPEED = 2.5;
  var MAX_SPEED = 5.2;
  var RAMP = 0.00035;

  var width = 0;
  var height = 0;
  var groundY = 0;
  var jumpV = -7;
  var maxBlock = 20;
  var running = false;
  var dead = 0;          // frames left in the hit flash
  var y = 0;             // runner offset above the ground line, positive up
  var vy = 0;
  var speed = BASE_SPEED;
  var blocks = [];
  var score = 0;
  var best = 0;
  var bob = 0;
  var last = 0;
  var frame = 0;

  try { best = parseInt(localStorage.getItem('hero-play-best'), 10) || 0; } catch (e) {}

  var ink = getComputedStyle(document.documentElement);
  var accent = (ink.getPropertyValue('--amber') || '#d8a657').trim();

  function resize() {
    var box = canvas.getBoundingClientRect();
    if (!box.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    groundY = height - 14;
    var apex = Math.max(22, groundY - RUNNER - 2);
    jumpV = -Math.sqrt(2 * GRAVITY * apex);
    maxBlock = Math.max(9, Math.min(20, apex * 0.52));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function reset() {
    running = false;
    blocks = [];
    speed = BASE_SPEED;
    y = 0;
    vy = 0;
    score = 0;
    paint();
  }

  function paint() {
    if (scoreEl) scoreEl.textContent = running || score ? score + (best ? ' / ' + best : '') : '';
    if (hint) hint.textContent = running ? '' : dead > 0 ? 'again?' : 'jump';
  }

  function jump() {
    if (dead > 0) return;
    if (!running) {
      running = true;
      strip.classList.add('is-running');
      paint();
    }
    if (y <= 0.01) {
      y = 0;
      vy = jumpV;
    }
  }

  function hit() {
    dead = 34;
    running = false;
    strip.classList.remove('is-running');
    if (score > best) {
      best = score;
      try { localStorage.setItem('hero-play-best', String(best)); } catch (e) {}
    }
    paint();
  }

  function spawn() {
    blocks.push({
      x: width + 8,
      w: 6 + Math.random() * 3,
      h: maxBlock - Math.random() * (maxBlock * 0.35),
      cleared: false,
    });
  }

  function step(dt) {
    if (dead > 0) {
      dead -= dt;
      if (dead <= 0) {
        dead = 0;
        blocks = [];
        speed = BASE_SPEED;
        score = 0;
        y = 0;
        vy = 0;
        paint();
      }
      return;
    }

    if (!running) {
      bob += dt * 0.045;
      y = Math.max(0, Math.sin(bob) * 1.6);
      return;
    }

    speed = Math.min(MAX_SPEED, speed + RAMP * dt * 60);

    vy += GRAVITY * dt;
    y -= vy * dt;
    if (y <= 0) {
      y = 0;
      vy = 0;
    }

    var shift = speed * dt;
    var tail = 0;
    for (var i = blocks.length - 1; i >= 0; i--) {
      var b = blocks[i];
      b.x -= shift;
      if (!b.cleared && b.x + b.w < RUNNER_X) {
        b.cleared = true;
        score += 1;
        paint();
      }
      if (b.x + b.w < -12) blocks.splice(i, 1);
      else tail = Math.max(tail, b.x);
    }

    // Distance-based spacing, widened as the run speeds up so the gap stays
    // jumpable rather than merely surviving the first few seconds.
    if (!blocks.length || tail < width - (150 + speed * 38 + Math.random() * 130)) spawn();

    var rx = RUNNER_X + 1;
    var ry = groundY - y - RUNNER + 1;
    for (var j = 0; j < blocks.length; j++) {
      var o = blocks[j];
      if (rx < o.x + o.w && rx + RUNNER - 2 > o.x && ry + RUNNER - 2 > groundY - o.h) {
        hit();
        return;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // The lane fades out at both ends so it reads as ground, not as a rule
    // competing with the footer's border a few pixels below.
    var lane = ctx.createLinearGradient(0, 0, width, 0);
    lane.addColorStop(0, 'rgba(243, 238, 226, 0)');
    lane.addColorStop(0.12, 'rgba(243, 238, 226, 0.16)');
    lane.addColorStop(0.88, 'rgba(243, 238, 226, 0.16)');
    lane.addColorStop(1, 'rgba(243, 238, 226, 0)');
    ctx.fillStyle = lane;
    ctx.fillRect(0, groundY, width, 1);

    ctx.fillStyle = 'rgba(243, 238, 226, 0.34)';
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
    }

    // The runner blinks out over the hit flash rather than sitting there dead.
    var visible = dead > 0 ? Math.floor(dead / 5) % 2 === 0 : true;
    if (visible) {
      ctx.fillStyle = accent;
      ctx.fillRect(RUNNER_X, groundY - y - RUNNER, RUNNER, RUNNER);
    }
  }

  function loop(now) {
    frame = requestAnimationFrame(loop);
    var dt = Math.min((now - last) / 16.667, 3);
    last = now;
    if (!width) resize();
    step(dt);
    draw();
  }

  function start() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
    if (running) reset();
  }

  // Focus is taken on purpose — Safari does not focus a button on click, and
  // without focus the keyboard never reaches the game. .is-pointer suppresses
  // the focus ring for that case only; a real tab-in still shows it.
  surface.addEventListener('pointerdown', function (event) {
    event.preventDefault();
    strip.classList.add('is-pointer');
    surface.focus({ preventScroll: true });
    jump();
  });

  surface.addEventListener('keydown', function (event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter' || event.key === 'ArrowUp') {
      event.preventDefault();
      strip.classList.remove('is-pointer');
      jump();
    }
  });

  surface.addEventListener('blur', function () { strip.classList.remove('is-pointer'); });

  // Focus is what arms the keyboard, so leaving the strip ends the run rather
  // than leaving a runner sprinting into a block nobody is watching.
  surface.addEventListener('blur', function () { if (running) reset(); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  resize();
  paint();
  start();
})();
