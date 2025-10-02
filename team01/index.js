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
  let elapsedTime = 0;
  // timer variables
  let startTime = null;
  let timerInterval = null;

  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  // Button handlers
  $("#start-game").on("click", function () {
    showScreen("game-screen");
    startTimer();
  });

  $("#end-game").on("click", function () {
    resetGame();
    stopTimer();
    showScreen("end-screen");
  });
  // --- Timer Functions ---
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    $("#elapsed-time").text("Time: 0s");
  }

  function updateTimerDisplay() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    $("#elapsed-time").text(`Time: ${elapsedTime}s`);
  }

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
    resetTimer();
  }

  function foundMatch() {
    corrects++;
    flippedCards[0].addClass("matched");
    flippedCards[1].addClass("matched");
    alert
    if (corrects >= corrects_needed) {
      stopTimer();
      // Display stats on end screen
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      alert("Congratulations! You've won the game!");
      $("#end-screen #time").text(`${elapsedTime} seconds`);
      $("#end-screen").html(`
        <p>Total Time: ${elapsedSeconds} seconds</p>
        <p>Total Misses: ${misses}</p>
        <button id="restart-game">Restart</button>
      `);
      resetGame();
      showScreen("end-screen");
    }
    resetFlipState();
  }

  function notMatch() {
    misses++;
    if (misses >= misses_max) {
      stopTimer();
      alert("Game Over! You've exceeded the maximum number of misses.");
      // Display game over screen
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      $("#end-screen").html(`
        <h2>💀 Game Over!</h2>
        <p>Total Time: ${elapsedSeconds} seconds</p>
        <p>Total Misses: ${misses}</p>
        <button id="restart-game">Restart</button>
      `);
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
