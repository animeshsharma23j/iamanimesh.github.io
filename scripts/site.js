(function () {
  var btn = document.getElementById("back-to-top");
  if (!btn) return;

  var threshold = 800;
  var footer = document.querySelector(".site-footer");
  var footerIsVisible = false;

  function onScroll() {
    if (window.scrollY > threshold && !footerIsVisible) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (footer && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      footerIsVisible = entries[0].isIntersecting;
      onScroll();
    }).observe(footer);
  }

  onScroll();
})();

(function () {
  var menus = document.querySelectorAll(".mobile-menu");
  if (!menus.length) return;

  function setMenuLabel(menu) {
    var summary = menu.querySelector("summary");
    if (!summary) return;
    summary.setAttribute("aria-label", menu.open ? "Close navigation" : "Open navigation");
  }

  menus.forEach(function (menu) {
    setMenuLabel(menu);

    menu.addEventListener("toggle", function () {
      setMenuLabel(menu);
    });

    menu.querySelectorAll("nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.open = false;
      });
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    menus.forEach(function (menu) {
      if (!menu.open) return;
      menu.open = false;

      var summary = menu.querySelector("summary");
      if (summary) summary.focus();
    });
  });
})();

(function () {
  var localTime = document.querySelector("[data-about-local-time]");
  if (!localTime || typeof Intl === "undefined") return;

  var dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  var timeFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  function updateLocalTime() {
    var now = new Date();
    localTime.dateTime = now.toISOString();
    localTime.textContent = dateFormatter.format(now) + " · " + timeFormatter.format(now) + " IST";
  }

  updateLocalTime();
  window.setInterval(updateLocalTime, 30000);
})();

(function () {
  var images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  function reveal(img) {
    img.classList.add("is-loaded");
  }

  images.forEach(function (img) {
    if (img.complete) {
      reveal(img);
    } else {
      img.addEventListener("load", function () { reveal(img); });
      img.addEventListener("error", function () { reveal(img); });
    }
  });
})();

(function () {
  var links = document.querySelectorAll('a[href*="apps.apple.com"]');
  if (!links.length) return;

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (typeof gtag !== "function") return;
      gtag("event", "app_store_click", {
        app_name: link.getAttribute("data-app") || document.title,
        link_url: link.href,
        link_location: link.closest("footer") ? "footer" : "hero",
      });
    });
  });
})();

/* ───────────────────────────────────────────────────────────────────────────
   Scroll reveal.

   Targeting is derived rather than authored: every page on this site lays its
   content out as `main > section` / `main > article`, so that is the reveal
   unit and no page needs annotating. The one refinement is card grids — a
   section built around one reveals its heading and then its cards as a single
   staggered sequence, rather than the whole block arriving at once.

   Nothing nests: an element is either a reveal unit or a container of them,
   never both, so no element ever fades in inside another element that is
   itself still fading in.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var root = document.documentElement;

  // Tell the head script's failsafe that reveal is alive, so it stops counting
  // down towards un-hiding everything.
  root.dataset.revealReady = "1";

  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("js-reveal");
    return;
  }

  // Containers whose children read as a set and so should cascade. Note that
  // .case-detail-grid is deliberately absent: it is the case-study section
  // itself, not a grid of cards inside one.
  var GROUP_SEL = [
    ".product-feature-grid",
    ".case-proof-grid",
    ".screenshot-grid",
    ".suite-grid",
    ".journey-list",
    ".about-certification-list",
    ".product-faq-list"
  ].join(",");

  // Blocks that are cards rather than prose. They arrive whole and with the
  // heavier treatment in styles.css, and are never split into a staggered
  // sequence — a card coming into existence is the effect, so taking it apart
  // into its own contents would defeat it.
  var CARD_SEL = ".product-showcase";

  // At 50ms a step an unbounded stagger punishes long lists — twelve items
  // would put the last card 550ms behind the first and the group would visibly
  // crawl. Past the sixth the eye has read the pattern; the rest arrive together.
  var STAGGER_CAP = 5;

  // Read the motion tokens once. They do not change at runtime, and resolving
  // them per element would put a style read inside every loop below.
  var tokens = getComputedStyle(root);
  var STAGGER_MS = parseFloat(tokens.getPropertyValue("--reveal-stagger")) || 0;
  var DURATION_MS = parseFloat(tokens.getPropertyValue("--reveal-dur")) || 460;

  var main = document.querySelector("main");
  if (!main) return;

  // Sections are normally direct children of main. The exception is a page
  // built around layout wrappers — the case study with the sticky contents
  // column nests its sections two divs deep — so plain divs are descended
  // through, in document order, until the sections themselves are found. A
  // wrapper has to yield more than one section to count as a content column,
  // which keeps this from unwrapping an ordinary div that happens to hold one.
  //
  // Only divs are descended through. An aside is furniture — the sticky
  // contents list must not fade in and out as the reader moves down the page.
  function collect(node, depth) {
    var found = [];
    Array.prototype.forEach.call(node.children, function (child) {
      if (child.tagName === "SECTION" || child.tagName === "ARTICLE") {
        found.push(child);
        return;
      }
      if (child.tagName !== "DIV" || depth < 1) return;
      var inner = collect(child, depth - 1);
      if (inner.length > 1) Array.prototype.push.apply(found, inner);
    });
    return found;
  }

  var blocks = collect(main, 3);
  if (!blocks.length) return;

  var targets = [];

  blocks.forEach(function (block) {
    var sequence = [];

    if (block.matches(CARD_SEL)) {
      block.classList.add("reveal-card");
      block.setAttribute("data-reveal", "");
      block.style.setProperty("--reveal-delay", "0ms");
      targets.push(block);
      return;
    }

    Array.prototype.forEach.call(block.children, function (child) {
      var group = child.matches(GROUP_SEL) ? child : child.querySelector(GROUP_SEL);
      if (group && group.children.length > 2) {
        Array.prototype.push.apply(sequence, Array.prototype.slice.call(group.children));
      } else {
        sequence.push(child);
      }
    });

    // A section with no card grid arrives as one piece. Only split it up when
    // splitting it says something.
    var hasGroup = !!block.querySelector(GROUP_SEL);
    if (!hasGroup || sequence.length < 2) sequence = [block];

    sequence.forEach(function (el, i) {
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--reveal-delay", Math.min(i, STAGGER_CAP) * STAGGER_MS + "ms");
      targets.push(el);
    });
  });

  function settle(el) {
    var delay = parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
    setTimeout(function () { el.classList.add("is-settled"); }, DURATION_MS + delay + 60);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Outside the root is now only ever "still below the fold".
      if (!entry.isIntersecting) return;

      observer.unobserve(entry.target);

      // Already scrolled clean past it — an in-page anchor, a restored scroll
      // position, a jump from the contents list. Never animate something the
      // reader has moved behind; just show it.
      if (entry.boundingClientRect.bottom < 0) {
        entry.target.classList.add("is-immediate");
        return;
      }

      entry.target.classList.add("is-in");
      settle(entry.target);
    });
  }, {
    // The bottom margin is the trigger line: an element reveals once it has
    // crossed 12% up from the foot of the viewport, so it arrives meaningfully
    // in view rather than one pixel across the fold.
    //
    // The top margin extends the root far above the viewport on purpose.
    // Without it, an element that is jumped straight over — from below the fold
    // to above the ceiling in one scroll — never crosses a boundary, so no
    // callback ever fires and it stays invisible for the life of the page.
    // Extending the root upwards means passing it always registers.
    rootMargin: "100000px 0px -12% 0px",
    threshold: 0
  });

  // Read every position first, then write. Interleaving the two would force a
  // reflow per element, and the long case study has twenty-two of them.
  //
  // This runs in the same synchronous pass that set data-reveal above, so
  // anything on screen at load is marked is-immediate before the browser gets
  // a chance to paint it hidden. Content in the opening viewport never flashes;
  // content below it was not being painted yet anyway.
  var fold = window.innerHeight * 0.92;
  var tops = targets.map(function (el) { return el.getBoundingClientRect().top; });

  targets.forEach(function (el, i) {
    if (tops[i] < fold) {
      el.classList.add("is-immediate");
      return;
    }
    observer.observe(el);
  });
})();

/* ───────────────────────────────────────────────────────────────────────────
   One pointer listener for the whole site.

   Two effects want the cursor — the lattice below, and the avatar parallax on
   the home page — and each adding its own global pointermove would mean two
   listeners and two rAF loops running against the same events. Effects
   subscribe here instead, and the position is read once per frame however many
   of them are listening.
   ─────────────────────────────────────────────────────────────────────────── */
window.SitePointer = (function () {
  var moveSubs = [];
  var leaveSubs = [];
  var listening = false;
  var queued = false;
  var x = 0;
  var y = 0;

  function flush() {
    queued = false;
    for (var i = 0; i < moveSubs.length; i++) moveSubs[i](x, y);
  }

  function onMove(event) {
    x = event.clientX;
    y = event.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(flush);
  }

  function onLeave() {
    for (var i = 0; i < leaveSubs.length; i++) leaveSubs[i]();
  }

  // Attached lazily: a page where nothing subscribes never binds a listener.
  function listen() {
    if (listening) return;
    listening = true;
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
  }

  return {
    // A real hovering pointer, and motion the reader has not asked us to stop.
    // Touch devices have no hover to respond to and would only pay the cost.
    available: window.matchMedia("(hover: hover)").matches &&
               !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    onMove: function (fn) { moveSubs.push(fn); listen(); },
    onLeave: function (fn) { leaveSubs.push(fn); listen(); }
  };
})();


/* ───────────────────────────────────────────────────────────────────────────
   The cursor lens over the background artwork. Styling lives in styles.css.

   The layer is a clone of .space-field rather than anything new: same markup,
   same rules, so the bright copy sits exactly on top of the dim original with
   no registration work. It is built here rather than in the markup because it
   is inert without the pointer, and because thirty-five pages should not each
   carry a duplicate of the artwork in their HTML for a decoration.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var pointer = window.SitePointer;
  if (!pointer.available) return;

  var field = document.querySelector(".space-field");
  if (!field) return;

  var lit = field.cloneNode(true);
  lit.classList.add("space-field-lit");
  // Decoration twice over: the original is already aria-hidden and the clone
  // inherits it, but an id would now be duplicated, so strip any that came
  // along for the ride.
  lit.removeAttribute("id");
  Array.prototype.forEach.call(lit.querySelectorAll("[id]"), function (node) {
    node.removeAttribute("id");
  });
  field.parentNode.insertBefore(lit, field.nextSibling);

  pointer.onMove(function (x, y) {
    if (!lit.classList.contains("is-live")) lit.classList.add("is-live");
    lit.style.setProperty("--px", x + "px");
    lit.style.setProperty("--py", y + "px");
  });

  pointer.onLeave(function () {
    lit.classList.remove("is-live");
  });
})();
