(function () {
  var btn = document.getElementById("back-to-top");
  if (!btn) return;

  var threshold = 800;

  function onScroll() {
    if (window.scrollY > threshold) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  onScroll();
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
