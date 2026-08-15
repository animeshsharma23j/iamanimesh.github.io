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
