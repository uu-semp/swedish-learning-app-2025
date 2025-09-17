// ==============================================
// Owned by the Menu Team
// ==============================================

"use strict";

$(function() {
    $("#check-jquery").on("click", () => {
        alert("JavaScript and jQuery are working.");
    });
});

function openIframe(gameUrl) {
    const gameDisplay = document.querySelector(".game-display");
    const iframe = gameDisplay.querySelector("iframe");

    if (gameUrl) {
        iframe.src = gameUrl;
    }

    // gameDisplay.style.display is by default set to none i.e it is invisable.
    gameDisplay.style.display = "block";
}