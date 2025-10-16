"use strict";

$(function () {
  // from URL
  const params = new URLSearchParams(window.location.search);
  const last = params.get("last");

  if (last) {
    window.lastLevelPlayed = last;
    $("#btn-continue").prop("disabled", false).css("opacity", "1");
  } else {
    window.lastLevelPlayed = null;
    $("#btn-continue").prop("disabled", true).css("opacity", "0.5");
  }

  // Start
  $("#btn-start").on("click", function () {
    $("#start-screen").hide();
    $("#levels-menu").removeClass("hidden");
  });

  // Continue
  $("#btn-continue").on("click", function () {
    if (window.lastLevelPlayed) {
      location.href = "main_menu/placeholder_game.html?level=" + window.lastLevelPlayed;
    } else {
      alert("No previous level found. Please start a new game.");
    }
  });

  // Back
  $("#btn-back-to-menu").on("click", function () {
    $("#levels-menu").addClass("hidden");
    $("#start-screen").show();
  });

  // Intro / Help
  $("#btn-intro").on("click", function () {
    alert("About Red Room:\nA simple vocabulary learning game.\nSelect a difficulty to start!");
  });

  $("#btn-help").on("click", function () {
    alert("Help:\nChoose difficulty → level → start playing.\nUse Back to return to main menu.");
  });
});
