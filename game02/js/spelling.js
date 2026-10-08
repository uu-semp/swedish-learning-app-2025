// ==============================================
// Owned by Game 02 — spelling game (runs inside index.html)
// ==============================================

"use strict";

import { loadSpellingWords } from "./spelling-data.js";
import { diffWord, hintWord } from "./spelling-diff.js";
import { initUmlautButtons } from "./umlaut-buttons.js";
import { startTimer, stopTimer, resetTimer, getElapsedTime } from "./timer.js";

export function initSpelling({ showScreen }) {
  // constants
  const team_name = "game02"; // Same stats key as the memory game
  const words_per_round = 8;
  const success_delay = 1000; // ms before moving on after a correct answer
  const reveal_delay = 2000; // ms before moving on after "Show answer"

  // variables
  let words = [];
  let index = 0;
  let misses = 0;
  let hints = 0; // times the hint button was used
  let spelled = 0; // words the player got right
  let locked = true; // true while the input is not accepting answers
  let nextTimeout = null;

  let category = undefined;

  const input = $("#spelling-input")[0];
  function clearNext() {
    clearTimeout(nextTimeout);
    nextTimeout = null;
  }

  // Bar shows how many words are done (spelled or revealed)
  function updateProgress(done) {
    $("#spelling-progress-fill").css("width", (done / words.length) * 100 + "%");
    $("#spelling-progress-text").text(`${done} / ${words.length} words`);
  }

  function renderSlots(parts) {
    const $slots = $("#spelling-slots").empty();
    parts.forEach((part) => {
      $("<span>").addClass(`slot ${part.status}`).text(part.ch).appendTo($slots);
    });
  }

  // Fills the slot row with what has been typed, padded with "_" up to the word length
  function renderTyped() {
    const typed = Array.from($("#spelling-input").val());
    const slots = Array.from(words[index].sv).map((ch, i) =>
      i < typed.length
        ? { ch: typed[i], status: "typed" }
        : { ch: ch === " " ? " " : "_", status: "empty" }
    );
    typed.slice(slots.length).forEach((ch) => slots.push({ ch, status: "typed" }));
    renderSlots(slots);
  }

  function renderWord() {
    const word = words[index];
    updateProgress(index);
    $("#spelling-image").attr("src", word.img);
    $("#spelling-feedback").removeClass("success revealed").empty();
    $("#spelling-input").removeClass("shake correct").val("");
    renderTyped();
    locked = false;
    input.focus();
  }

  function renderParts(parts) {
    $("#spelling-feedback").removeClass("success revealed").empty();
    renderSlots(parts);
  }

  function advance(delay) {
    locked = true;
    clearNext();
    nextTimeout = setTimeout(() => {
      index++;
      if (index >= words.length) {
        finishGame(true);
      } else {
        renderWord();
      }
    }, delay);
  }

  function submitAnswer() {
    const typed = $("#spelling-input").val();
    if (locked || !typed.trim()) return;

    const word = words[index];
    const result = diffWord(typed, word.sv);

    if (result.correct) {
      spelled++;
      updateProgress(index + 1);
      $("#spelling-input").addClass("correct");
      renderParts(result.parts);
      $("#spelling-feedback").addClass("success").text("✓ Correct!");
      advance(success_delay);
      return;
    }

    misses++;
    $("#spelling-misses").text(`misses: ${misses}`);
    renderParts(result.parts);
    // restart the shake animation on repeated misses
    $("#spelling-input").removeClass("shake");
    void input.offsetWidth;
    $("#spelling-input").addClass("shake");
  }

  function giveHint() {
    if (locked) return;
    hints++;
    $("#spelling-hints").text(`hints: ${hints}`);
    $("#spelling-input").val(hintWord($("#spelling-input").val(), words[index].sv));
    input.focus();
    // show the result of a check, but a hint is not a miss
    const result = diffWord($("#spelling-input").val(), words[index].sv);
    if (result.correct) submitAnswer();
    else renderParts(result.parts);
  }

  function showAnswer() {
    if (locked) return;
    updateProgress(index + 1);
    misses++;
    $("#spelling-misses").text(`misses: ${misses}`);
    $("#spelling-feedback").removeClass("success revealed").empty();
    renderSlots(Array.from(words[index].sv).map((ch) => ({ ch, status: "revealed" })));
    advance(reveal_delay);
  }

  function finishGame(won) {
    clearNext();
    locked = true;
    stopTimer();

    $("#spelling-end-header").text(
      won ? "Congratulations! You've won the game!" : "Game Over!"
    );
    $("#spelling-score").text(`${spelled} / ${words.length}`);
    $("#spelling-end-misses").text(misses);
    $("#spelling-end-hints").text(hints);
    $("#spelling-end-time").text(`${getElapsedTime()} seconds`);

    if (won) save.stats.incrementWin(team_name);
    $("#spelling-wins").text(save.stats.get(team_name).wins);
    showScreen("spelling-end-screen");
  }

  function resetGame() {
    clearNext();
    index = 0;
    misses = 0;
    hints = 0;
    spelled = 0;
    $("#spelling-misses").text("misses: 0");
    $("#spelling-hints").text("hints: 0");
    resetTimer(() => $("#spelling-time").text("Time: 0s"));
  }

  async function startGame(newCategory) {
    category = newCategory;
    resetGame();
    words = await loadSpellingWords(words_per_round, category);
    if (words.length === 0) {
      alert("Could not load any words. Please try again later.");
      return;
    }
    showScreen("spelling-screen");
    renderWord();
    startTimer((elapsed) => $("#spelling-time").text(`Time: ${elapsed}s`));
  }

  // Button handlers
  $("#spelling-form").on("submit", (e) => {
    e.preventDefault();
    submitAnswer();
  });

  $("#spelling-input").on("input", () => {
    if (!locked) renderTyped();
  });

  $("#spelling-hint").on("click", giveHint);

  $("#spelling-show-answer").on("click", showAnswer);

  $("#spelling-quit").on("click", () => finishGame(false));

  $("#spelling-restart").on("click", () => startGame(category));

  $("#spelling-go-to-menu").on("click", () => {
    resetGame();
    showScreen("menu-screen");
  });

  $("#spelling-help").on("click", () => $("#spelling-help-modal").fadeIn());
  $("#spelling-close-help").on("click", () => $("#spelling-help-modal").fadeOut());
  $("#spelling-help-modal").on("click", function (event) {
    if (event.target === this) $(this).fadeOut();
  });

  // Fall back to alt text if an image fails to load
  $("#spelling-image").on("error", function () {
    $(this).attr("alt", "Image could not be loaded");
  });

  initUmlautButtons(input);

  return { startGame };
}
