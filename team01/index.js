// ==============================================
// Owned by Team 01
// ==============================================

"use strict";

$(function () {

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
    showScreen("end-screen");
  });

  $("#restart-game").on("click", function () {
    showScreen("menu-screen");
  });

  // Initialize on menu screen
  showScreen("menu-screen");
});
