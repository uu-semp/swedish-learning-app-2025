// ==============================================
// Owned by Team 07
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const words = JSON.parse(localStorage.getItem("game_words") || "[]");
  if (!words.length) return;

  const highscore = words[words.length - 2]; // fix here
  const rounds = Object.keys(highscore).length - 1;
  const totalCorrect = highscore.total;

  // Display score
  document.getElementById(
    "total-result"
  ).textContent = `You got ${totalCorrect}/${rounds} words correct!`;

  // Percentage of correct answers
  const percentage = Math.round((totalCorrect / rounds) * 100);

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

// Try again button
document.getElementById("tryagain-button").addEventListener("click", () => {
  // Words from the previous round
  let words = JSON.parse(localStorage.getItem("game_words") || "[]");

  if (words.length) {
    let highscore = words[words.length - 2];

    // Reset highscore
    for (let key in highscore) {
      highscore[key] = 0;
    }
    words[words.length - 2] = highscore;
    localStorage.setItem("game_words", JSON.stringify(words));
  }

  // Back to game page
  window.location.href = "game-page.html";
});
