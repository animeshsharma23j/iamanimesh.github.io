(function () {
  var screens = Array.prototype.slice.call(document.querySelectorAll(".demo-screen"));
  var progressSegments = Array.prototype.slice.call(document.querySelectorAll(".demo-progress span"));
  var stepCountEl = document.getElementById("demo-step-count");

  var IMPORTED = {
    salary: 940000,
    tds: 68000,
    bankInterest: 8400,
    capgainsAmount: 120000
  };

  var DED_80C = 150000;
  var DED_80D = 25000;

  var progressOrder = ["snapshot", "q-capgains", "q-business", "q-foreign", "deductions", "regime", "resolve", "review", "everify"];
  var WIDE_SCREENS = ["home", "guide"];
  var demoShell = document.querySelector(".demo-shell");

  var answers = { capgains: null, business: null, foreign: null, ded80c: false, ded80d: false };
  var computed = { newTax: 0, oldTax: 0, recommended: "new", finalTax: 0, totalIncome: 0 };
  var manualForm = null;

  function fmt(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function showScreen(id) {
    screens.forEach(function (screen) {
      screen.classList.toggle("is-active", screen.id === id);
    });
    if (demoShell) {
      demoShell.classList.toggle("is-wide", WIDE_SCREENS.indexOf(id) > -1);
    }
    var idx = progressOrder.indexOf(id);
    if (idx > -1) {
      progressSegments.forEach(function (seg, i) {
        seg.classList.toggle("is-done", i <= idx);
      });
      stepCountEl.textContent = "Step " + (idx + 1) + " of " + progressOrder.length;
    } else {
      stepCountEl.textContent = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---- Simple screen-to-screen navigation (Home, Guide) ----
  document.querySelectorAll("[data-goto]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen(btn.getAttribute("data-goto"));
    });
  });

  // ---- Sign in: PAN -> OTP ----
  var panInput = document.getElementById("signin-pan");
  var sendOtpBtn = document.getElementById("demo-signin-send-otp");
  var panError = document.getElementById("signin-pan-error");
  var PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  var DEMO_VALID_PAN = "ABCDE1234F";

  function showPanError(msg) {
    panError.textContent = msg;
    panError.hidden = false;
    panInput.classList.add("is-invalid");
  }

  function hidePanError() {
    panError.hidden = true;
    panInput.classList.remove("is-invalid");
  }

  if (panInput && sendOtpBtn) {
    panInput.addEventListener("input", function () {
      panInput.value = panInput.value.toUpperCase();
      sendOtpBtn.disabled = panInput.value.length !== 10;
      hidePanError();
    });
    sendOtpBtn.addEventListener("click", function () {
      var value = panInput.value.trim();
      if (!PAN_PATTERN.test(value)) {
        showPanError("That doesn't look like a valid PAN — 5 letters, 4 digits, then 1 letter (e.g. ABCDE1234F).");
        return;
      }
      if (value !== DEMO_VALID_PAN) {
        showPanError("We couldn't find an account for this PAN. Double-check the number, or use the demo PAN ABCDE1234F.");
        return;
      }
      hidePanError();
      showScreen("signin-otp");
    });
  }

  function wireOtpBoxes(containerId, buttonEl, onComplete) {
    var boxes = Array.prototype.slice.call(document.querySelectorAll("#" + containerId + " .otp-box"));
    boxes.forEach(function (input, i) {
      input.addEventListener("input", function () {
        input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (input.value && boxes[i + 1]) {
          boxes[i + 1].focus();
        }
        var complete = boxes.every(function (b) {
          return b.value.length === 1;
        });
        if (buttonEl) buttonEl.disabled = !complete;
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !input.value && boxes[i - 1]) {
          boxes[i - 1].focus();
        }
      });
    });
    return boxes;
  }

  var signinOtpBoxes = wireOtpBoxes("signin-otp-row", document.getElementById("demo-signin-verify"));
  var signinVerifyBtn = document.getElementById("demo-signin-verify");
  if (signinVerifyBtn) {
    signinVerifyBtn.addEventListener("click", function () {
      showScreen("home");
    });
  }

  // ---- Start -> importing animation ----
  document.querySelectorAll("[data-start]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen("importing");
      runImportAnimation();
    });
  });

  function runImportAnimation() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".import-item"));
    items.forEach(function (item) {
      item.classList.remove("is-done");
    });
    var continueBtn = document.getElementById("demo-import-continue");
    continueBtn.hidden = true;
    items.forEach(function (item, i) {
      setTimeout(function () {
        item.classList.add("is-done");
        if (i === items.length - 1) {
          setTimeout(function () {
            continueBtn.hidden = false;
          }, 350);
        }
      }, 450 * (i + 1));
    });
  }

  document.querySelectorAll("[data-goto-snapshot]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen("snapshot");
    });
  });

  // ---- Snapshot -> first question ----
  document.querySelectorAll("[data-snapshot-continue]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen("q-capgains");
    });
  });

  // ---- Yes/No style question screens ----
  document.querySelectorAll("[data-answer]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var screen = btn.closest(".demo-screen");
      var key = screen.getAttribute("data-question");
      answers[key] = btn.getAttribute("data-answer");
      if (key === "capgains") {
        showScreen("q-business");
      } else if (key === "business") {
        showScreen("q-foreign");
      } else if (key === "foreign") {
        showScreen("deductions");
      }
    });
  });

  // ---- Deductions toggles ----
  var ded80cToggle = document.getElementById("demo-ded-80c");
  var ded80dToggle = document.getElementById("demo-ded-80d");
  if (ded80cToggle) {
    ded80cToggle.addEventListener("click", function () {
      answers.ded80c = !answers.ded80c;
      ded80cToggle.classList.toggle("is-on", answers.ded80c);
      ded80cToggle.setAttribute("aria-pressed", String(answers.ded80c));
    });
  }
  if (ded80dToggle) {
    ded80dToggle.addEventListener("click", function () {
      answers.ded80d = !answers.ded80d;
      ded80dToggle.classList.toggle("is-on", answers.ded80d);
      ded80dToggle.setAttribute("aria-pressed", String(answers.ded80d));
    });
  }
  var toRegimeBtn = document.getElementById("demo-to-regime");
  if (toRegimeBtn) {
    toRegimeBtn.addEventListener("click", function () {
      runTaxCalculation();
      showScreen("regime");
    });
  }

  // ---- Tax calculation ----
  function slabTax(taxable, slabs) {
    var tax = 0;
    var remaining = taxable;
    var lower = 0;
    for (var i = 0; i < slabs.length; i++) {
      var upper = slabs[i][0];
      var rate = slabs[i][1];
      var band = Math.min(remaining, upper - lower);
      if (band > 0) {
        tax += band * rate;
        remaining -= band;
      }
      lower = upper;
      if (remaining <= 0) break;
    }
    return tax;
  }

  var NEW_SLABS = [[300000, 0], [600000, 0.05], [900000, 0.1], [1200000, 0.15], [1500000, 0.2], [Infinity, 0.3]];
  var OLD_SLABS = [[250000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3]];

  function runTaxCalculation() {
    var gross = IMPORTED.salary + IMPORTED.bankInterest + (answers.capgains === "yes" ? IMPORTED.capgainsAmount : 0);
    computed.totalIncome = gross;

    var newTaxable = Math.max(0, gross - 75000);
    var oldDeductions = 50000 + (answers.ded80c ? DED_80C : 0) + (answers.ded80d ? DED_80D : 0);
    var oldTaxable = Math.max(0, gross - oldDeductions);

    computed.newTax = Math.round(slabTax(newTaxable, NEW_SLABS) * 1.04);
    computed.oldTax = Math.round(slabTax(oldTaxable, OLD_SLABS) * 1.04);
    computed.recommended = computed.newTax <= computed.oldTax ? "new" : "old";
    computed.finalTax = computed.recommended === "new" ? computed.newTax : computed.oldTax;

    document.getElementById("demo-new-tax").textContent = fmt(computed.newTax);
    document.getElementById("demo-old-tax").textContent = fmt(computed.oldTax);
    document.getElementById("demo-savings").textContent = fmt(Math.abs(computed.newTax - computed.oldTax));
    var newCard = document.getElementById("demo-regime-new");
    var oldCard = document.getElementById("demo-regime-old");
    newCard.classList.toggle("is-recommended", computed.recommended === "new");
    oldCard.classList.toggle("is-recommended", computed.recommended === "old");
    document.getElementById("demo-old-deductions-note").style.display = answers.ded80c || answers.ded80d ? "block" : "none";
  }

  document.querySelectorAll("[data-pick-regime]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      computed.recommended = btn.getAttribute("data-pick-regime");
      computed.finalTax = computed.recommended === "new" ? computed.newTax : computed.oldTax;
      resolveForm();
    });
  });

  // ---- Resolve (ITR form recommendation) ----
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
    } else {
      form = "ITR-1";
      why = "Salary and bank interest only, no capital gains, business income, or foreign assets — the simplest case.";
    }
    document.getElementById("demo-result-form").textContent = form;
    document.getElementById("demo-result-why").textContent = why;
    document.getElementById("demo-result-regime").textContent = (computed.recommended === "new" ? "New" : "Old") + " regime, estimated tax " + fmt(computed.finalTax);
    showScreen("resolve");
  }

  var notRightBtn = document.getElementById("demo-not-right");
  if (notRightBtn) {
    notRightBtn.addEventListener("click", function () {
      showScreen("override");
    });
  }

  document.querySelectorAll("[data-manual-form]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      manualForm = btn.getAttribute("data-manual-form");
      showReview();
    });
  });

  var continueReviewBtn = document.getElementById("demo-continue-review");
  if (continueReviewBtn) {
    continueReviewBtn.addEventListener("click", showReview);
  }

  // ---- Review ----
  function showReview() {
    var form = manualForm || document.getElementById("demo-result-form").textContent;
    document.getElementById("demo-review-form").textContent = form;
    document.getElementById("demo-review-regime").textContent = computed.recommended === "new" ? "New regime" : "Old regime";
    document.getElementById("demo-review-income").textContent = fmt(computed.totalIncome);
    document.getElementById("demo-review-tax").textContent = fmt(computed.finalTax);
    document.getElementById("demo-review-tds").textContent = fmt(IMPORTED.tds);
    var diff = computed.finalTax - IMPORTED.tds;
    var outcomeEl = document.getElementById("demo-review-outcome");
    if (diff > 0) {
      outcomeEl.textContent = fmt(diff) + " still payable";
      outcomeEl.classList.add("is-payable");
      outcomeEl.classList.remove("is-refund");
    } else {
      outcomeEl.textContent = fmt(Math.abs(diff)) + " refund due";
      outcomeEl.classList.add("is-refund");
      outcomeEl.classList.remove("is-payable");
    }
    var capgainsLine = document.getElementById("demo-review-capgains");
    if (capgainsLine) {
      capgainsLine.style.display = answers.capgains === "yes" ? "flex" : "none";
    }
    showScreen("review");
  }

  var reviewDoneBtn = document.getElementById("demo-review-done");
  if (reviewDoneBtn) {
    reviewDoneBtn.addEventListener("click", function () {
      var diff = computed.finalTax - IMPORTED.tds;
      if (diff > 0) {
        resetChallanScreen();
        showScreen("challan-check");
      } else {
        showScreen("everify");
      }
    });
  }

  // ---- Challan check ----
  function resetChallanScreen() {
    document.getElementById("challan-initial-choices").style.display = "grid";
    document.getElementById("challan-yes-panel").hidden = true;
    document.getElementById("challan-no-panel").hidden = true;
    var numInput = document.getElementById("challan-number");
    var bsrInput = document.getElementById("challan-bsr");
    if (numInput) numInput.value = "";
    if (bsrInput) bsrInput.value = "";
  }

  document.querySelectorAll("[data-challan]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("challan-initial-choices").style.display = "none";
      if (btn.getAttribute("data-challan") === "yes") {
        document.getElementById("challan-yes-panel").hidden = false;
      } else {
        document.getElementById("challan-no-panel").hidden = false;
      }
    });
  });

  document.querySelectorAll("[data-challan-continue]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen("everify");
    });
  });

  // ---- e-Verify (simulated OTP) ----
  var otpInputs = Array.prototype.slice.call(document.querySelectorAll(".otp-box"));
  otpInputs.forEach(function (input, i) {
    input.addEventListener("input", function () {
      input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);
      if (input.value && otpInputs[i + 1]) {
        otpInputs[i + 1].focus();
      }
      checkOtpComplete();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !input.value && otpInputs[i - 1]) {
        otpInputs[i - 1].focus();
      }
    });
  });

  function checkOtpComplete() {
    var complete = otpInputs.every(function (input) {
      return input.value.length === 1;
    });
    document.getElementById("demo-file-now").disabled = !complete;
  }

  var fileNowBtn = document.getElementById("demo-file-now");
  if (fileNowBtn) {
    fileNowBtn.addEventListener("click", function () {
      var ack = "ITR-DEMO-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("demo-ack-number").textContent = ack;
      showScreen("done");
    });
  }

  // ---- Restart ----
  document.querySelectorAll("[data-restart]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      answers = { capgains: null, business: null, foreign: null, ded80c: false, ded80d: false };
      manualForm = null;
      otpInputs.forEach(function (input) {
        input.value = "";
      });
      if (ded80cToggle) {
        ded80cToggle.classList.remove("is-on");
        ded80cToggle.setAttribute("aria-pressed", "false");
      }
      if (ded80dToggle) {
        ded80dToggle.classList.remove("is-on");
        ded80dToggle.setAttribute("aria-pressed", "false");
      }
      document.getElementById("demo-thanks").classList.remove("is-visible");
      document.getElementById("demo-feedback-text").value = "";
      resetChallanScreen();
      if (panInput) panInput.value = "";
      if (sendOtpBtn) sendOtpBtn.disabled = true;
      hidePanError();
      signinOtpBoxes.forEach(function (input) {
        input.value = "";
      });
      if (signinVerifyBtn) signinVerifyBtn.disabled = true;
      showScreen("signin");
    });
  });

  // ---- Feedback ----
  var sendFeedbackBtn = document.getElementById("demo-send-feedback");
  if (sendFeedbackBtn) {
    sendFeedbackBtn.addEventListener("click", function () {
      var text = document.getElementById("demo-feedback-text").value.trim();
      var subject = encodeURIComponent("Income Tax concept — feedback");
      var body = encodeURIComponent(
        (text || "(no written comment — just the click-through)") +
          "\n\n---\nForm shown: " +
          (document.getElementById("demo-review-form").textContent || "n/a") +
          "\nRegime: " +
          (document.getElementById("demo-review-regime").textContent || "n/a")
      );
      window.location.href = "mailto:animeshsharma23j@gmail.com?subject=" + subject + "&body=" + body;
      document.getElementById("demo-thanks").classList.add("is-visible");
    });
  }

  showScreen("signin");
})();
