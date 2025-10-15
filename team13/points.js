 // Read completion flag set by the game
const team13_data = save.get("team13");
console.log(team13_data)
const el = document.getElementById("lvl1");
if (team13_data.stage_completed_1) {
    el.textContent = "🏆 You have completed level 1!";
    el.classList.add("ok");
} else {
    el.textContent = "❌ You have not completed level 1 yet.";
    el.classList.add("no");
}