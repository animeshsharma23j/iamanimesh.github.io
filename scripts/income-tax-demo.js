(function () {
  var screens = Array.prototype.slice.call(document.querySelectorAll(".demo-screen"));
  var progressSegments = Array.prototype.slice.call(document.querySelectorAll(".demo-progress span"));
  var stepCountEl = document.getElementById("demo-step-count");
  var questionOrder = ["q-salary", "q-capgains", "q-business", "q-foreign"];
  var answers = {};
  var manualForm = null;

  function showScreen(id) {
    screens.forEach(function (screen) {
      screen.classList.toggle("is-active", screen.id === id);
    });
    var qIndex = questionOrder.indexOf(id);
    if (qIndex > -1) {
      progressSegments.forEach(function (seg, i) {
        seg.classList.toggle("is-done", i <= qIndex);
      });
      stepCountEl.textContent = "Step " + (qIndex + 1) + " of " + questionOrder.length;
    } else if (id === "start") {
      progressSegments.forEach(function (seg) {
        seg.classList.remove("is-done");
      });
      stepCountEl.textContent = "";
    } else {
      progressSegments.forEach(function (seg) {
        seg.classList.add("is-done");
      });
      stepCountEl.textContent = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextQuestion(currentId) {
    var idx = questionOrder.indexOf(currentId);
    if (idx > -1 && idx < questionOrder.length - 1) {
      showScreen(questionOrder[idx + 1]);
    } else {
      resolveForm();
    }
  }

  function resolveForm() {
    manualForm = null;
    var form, why;
    if (answers.foreign === "yes") {
      form = answers.business === "yes" ? "ITR-3" : "ITR-2";
      why = "Foreign assets or income need Schedule FA, which ITR-1 doesn't support" + (answers.business === "yes" ? ", and business income needs ITR-3." : ".");
    } else if (answers.business === "yes") {
      form = "ITR-3";
      why = "Business or freelance income needs ITR-3.";
    } else if (answers.capgains === "yes") {
      form = "ITR-2";
      why = "Capital gains from selling investments need ITR-2, not ITR-1.";
    } else if (answers.salary === "yes") {
      form = "ITR-1";
      why = "Salary income only, no capital gains, business income, or foreign assets — this is the simplest case.";
    } else {
      form = "ITR-2";
      why = "This combination is less common — ITR-2 covers most cases outside salary-only and business income.";
    }
    document.getElementById("demo-result-form").textContent = form;
    document.getElementById("demo-result-why").textContent = why;
    showScreen("resolve");
  }

  document.querySelectorAll("[data-start]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen(questionOrder[0]);
    });
  });

  document.querySelectorAll("[data-answer]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var screen = btn.closest(".demo-screen");
      var key = screen.getAttribute("data-question");
      answers[key] = btn.getAttribute("data-answer");
      nextQuestion(screen.id);
    });
  });

  var notRightBtn = document.getElementById("demo-not-right");
  if (notRightBtn) {
    notRightBtn.addEventListener("click", function () {
      showScreen("override");
    });
  }

  document.querySelectorAll("[data-manual-form]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      manualForm = btn.getAttribute("data-manual-form");
      document.getElementById("demo-review-form").textContent = manualForm;
      showReview();
    });
  });

  var continueReviewBtn = document.getElementById("demo-continue-review");
  if (continueReviewBtn) {
    continueReviewBtn.addEventListener("click", function () {
      document.getElementById("demo-review-form").textContent = document.getElementById("demo-result-form").textContent;
      showReview();
    });
  }

  function showReview() {
    var capgainsLine = document.getElementById("demo-review-capgains");
    if (capgainsLine) {
      capgainsLine.style.display = answers.capgains === "yes" ? "flex" : "none";
    }
    showScreen("review");
  }

  var doneBtn = document.getElementById("demo-review-done");
  if (doneBtn) {
    doneBtn.addEventListener("click", function () {
      showScreen("done");
    });
  }

  var restartLinks = document.querySelectorAll("[data-restart]");
  restartLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      answers = {};
      showScreen("start");
    });
  });

  var sendFeedbackBtn = document.getElementById("demo-send-feedback");
  if (sendFeedbackBtn) {
    sendFeedbackBtn.addEventListener("click", function () {
      var text = document.getElementById("demo-feedback-text").value.trim();
      var subject = encodeURIComponent("Income Tax concept — feedback");
      var body = encodeURIComponent(
        (text || "(no written comment — just the click-through)") +
          "\n\n---\nRecommended form shown: " +
          (document.getElementById("demo-review-form").textContent || "n/a")
      );
      window.location.href = "mailto:animeshsharma23j@gmail.com?subject=" + subject + "&body=" + body;
      document.getElementById("demo-thanks").classList.add("is-visible");
    });
  }

  showScreen("start");
})();
