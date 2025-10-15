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


// Try missed rounds again button
document.getElementById("try-missed-words-button").addEventListener("click", () => {
  const words = JSON.parse(localStorage.getItem("game_words") || "[]");
  if (!words.length) return;

  const highscore = words[words.length - 2];
  const wrong_words = words[words.length - 1];

  // Calculate how many total rounds there were
  const totalRounds = Object.keys(highscore).length - 1; // exclude "total"

  // Identify which rounds had mistakes
  const missedRounds = [];
  for (let i = 0; i < totalRounds; i++) {
    if (wrong_words[`round${i + 1}`] && wrong_words[`round${i + 1}`].length > 0) {
      missedRounds.push(i);
    }
  }

  if (!missedRounds.length) {
    alert("You didn’t miss any rounds!");
    return;
  }

  // Build a clean new game array with only the missed rounds (4 words each)
  const new_game_words = [];
  missedRounds.forEach((roundIndex) => {
    const start = roundIndex * 4;
    const roundWords = words.slice(start, start + 4);

    // Deep clone to avoid reference issues
    const clonedRound = roundWords.map((word) => ({ ...word }));
    new_game_words.push(...clonedRound);
  });

  // Recalculate the number of rounds
  const newRounds = missedRounds.length;

  // Create fresh highscore tracker
  const new_highscore = {};
  for (let i = 0; i < newRounds; i++) {
    new_highscore[`round${i + 1}`] = 0;
  }
  new_highscore["total"] = 0;

  // Create fresh wrong_words tracker
  const new_wrong_words = {};
  for (let i = 0; i < newRounds; i++) {
    new_wrong_words[`round${i + 1}`] = [];
  }
  new_wrong_words["all"] = [];

  // Append the trackers to the array
  new_game_words.push(new_highscore);
  new_game_words.push(new_wrong_words);

  // Save new structure and restart the game
  localStorage.setItem("game_words", JSON.stringify(new_game_words));
  window.location.href = "game-page.html";
});