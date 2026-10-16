// ==============================================
// Owned by Game 07
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {

  function saveSettings() {
    const settings = {
      timerEnabled: document.getElementById("timer-toggle").checked,
      livesEnabled: document.getElementById("lives-toggle").checked
    };
    localStorage.setItem("game_settings", JSON.stringify(settings));
  }

  // Save on toggle change
  document.getElementById("timer-toggle").addEventListener("change", saveSettings);
  document.getElementById("lives-toggle").addEventListener("change", saveSettings);

  // Load existing settings on page load
  const existingSettings = JSON.parse(localStorage.getItem("game_settings") || "{}");
  if (existingSettings.timerEnabled !== undefined) {
    document.getElementById("timer-toggle").checked = existingSettings.timerEnabled;
  }
  if (existingSettings.livesEnabled !== undefined) {
    document.getElementById("lives-toggle").checked = existingSettings.livesEnabled;
  }
  

})});


