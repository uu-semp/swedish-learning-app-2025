// ==============================================
// Owned by Team 01
// ==============================================

"use strict";

$(function () {

  // constants
  const time_delay = 2000; // 2 seconds delay after every match
  const corrects_needed = 8; // number of correct pairs needed to win
  const misses_max = 10; // number of misses allowed before losing
  // variables
  let corrects = 0;
  let misses = 0;

  let flippedCards = []; // array of currently flipped cards


  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  // Button handlers
  $("#start-game").on("click", function () {
    showScreen("game-screen");
  });

  $("#end-game").on("click", function () {
    resetGame();
    showScreen("end-screen");
  });

  $("#restart-game").on("click", function () {
    showScreen("menu-screen");
  });

  // Initialize on menu screen
  showScreen("menu-screen");

  // Game logic

  function resetFlipState() {  // when no pair is found, card flips back
    flippedCards[0]?.removeClass("flipped");
    flippedCards[1]?.removeClass("flipped");
    flippedCards = [];
  }

  function resetGame() {
    corrects = 0;
    misses = 0;
    resetFlipState();
  }

  function foundMatch() {
    corrects++;
    flippedCards[0].addClass("matched");
    flippedCards[1].addClass("matched");
    alert
    if (corrects >= corrects_needed) {
      alert("Congratulations! You've won the game!");
      resetGame();
      showScreen("end-screen");
    }
    resetFlipState();
  }

  function notMatch() {
    misses++;
    if (misses >= misses_max) {
      alert("Game Over! You've exceeded the maximum number of misses.");
      resetGame();
      showScreen("end-screen");
    }
    resetFlipState();
  }

  $(".card").on("click", clickCard);

  // keep this at the top
  let allowFlipBack = false;
  let isChecking = false;


  function clickCard() {
    const card = this; // store DOM element directly

    if (isChecking) return;

    // Flip back if two cards are already flipped and this card is one of them
    if (allowFlipBack && flippedCards.includes(card)) {
      resetFlipState();
      allowFlipBack = false;
      return;
    }

    // Flip the clicked card
    if (flippedCards.length < 2 && !$(card).hasClass("flipped")) {
      $(card).addClass("flipped");
      flippedCards.push(card);
    }

    // After flipping 2 cards, allow flip back after 0.5s
    if (flippedCards.length === 2 && !allowFlipBack) {
      isChecking = true;
      setTimeout(() => {
        allowFlipBack = true;
        isChecking = false;
      }, 500);
    }
  }

  function resetFlipState() {
    flippedCards.forEach(card => $(card).removeClass("flipped"));
    flippedCards = [];
    allowFlipBack = false;
  }

  // Hint button click
  $("#hint-button").on("click", function () {
    // For now, random text
    $("#hint-text").text("One or two translations here...");
    $("#hint-modal").fadeIn();
  });

  // Close modal when clicking the "x"
  $("#close-hint").on("click", function () {
    $("#hint-modal").fadeOut();
  });

  // Optional: close modal when clicking outside the hint box
  $("#hint-modal").on("click", function (e) {
    if (e.target.id === "hint-modal") {
      $(this).fadeOut();
    }
  });


});
