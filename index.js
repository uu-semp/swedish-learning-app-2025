// ==============================================
// Owned by the Menu Team
// ==============================================

"use strict";

// Elements
const frame = document.getElementById("game-frame");
const menu = document.getElementById("game-menu");
const stage = document.getElementById("game-stage");
const backBtn = document.getElementById("back-btn");


//// Navigation ////
// Open game in iframe
function openIframe(src) {
  frame.src = src;
  menu.hidden = true;
  stage.hidden = false;
}

// Back to menu
backBtn.addEventListener("click", () => {
  frame.src = ""; // Stop the game
  stage.hidden = true;
  menu.hidden = false;
});


//// Language toggle ////
 
function toggleEnglish() {
  let footer = document.getElementById("footer-text")
  footer.innerHTML = "Created as part of the 'Software Engineering and Project Management' course 2025"
}

function toggleSwedish() {
  let footer = document.getElementById("footer-text")
  footer.innerHTML = "Skapad som en del av kursen 'Metoder och projektledning för mjukvaruutveckling' år 2025"
}