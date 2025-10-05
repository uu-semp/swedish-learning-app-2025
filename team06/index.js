// ==============================================
// Owned by Team 06
// ==============================================
("use strict");

// ==============================================
// VIEW SWITCHING FUNCTIONS
// ==============================================

// Helper function to hide all views
function hideAllViews() {
  document.querySelectorAll('.view').forEach(view => {
    view.style.display = 'none';
  });
}

// Show Intro View
function showIntro() {
  hideAllViews();
  document.getElementById('intro-view').style.display = 'block';
}

// Show Level Selection View
function showLevelSelection() {
  hideAllViews();
  document.getElementById('level-view').style.display = 'block';
}

// Show Game View
function startGame(level) {
  hideAllViews();
  document.getElementById('game-view').style.display = 'block';
  
  // Initialize game with selected level (to be implemented in game.js)
  if (typeof initializeGame === 'function') {
    initializeGame(level);
  }
}

// Show Finish View
function showFinish() {
  hideAllViews();
  document.getElementById('finish-view').style.display = 'block';
  
  // Display final results (to be implemented in game.js)
  if (typeof displayResults === 'function') {
    displayResults();
  }
}

// Submit Answer (placeholder for backend team to implement)
function submitAnswer() {
  console.log("Submit answer clicked - to be implemented by backend team");
  // TODO: Backend team - implement answer checking logic here
}

// ==============================================
// INITIALIZATION
// ==============================================

$(function () {
  window.vocabulary.when_ready(function () {
    console.log("Team 06 - Tick-Tock Time initialized!");
    
    // Show intro view on load
    showIntro();
    
    // OLD TEST FUNCTIONS (kept for reference)
    $("#check-jquery").on("click", () => {
      alert("JavaScript and jQuery are working.");
    });

    $("#check-saving").on("click", () => {
      var data = window.save.get("team06");
      data.counter = data.counter ?? 0;
      data.counter += 1;
      $("#check-saving").text(
        `This button has been pressed ${data.counter} times`
      );
      window.save.set("team06", data);
    });
  });
});
