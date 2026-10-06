// ==============================================
// Owned by Game 02 — spelling game wiring
// ==============================================

"use strict";

import { loadSpellingWords } from "./js/spelling-data.js";
import { diffWord } from "./js/spelling-diff.js";
import { initUmlautButtons } from "./js/umlaut-buttons.js";
import { startTimer, stopTimer, resetTimer, getElapsedTime } from "./js/timer.js";

export function init() {
  // constants
  const team_name = "game02"; // Same stats key as the memory game
  const words_per_round = 8;
  const success_delay = 1000; // ms before moving on after a correct answer
  const reveal_delay = 2000; // ms before moving on after "Show answer"

  // variables
  let words = [];
  let index = 0;
  let misses = 0;
  let spelled = 0; // words the player got right
  let locked = true; // true while the input is not accepting answers
  let wins = save.stats.get(team_name).wins;
  let nextTimeout = null;

  const input = $("#answer-input")[0];
  $("#wins-count").text(wins);

  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  function clearNext() {
    clearTimeout(nextTimeout);
    nextTimeout = null;
  }

  function letterHint(word) {
    return Array.from(word)
      .map((ch) => (ch === " " ? " " : "_"))
      .join(" ");
  }

  function renderWord() {
    const word = words[index];
    $("#progress").text(`Word ${index + 1} / ${words.length}`);
    $("#word-image").attr("src", word.img);
    $("#letter-hint").text(letterHint(word.sv));
    $("#feedback").removeClass("success revealed").empty();
    $("#answer-input").removeClass("shake correct").val("");
    locked = false;
    input.focus();
  }

  function renderParts(parts) {
    const $feedback = $("#feedback").removeClass("success revealed").empty();
    parts.forEach((part) => {
      $("<span>").addClass(part.status).text(part.ch).appendTo($feedback);
    });
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
    const typed = $("#answer-input").val();
    if (locked || !typed.trim()) return;

    const word = words[index];
    const result = diffWord(typed, word.sv);

    if (result.correct) {
      spelled++;
      $("#answer-input").addClass("correct");
      $("#feedback").removeClass("revealed").addClass("success").text(`✓ ${word.sv}`);
      advance(success_delay);
      return;
    }

    misses++;
    $("#misses").text(`misses: ${misses}`);
    renderParts(result.parts);
    // restart the shake animation on repeated misses
    $("#answer-input").removeClass("shake");
    void input.offsetWidth;
    $("#answer-input").addClass("shake");
  }

  function showAnswer() {
    if (locked) return;
    $("#feedback").removeClass("success").addClass("revealed").text(words[index].sv);
    advance(reveal_delay);
  }

  function finishGame(won) {
    clearNext();
    locked = true;
    stopTimer();

    $("#header_endscreen").text(
      won ? "Congratulations! You've won the game!" : "Game Over!"
    );
    $("#score").text(`${spelled} / ${words.length}`);
    $("#end-misses").text(misses);
    $("#time").text(`${getElapsedTime()} seconds`);

    if (won) {
      wins++;
      save.stats.incrementWin(team_name);
    }
    $("#wins-count").text(wins);
    showScreen("end-screen");
  }

  function resetGame() {
    clearNext();
    index = 0;
    misses = 0;
    spelled = 0;
    $("#misses").text("misses: 0");
    resetTimer(() => $("#elapsed-time").text("Time: 0s"));
  }

  async function startGame() {
    resetGame();
    words = await loadSpellingWords(words_per_round);
    if (words.length === 0) {
      alert("Could not load any words. Please try again later.");
      return;
    }
    showScreen("game-screen");
    renderWord();
    startTimer((elapsed) => $("#elapsed-time").text(`Time: ${elapsed}s`));
  }

  // Button handlers
  $("#start-game").on("click", startGame);

  $("#answer-form").on("submit", (e) => {
    e.preventDefault();
    submitAnswer();
  });

  $("#show-answer").on("click", showAnswer);

  $("#end-game").on("click", () => finishGame(false));

  $("#restart-game").on("click", () => {
    resetGame();
    showScreen("menu-screen");
  });

  // Fall back to alt text if an image fails to load
  $("#word-image").on("error", function () {
    $(this).attr("alt", "Image could not be loaded");
  });

  initUmlautButtons(input);
  showScreen("menu-screen");
}
