// ==============================================
// Owned by Team 02
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    document.getElementById("button1").addEventListener("click", () => {
        window.location.href = "level.html?level=1";
    });

    document.getElementById("button2").addEventListener("click", () => {
        window.location.href = "level.html?level=2";
    });

    document.getElementById("button3").addEventListener("click", () => {
        window.location.href = "level.html?level=3";
    });
});
