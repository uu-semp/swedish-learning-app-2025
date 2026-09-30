// ==============================================
// Owned by Game 02 — main wiring
// ==============================================

"use strict";

import { loadFurniturePairs, buildGrid } from "./js/game-data.js";
import { startTimer, stopTimer, resetTimer, getElapsedTime } from "./js/timer.js";
import { initHints } from "./js/hints.js";

$(function () {
  // constants
  const team_name = "game02"; // Team name for saving data
  const corrects_needed = 8; // number of correct pairs needed to win
  const misses_max = 20; // number of misses allowed before losing
  const numPairs = 8; // number of pairs of cards

  // variables
  let corrects = 0;
  let misses = 0;
  let wins = save.stats.get(team_name).wins; // Load wins from storage
  $("#wins-count").text(wins); // Update the display with the loaded win count

  let flippedCards = []; // array of currently flipped cards
  let allowFlipBack = false;
  let isChecking = false;
  let currentPairs = []; // last loaded round, used for hints

  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  async function mapCards() {
    try {
      currentPairs = await loadFurniturePairs(numPairs);
      buildGrid(currentPairs);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  function resetFlipState() {
    flippedCards.forEach((card) => $(card).removeClass("flipped"));
    flippedCards = [];
    allowFlipBack = false;
  }

  function resetGame() {
    corrects = 0;
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

  function foundMatch() {
    corrects++;
    $("#moves").text(`moves: ${misses + corrects}`);

    if (corrects >= corrects_needed) {
      stopTimer();
      updateEndScreen();
      wins++; // Increment wins
      save.stats.incrementWin(team_name); // Save the new win count
      $("#wins-count").text(wins); // Update wins display
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

    if (mode === "spelling") {
      showScreen("spelling-screen");
    } else {
      await mapCards(mode); // picture, listening and dialect all use the card board
      showScreen("game-screen");
    }

    startTimer((elapsed) => $("#elapsed-time").text(`Time: ${elapsed}s`));
  });

  $("#end-game").on("click", function () {
    stopTimer();
    updateEndScreen();
    resetGame();
    showScreen("end-screen");
  });

  $("#restart-game").on("click", function () {
    resetGame();
    mapCards(); // Load new random cards
    showScreen("menu-screen");
  });

    // Show the info for the clicked game mode
  $(".mode-btn").on("click", function () {
    $(".mode-btn").removeClass("selected");
    $(this).addClass("selected");
    $(".mode-info").hide();
    $("#info-" + $(this).data("mode")).show();
  });

  // Event delegation för dynamiskt skapade kort
  $(document).on("click", ".card", clickCard);

  initHints(() => currentPairs);

  // Initialize on menu screen
  showScreen("menu-screen");

  // Game logic
  mapCards();
});
