"use strict";

$(function () {
  $("#btn-start").on("click", function () {
    $("#start-screen").hide();
    $("#levels-menu").removeClass("hidden");
  });

  $("#btn-back-to-menu").on("click", function () {
    $("#levels-menu").addClass("hidden");
    $("#start-screen").show();
  });

  $("#btn-intro").on("click", function () {
    alert("About Red Room:\nA simple vocabulary learning game.\nSelect a difficulty to start!");
  });

  $("#btn-help").on("click", function () {
    alert("Help:\nChoose difficulty → level → start playing.\nUse Back to return to main menu.");
  });
});
