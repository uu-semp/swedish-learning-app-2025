// ==============================================
// Owned by Game 07
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

  // Cross-session data persistence using save.js
  if (window.save) {
    const currentCategory = window.save.get("game07", "current_category") || "mixed";
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
        noticeEl.textContent = `🏆 High Score for ${currentCategory}: ${totalCorrect}/${rounds}`;
      }
    } else if (noticeEl) {
      noticeEl.textContent = `High Score (${currentCategory}): ${previousBest}/${rounds}`;
    }

    // Update global main menu stats (Issue #172 compliance)
    const currentStats = window.save.stats.get("game07");
    const isWin = percentage >= 80 ? 1 : 0;
    const updatedWins = Math.max(currentStats.wins, currentStats.wins + isWin);
    const updatedCompletion = Math.max(currentStats.completion, percentage);
    window.save.stats.set("game07", updatedWins, updatedCompletion);

    // 2. Missed Words Persistence (Cross-Session)
    const wrongWordsObj = words[words.length - 1];
    const sessionMisses = (wrongWordsObj && Array.isArray(wrongWordsObj.all)) ? wrongWordsObj.all : [];
    
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