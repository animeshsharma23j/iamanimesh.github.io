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
