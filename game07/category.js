document.getElementById("start-game-button").addEventListener("click", () => {
  const category = document.getElementById("category").value;

  const timerEnabled = document.getElementById("timer-toggle").checked;
  const livesEnabled = document.getElementById("lives-toggle").checked;
  
  game_start(category, timerEnabled, livesEnabled);

  window.location.href = "game-page.html";
});
