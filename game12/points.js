 // Read completion flag set by the game
const game12_data = save.get("game12");
console.log(game12_data)
const el = document.getElementById("lvl1");
if (game12_data.stage_completed_1) {
    el.textContent = "🏆 You have completed level 1!";
    el.classList.add("ok");
} else {
    el.textContent = "❌ You have not completed level 1 yet.";
    el.classList.add("no");
}