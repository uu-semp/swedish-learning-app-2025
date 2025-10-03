// ==============================================
// Owned by Team 02
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    // Navigation logic (example: go to level pages)
    document.getElementById("button1").addEventListener("click", () => {
        window.location.href = "level1.html";
    });

    document.getElementById("button2").addEventListener("click", () => {
        window.location.href = "level2.html";
    });

    document.getElementById("button3").addEventListener("click", () => {
        window.location.href = "level3.html";
    })
});