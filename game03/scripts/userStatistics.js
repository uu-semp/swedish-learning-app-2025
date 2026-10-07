document.addEventListener("DOMContentLoaded", () => {
    const TEAM_NAME = "game03";

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
