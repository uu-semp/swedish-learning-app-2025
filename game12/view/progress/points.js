const progress = window.save.get("game12")

for (let difficulty = 1; difficulty <= 3; difficulty++) {
    const label = document.getElementById("lvl" + difficulty)
    const completed = progress["stage_completed_" + difficulty]

    if (completed) {
        label.textContent = "✓ Klar"
        label.classList.add("ok")
    } else {
        label.textContent = "Inte klar ännu"
        label.classList.add("no")
    }
}