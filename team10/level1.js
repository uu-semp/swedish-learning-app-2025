// ==============================================
// Owned by Team 10
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {

  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team10");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team10", data);
  });

})});

function get_instruction(button) {
    button.onclick = function() {
        const p = document.createElement("p");
        p.textContent = "Add the instructions of the game here, they're to be displayed if the user needs them";
        button.after(p);
    };
}


function get_image_src() {
  // Function that fincs the src of an image, such that it can be used in the HTML file.
}