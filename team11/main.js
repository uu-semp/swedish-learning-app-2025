import { initGameState } from "./state.js";

let gameState = {};

$(function() {
    console.log("main.js körs");
    gameState = initGameState();
    console.log("What in the world its working!")
})