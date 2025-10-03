// ==============================================
// Owned by Team 09
// ==============================================

"use strict";
//when vocabulary is ready;This function is making sure the data has loaded
//$(function() {window.vocabulary.when_ready(function () {

$(function() {

  // These are only dummy functions and can be removed.

  $("#back-btn").on("click", () => { window.location.href = "../mainPageView/mainPage.html"; });
  
  $("#level1-btn").on("click", () => { window.location.href = "level1.html"; });
  $("#level2-btn").on("click", () => { window.location.href = "level2.html"; });
  $("#level3-btn").on("click", () => { window.location.href = "level3.html"; });
  $("#level4-btn").on("click", () => { window.location.href = "level4.html"; });
  $("#level5-btn").on("click", () => { window.location.href = "level5.html"; });
  $("#level6-btn").on("click", () => { window.location.href = "level6.html"; });

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