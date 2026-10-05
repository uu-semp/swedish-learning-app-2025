const progress = window.save.get("game12")

for (let difficulty = 1; difficulty <= 3; difficulty++) {
    const button = document.getElementById("lvl" + difficulty)
    const completed = progress["stage_completed_" + difficulty]

    if (completed) {
        button.classList.add("completed")
    }
}