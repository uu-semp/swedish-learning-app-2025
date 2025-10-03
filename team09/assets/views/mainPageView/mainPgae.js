// ==============================================
// Owned by Team 09
// ==============================================

"use strict";
//when vocabulary is ready;This function is making sure the data has loaded
//$(function() {window.vocabulary.when_ready(function () {

$(function() {

  // These are only dummy functions and can be removed.

  
  $("#start-btn").on("click", () => { window.location.href = "../levelSelectView/levelSelect.html"; });
  $("#info-btn").on("click", () => { window.location.href = "information.html"; });
  $("#dict-btn").on("click", () => { window.location.href = "dictionary.html"; });


  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team09");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team09", data);
});
  //})})

});