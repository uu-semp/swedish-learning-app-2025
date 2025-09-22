// ==============================================
// Owned by Team 02
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {


  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team02");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team02", data);
  });

})});


