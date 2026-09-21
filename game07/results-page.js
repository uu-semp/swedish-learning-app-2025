// ==============================================
// Owned by Game 07
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) return;

  const totalCorrect = state.total;
  const roundsPlayed = state.history.length;

  // Display score
  document.getElementById(
    "total-result"
  ).textContent = `You got ${totalCorrect}/${roundsPlayed} words correct!`;

  // Percentage of correct answers
  const percentage = roundsPlayed
    ? Math.round((totalCorrect / roundsPlayed) * 100)
    : 0;

  // Message to show based on percentage of correct answers
  let message = "";
  if (percentage > 90) {
    message = "Really good!";
  } else if (percentage > 50) {
    message = "Good job!";
  } else {
    message = "Good try!";
  }

  document.getElementById("message").textContent = message;
});

// Try again button — same category, fresh lives and score.
// Note: this page does NOT generate the next round itself, because
// window.vocabulary may not be loaded/ready here. We just reset the
// state and clear currentRoundWords; game07.js generates the first
// round as soon as game-page.html loads.
document.getElementById("tryagain-button").addEventListener("click", () => {
  const state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) {
    window.location.href = "game-page.html";
    return;
  }

  state.ids = state.fullIds.slice();
  state.lives = 3; // keep in sync with STARTING_LIVES in game07.js
  state.round = 0;
  state.total = 0;
  state.history = [];
  state.currentRoundWords = null;

  localStorage.setItem("game_state", JSON.stringify(state));
  window.location.href = "game-page.html";
});

// Try missed words again button — replay only the words gotten wrong this game
document.getElementById("try-missed-words-button").addEventListener("click", () => {
  const state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) return;

  // Collect unique missed words across the whole game (dedupe by Swedish word)
  const missedWords = [];
  const seen = new Set();
  state.history.forEach((entry) => {
    entry.wrong.forEach((word) => {
      if (!seen.has(word.sv)) {
        seen.add(word.sv);
        missedWords.push(word);
      }
    });
  });

  if (!missedWords.length) {
    alert("You didn't miss any words!");
    return;
  }

  // generate_round() (run on game-page.html) needs vocab ids, so pull the id
  // off each missed word. (Assumes each word object carries its own id —
  // adjust the field name below if your vocabulary objects use something
  // other than "id".)
  const missedIds = missedWords.map((word) => word.id);

  const newState = {
    category: state.category,
    fullIds: missedIds,
    ids: missedIds.slice(),
    lives: 3,
    round: 0,
    total: 0,
    history: [],
    currentRoundWords: null, // game07.js generates the first round on load
  };

  localStorage.setItem("game_state", JSON.stringify(newState));
  window.location.href = "game-page.html";
});