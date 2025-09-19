// ==============================================
// Owned by the Menu Team
// ==============================================

"use strict";

// TODO: Remove this test code
$(function() {
    $("#check-jquery").on("click", () => {
        alert("JavaScript and jQuery are working.");
    });
});

// Elements
const menu = document.getElementById("game-menu");
const stage = document.getElementById("game-stage");


//// Navigation ////
// Open game in iframe
function openIframe(src) {
  frame.src = src;
  menu.hidden = true;
  stage.hidden = false;
}

// Back to menu
backBtn.addEventListener("click", () => {
  frame.src = "about:blank"; // Stop the game
  stage.hidden = true;
  menu.hidden = false;
});
