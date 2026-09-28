// ==============================================
// Owned by Game 13
// ==============================================

"use strict";

// ==============================================
/**
 * Entry point for Game 13.
 *
 * Coordinates the main game components by initializing the outfit
 * description generator and loading the available clothing items.
 *
 * Gamespecific logic is now moved to the clothing and outfit
 * components rather than being implemented directly in this file.
 */
import { loadClothes } from "./game/clothing/clothing_placer.js";
import { SwedishClothingDescriptionGenerator } from "./game/outfit_generator.js";



// Description generator class global instance
window.clothingGenerator = new SwedishClothingDescriptionGenerator(); 

/**
 * Generates the current outfit and displays its Swedish description.
 *
 * The generated outfit is also stored globally so that other game
 * components can use it when checking the player's selection.
 */
function fetchDescription() {
    const gen = window.clothingGenerator;
    if (!gen) return;

    gen.loadPromise.then(() => {
        const outfit = gen.generateOutfit();
        if (!outfit) return; // safety

        const el = document.getElementById("instruction-text");
        if (el) el.textContent = outfit.swedish;

        window.currentOutfit = outfit;
        console.log("Current outfit")
        console.log(outfit.items);
    });
}

/**
 * Initializes the game once the page has loaded.
 *
 * Verifies that the vocabulary API is available before starting
 * the outfit generation and clothing loading processes.
 */
window.addEventListener("DOMContentLoaded", () => {
    if (window.vocabulary && typeof window.vocabulary.load_game_data === "function") {
        fetchDescription();
        loadClothes();
    } else {
        console.log("API Unavailable")
    }
});
