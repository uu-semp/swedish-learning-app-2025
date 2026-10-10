// ==============================================
// Owned by Game 02 — main wiring
// ==============================================

"use strict";

import { loadPairs, buildGrid, initDb } from "./js/game-data.js";
import { startTimer, stopTimer, resetTimer, getElapsedTime } from "./js/timer.js";
import { initHints } from "./js/hints.js";
import { initSpelling } from "./js/spelling.js";

$(function () {
  // constants
  const team_name = "game02"; // Team name for saving data
  const corrects_needed = 8; // number of correct pairs needed to win
  const misses_max = 20; // number of misses allowed before losing
  const numPairs = 8; // number of pairs of cards
  const mode_titles = {
    picture: "Match each picture to its Swedish word",
    spelling: "Type the Swedish word for each picture",
    listening: "Match each sound to its Swedish word",
    dialect: "Match each dialect sound to its Swedish word",
  }; // heading above the board for each mode
  const dialect_categories = ["furniture"];

  // variables
  let corrects = 0;
  let misses = 0;
  let wins = save.stats.get(team_name).wins; // Load wins from storage
  $("#wins-count").text(wins); // Update the display with the loaded win count

  let flippedCards = []; // array of currently flipped cards
  let allowFlipBack = false;
  let isChecking = false;
  let currentPairs = []; // last loaded round, used for hints
  let currentMode = null; // last loaded category ("picture", "spelling", "listening" or "dialect")

  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen, #spelling-screen, #spelling-end-screen").hide();
    $("#" + screenId).show();
  }

  async function mapCards(mode, category, dialect) {
    try {
      currentPairs = await loadPairs(numPairs, category, dialect);
      buildGrid(currentPairs, mode);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  function resetFlipState() {
    flippedCards.forEach((card) => $(card).removeClass("flipped"));
    flippedCards = [];
    allowFlipBack = false;
  }

  function updateProgress() {
    $("#progress-fill").css("width", (corrects / corrects_needed) * 100 + "%");
    $("#progress-text").text(`${corrects} / ${corrects_needed} pairs`);
  }

  function resetGame() {
    corrects = 0;
    updateProgress();
    misses = 0;
    $("#moves").text(`moves: 0`);
    resetFlipState();
    resetTimer(() => $("#elapsed-time").text("Time: 0s"));
  }

  function updateEndScreen() {
    $("#header_endscreen").text(
      corrects >= corrects_needed
        ? "Congratulations! You've won the game!"
        : "Game Over!"
    );
    $("#score").text(corrects + misses);
    $("#time").text(`${getElapsedTime()} seconds`);
  }

  // Create table with stats of the previous 3 games
  function buildPrevGamesTable() {
    let prevGames = save.get(team_name, "memory-stats");
    const table = document.getElementById("prev-games");
    if(prevGames != null) {
      table.replaceChildren(); // Clear previous rows

      prevGames.forEach(game => {
        const row = document.createElement("tr");
        const modeCell = document.createElement("td");
        const timeCell = document.createElement("td");
        const movesCell = document.createElement("td");

        modeCell.textContent = game.mode;
        timeCell.textContent = `${game.time}s`;
        movesCell.textContent = game.moves;
        
        row.appendChild(modeCell);
        row.appendChild(timeCell);
        row.appendChild(movesCell);

        table.prepend(row);
      });
      
      // save the current game stats to local storage
      prevGames = [...prevGames, { time: getElapsedTime(), moves: corrects + misses, mode: currentMode }]
    } else {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.textContent = "No previous games";
      cell.colSpan = 3;
      cell.classList.add("no-previous-games");

      row.appendChild(cell);
      table.appendChild(row);

      prevGames = [{ time: getElapsedTime(), moves: corrects + misses, mode: currentMode }];
    }
    
    if(prevGames.length > 3) {
      prevGames = prevGames.slice(-3); // Keep only the last 3 games
    }
    save.set(team_name, "memory-stats", prevGames);
  }

  function foundMatch() {
    corrects++;
    updateProgress();
    $("#moves").text(`moves: ${misses + corrects}`);

    if (corrects >= corrects_needed) {
      stopTimer();
      updateEndScreen();
      save.stats.incrementWin(team_name); // Save the new win count
      wins = save.stats.get(team_name).wins; // Re-read, spelling can also add wins
      $("#wins-count").text(wins); // Update wins display
      buildPrevGamesTable(); // Update the previous games table
      setTimeout(() => {
        $("#wins-count").text(wins); // Update wins display
        resetGame();
        showScreen("end-screen");
      }, 600);
    }
    resetFlipState();
  }

  function notMatch() {
    misses++;
    $("#moves").text(`moves: ${misses + corrects}`);
    // if (misses >= misses_max) {
    //   stopTimer();
    //   alert("Game Over! You've exceeded the maximum number of moves.");
    //   updateEndScreen();
    //   resetGame();
    //   showScreen("end-screen");
    // }
  }

  function clickCard() {
    const card = this; // store DOM element directly

    if (isChecking) return;
    if ($(card).hasClass("matched")) return; // Ignore matched cards

    // Flip back if two cards are already flipped and this card is one of them
    if (allowFlipBack && flippedCards.length === 2) {
      resetFlipState();
      allowFlipBack = false;
      return;
    }

    // Flip the clicked card
    if (flippedCards.length < 2 && !$(card).hasClass("flipped")) {
      $(card).addClass("flipped");
      flippedCards.push(card);
      // Sound cards play their word when flipped
      if ($(card).data("type") === "sound") {
        new Audio("../" + $(card).data("content")).play();
      }
    }

    // After flipping 2 cards, check for match
    if (flippedCards.length === 2 && !allowFlipBack) {
      isChecking = true;

      const card1 = $(flippedCards[0]);
      const card2 = $(flippedCards[1]);
      const pairId1 = card1.attr("data-pair-id");
      const pairId2 = card2.attr("data-pair-id");

      if (pairId1 === pairId2) {
        // Match found! Mark cards immediately to prevent further clicks
        card1.addClass("matched");
        card2.addClass("matched");

        // Fade out cards after a delay while keeping their space
        setTimeout(() => {
          card1.fadeTo(300, 0);
          card2.fadeTo(300, 0);
          foundMatch();
          isChecking = false;
        }, 1000); // Wait 1 second before fading out
      } else {
        // No match - allow flip back after 0.5s
        setTimeout(() => {
          allowFlipBack = true;
          isChecking = false;
          notMatch();
        }, 500);
      }
    }
  }

  // Button handlers
  $("#start-game").on("click", async function () {
    const mode = $(".mode-btn.selected").data("mode"); // "picture", "spelling", "listening" or "dialect"
    const category = $(".category-btn.selected").data("category"); // "furniture", "clothing" or "food"
    currentMode = mode;
    // The dialect row is hidden in the other modes but keeps its selection, so only use it in Dialect mode
    const dialect = mode === "dialect" ? $(".dialect-btn.selected").data("dialect") : "standard";

    // Spelling has its own screens and logic in spelling.js
    if (mode === "spelling") {
      $(this).prop("disabled", true).text("Loading...");
      await startSpelling(category);
      $(this).prop("disabled", false).text("Start Game");
      return;
    }

    $("#game-title").text(mode_titles[mode]);

    $(this).prop("disabled", true).text("Loading...");
    await mapCards(mode, category, dialect);
    $(this).prop("disabled", false).text("Start Game");
    resetGame();

    showScreen("game-screen");
    startTimer((elapsed) => $("#elapsed-time").text(`Time: ${elapsed}s`));
  });

  $("#end-game").on("click", function () {
    stopTimer();
    resetGame();
    showScreen("menu-screen");
  });

  $("#restart-game").on("click", function () {
    $("#start-game").trigger("click");
  });

  $("#go-to-menu").on("click", function () {
    resetGame();
    showScreen("menu-screen");
  });

  $("#help-button").on("click", function () {
    $("#help-modal").fadeIn();
  });

  $("#close-help").on("click", function () {
    $("#help-modal").fadeOut();
  });

  $("#help-modal").on("click", function (event) {
    if (event.target === this) {
      $(this).fadeOut();
    }
  });

    // Show the info for the clicked game mode
  $(".mode-btn").on("click", function () {
    $(".mode-btn").removeClass("selected");
    $(this).addClass("selected");
    $(".mode-info").hide();
    $("#info-" + $(this).data("mode")).show();
    $("#dialect-buttons").toggle($(this).data("mode") === "dialect");
  });

  $(".dialect-btn").on("click", function () {
    $(".dialect-btn").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".category-btn").on("click", function () {
    $(".category-btn").removeClass("selected");
    $(this).addClass("selected");

    // Grey out the dialects that have no recordings for this category (Standard Swedish always works)
    const hasDialects = dialect_categories.includes($(this).data("category"));
    $(".dialect-btn").not('[data-dialect="standard"]').prop("disabled", !hasDialects);
    if (!hasDialects) {
      $(".dialect-btn").removeClass("selected");
      $('.dialect-btn[data-dialect="standard"]').addClass("selected");
    }
  });

  // Event delegation för dynamiskt skapade kort
  $(document).on("click", ".card", clickCard);

  initHints(() => currentPairs);
  const { startGame: startSpelling } = initSpelling({ showScreen });

  // Initialize on menu screen
  showScreen("menu-screen");
  // Start downloading the word list while the player reads the menu
  initDb();
});
