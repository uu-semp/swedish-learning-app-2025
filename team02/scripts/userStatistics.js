document.addEventListener("DOMContentLoaded", () => {
    const TEAM_NAME = "team02";
    const LEVEL_COUNT = 3;

    let percentage = 0;

    for (let i = 1; i <= LEVEL_COUNT; i++) {
        if (window.save.get(TEAM_NAME, `level${i}Passed`) === 1) {
            percentage += 100 / LEVEL_COUNT;
        }
    }

    window.save.stats.setCompletion(TEAM_NAME, Math.round(percentage));
    const stats = window.save.stats.get(TEAM_NAME);

    document.getElementById("wins-count").textContent = stats.wins ?? 0;
    document.getElementById("progress-bar").style.width = (stats.completion ?? 0) + "%";
    document.getElementById("progress-percent").textContent = (stats.completion ?? 0) + "%";
    document.getElementById("words-count").textContent = (window.save.get(TEAM_NAME, "learnedWords") ?? []).length;

    document.getElementById("clear-stats-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all statistics?")) {
            window.save.clear(TEAM_NAME);
            alert("Statistics cleared!");
            location.reload();
        }
    });
});
