// ==============================================
// Owned by Team 05
// ==============================================

"use strict";
// menu + game logic (wait for vocabulary to be ready)
$(function () {
  // If vocabulary offers when_ready, wait for it; otherwise run immediately.
  const runWhenReady = (fn) => {
    if (window.vocabulary && typeof window.vocabulary.when_ready === "function") {
      window.vocabulary.when_ready(fn);
    } else {
      // small delay to allow script load
      setTimeout(fn, 100);
    }
  };

  runWhenReady(function () {
    let currentWord = null; // normalized: {english: "...", swedish: "..."}

    // Robust normalizer for various get_random return shapes
    function normalizeRandom(raw) {
      if (!raw && raw !== 0) return null;
      if (typeof raw === "string") return { english: raw, swedish: "" };
      if (Array.isArray(raw)) return normalizeRandom(raw[0]);
      if (typeof raw === "object") {
        // try common keys
        const english = raw.english || raw.word || raw.text || raw.en || raw.label || "";
        const swedish = raw.swedish || raw.sv || raw.translation || raw.trans || raw.answer || raw.correct || "";
        // sometimes translations are arrays
        const sw = Array.isArray(swedish) ? (swedish[0] || "") : swedish;
        return { english: String(english || "").trim(), swedish: String(sw || "").trim() };
      }
      return null;
    }

    function loadWord() {
      let raw = null;
      try {
        raw = window.vocabulary && typeof window.vocabulary.get_random === "function"
          ? window.vocabulary.get_random()
          : null;
      } catch (e) {
        console.warn("vocabulary.get_random() error:", e);
        raw = null;
      }

      currentWord = normalizeRandom(raw);

      if (!currentWord || !currentWord.english) {
        $("#word-display").text("(No word available)").css("color", "#ffcc66");
        $("#feedback").text("Couldn't load a word.").css("color", "crimson");
        return;
      }

      $("#word-display").text(currentWord.english).css("color", "");
      $("#answer-input").val("").focus();
      $("#feedback").text("");
    }

    // UI handlers
    $("#btn-start").off("click").on("click", function () {
      $("#start-screen").hide();
      $("#game-content").removeClass("hidden");
      loadWord();
    });

    $("#btn-continue").off("click").on("click", function () {
      // placeholder for saved progress check
      $("#start-screen").hide();
      $("#game-content").removeClass("hidden");
      // you can integrate window.save here to pick saved word/index
      loadWord();
    });

    // Check answer (click)
    $("#check-answer").off("click").on("click", function () {
      if (!currentWord) return;
      const user = $("#answer-input").val().trim().toLowerCase();
      const correct = (currentWord.swedish || "").toLowerCase();

      if (!user) {
        $("#feedback").text("Please type your answer.").css("color", "#ffd97a");
        return;
      }

      if (correct && user === correct) {
        $("#feedback").text("✅ Correct!").css("color", "limegreen");
        setTimeout(loadWord, 1000);
      } else if (!correct) {
        // no reference translation available
        $("#feedback").text("No reference translation available for this word.").css("color", "#ffd97a");
      } else {
        $("#feedback").text("❌ Try again").css("color", "crimson");
      }
    });

    // Submit with Enter key when focus is in input
    $(document).off("keydown.answer").on("keydown.answer", function (e) {
      if (e.key === "Enter" && $("#answer-input").is(":focus")) {
        e.preventDefault();
        $("#check-answer").trigger("click");
      }
    });

    // Back to menu
    $("#btn-back").off("click").on("click", function () {
      $("#game-content").addClass("hidden");
      $("#start-screen").show();
    });

    // Introduction modal handlers
    $("#btn-intro").off("click").on("click", function () {
      $("#intro-modal").removeClass("hidden");
    });
    $("#close-intro").off("click").on("click", function () {
      $("#intro-modal").addClass("hidden");
    });

    // Help
    $("#btn-help").off("click").on("click", function () {
      alert("Help:\n1. Start → begin practice.\n2. Type Swedish translation and press Check Answer.\n3. Correct = auto next word; Back to Menu returns to main screen.\nGood luck!");
    });

    // initial state (menu visible)
    $("#start-screen").show();
    $("#game-content").addClass("hidden");
    $("#intro-modal").addClass("hidden");
  });
});


// 测试按钮功能（在runWhenReady函数内部的最后添加）
$("#check-jquery").off("click").on("click", function () {
  alert("JavaScript and jQuery are working.");
});

$("#check-saving").off("click").on("click", function () {
  var data = window.save.get("team05");
  data.counter = data.counter ?? 0;
  data.counter += 1;
  $("#check-saving").text(`This button has been pressed ${data.counter} times`);
  window.save.set("team05", data);
});

// 显示词汇
$("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

