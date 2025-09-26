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


//// Language toggle buttons////

// Fetches the correct strings from en.json and sv.json
function toggleEnglish() {
  fetch('assets/main_menu/menu_text/en.json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('footer-text').textContent=data.footer
      document.getElementById('back-btn').textContent=data.backbtn
      document.getElementById('about-btn').textContent=data.about
      document.getElementById('settings-btn').textContent=data.settings
    })
  .catch(error => {
      console.error('JSON loading error: ', error);
  });
}

function toggleSwedish() {
  fetch('assets/main_menu/menu_text/sv.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('footer-text').textContent=data.footer
        document.getElementById('back-btn').textContent=data.backbtn
        document.getElementById('about-btn').textContent=data.about
        document.getElementById('settings-btn').textContent=data.settings
      })
  .catch(error => {
      console.error('JSON loading error: ', error);
  });
}