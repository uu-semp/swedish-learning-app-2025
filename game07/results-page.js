// ==============================================
// Owned by Game 07
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) return;

  const totalCorrect = state.total || 0;
  const roundsPlayed = (state.history && state.history.length) || 0;

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

  // Cross-session data persistence using save.js
  if (window.save) {
    const currentCategory = state.category || window.save.get("game07", "current_category") || "mixed";
    const catKey = (currentCategory === "all" || currentCategory === "mixed") ? "mixed" : currentCategory;

    // 1. High Score Persistence
    const highscores = window.save.get("game07", "highscores") || {};
    const hasExistingScore = typeof highscores[catKey] === "number";
    const previousBest = hasExistingScore ? highscores[catKey] : null;
    const noticeEl = document.getElementById("highscore-notice");

    if (!hasExistingScore || totalCorrect > previousBest) {
      highscores[catKey] = totalCorrect;
      window.save.set("game07", "highscores", highscores);
      if (noticeEl) {
        noticeEl.textContent = `🏆 High Score for ${currentCategory}: ${totalCorrect}`;
      }
    } else if (noticeEl) {
      noticeEl.textContent = `High Score (${currentCategory}): ${previousBest}`;
    }

    // Update global main menu stats (Issue #172 compliance)
    const currentStats = window.save.stats.get("game07");
    const isWin = percentage >= 80 ? 1 : 0;
    const updatedWins = Math.max(currentStats.wins, currentStats.wins + isWin);
    const updatedCompletion = Math.max(currentStats.completion, percentage);
    window.save.stats.set("game07", updatedWins, updatedCompletion);

    // 2. Missed Words Persistence (Cross-Session)
    const sessionMisses = [];
    if (Array.isArray(state.history)) {
      state.history.forEach((entry) => {
        if (Array.isArray(entry.wrong)) {
          entry.wrong.forEach((w) => {
            if (w) sessionMisses.push(w);
          });
        }
      });
    }

    let persistentMisses = window.save.get("game07", "wrong_words");
    if (!Array.isArray(persistentMisses)) {
      persistentMisses = [];
    }

    // Merge session missed words into persistent storage (avoiding duplicates)
    sessionMisses.forEach((item) => {
      if (!item || (!item.id && !item.sv)) return;
      const alreadySaved = persistentMisses.some(
        (existing) => (item.id && existing.id === item.id) || existing.sv === item.sv
      );
      if (!alreadySaved) {
        persistentMisses.push({
          id: item.id || null,
          sv: item.sv,
          en: item.en,
          article: item.article || "",
          category: item.category || currentCategory,
          img: item.img || "",
          audio: item.audio || ""
        });
      }
    });

    window.save.set("game07", "wrong_words", persistentMisses);

    // Display missed words list if any words were missed in this session
    const missedContainer = document.getElementById("missed-words-container");
    const missedList = document.getElementById("missed-words-list");
    if (missedContainer && missedList && sessionMisses.length > 0) {
      missedList.innerHTML = "";
      // Unique missed words in this session
      const uniqueSessionMisses = sessionMisses.filter((w, i, arr) =>
        arr.findIndex(t => (w.id && t.id === w.id) || t.sv === w.sv) === i
      );

      uniqueSessionMisses.forEach((w) => {
        const li = document.createElement("li");
        const article = w.article ? `${w.article} ` : "";
        li.textContent = `${article}${w.sv} (${w.en})`;
        missedList.appendChild(li);
      });
      missedContainer.style.display = "block";
    }
  }
});

// Try again button — same category, fresh lives and score.
// Note: this page does NOT generate the next round itself, because
// window.vocabulary may not be loaded/ready here. We just reset the
// state and clear currentRoundWords; game-page.js generates the first
// round as soon as game-page.html loads.
document.getElementById("tryagain-button").addEventListener("click", () => {
  const state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) {
    window.location.href = "game-page.html";
    return;
  }

  state.ids = state.fullIds.slice();
  state.lives = 3; // keep in sync with STARTING_LIVES in game-page.js
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
  if (Array.isArray(state.history)) {
    state.history.forEach((entry) => {
      if (Array.isArray(entry.wrong)) {
        entry.wrong.forEach((word) => {
          if (word && word.sv && !seen.has(word.sv)) {
            seen.add(word.sv);
            missedWords.push(word);
          }
        });
      }
    });
  }

  if (!missedWords.length) {
    alert("You didn't miss any words!");
    return;
  }

  // generate_round() (run on game-page.html) needs vocab ids, so pull the id
  // off each missed word.
  const missedIds = missedWords.map((word) => word.id);

  const newState = {
    category: state.category,
    fullIds: missedIds,
    ids: missedIds.slice(),
    lives: 3,
    livesEnabled: state.livesEnabled !== undefined ? state.livesEnabled : true,
    timerEnabled: state.timerEnabled !== undefined ? state.timerEnabled : true,
    round: 0,
    total: 0,
    history: [],
    currentRoundWords: null, // game-page.js generates the first round on load
  };

  localStorage.setItem("game_state", JSON.stringify(newState));
  window.location.href = "game-page.html";
});