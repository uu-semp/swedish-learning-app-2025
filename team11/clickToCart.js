/*
=================================================
Team 11 - Click-to-Cart Logic
Role: Handle word selection + image matching (click only)
=================================================
*/

"use strict";

let selectedWord = null;

// --- Handle shopping list word clicks ---
// When the player clicks a word, store it for matching
$(document).on("click", ".shopping-word", function () {
  selectedWord = $(this).data("match"); // e.g., "apple"
  console.log("Word selected:", selectedWord);
});

// --- Handle shelf item clicks ---
// When the player clicks an image, check if it matches the selected word
$(document).on("click", ".shelf-item", function () {
  if (!selectedWord) {
    console.log("No word selected yet.");
    return;
  }

  const item = $(this).data("name"); // e.g., "apple"

  if (item === selectedWord) {
    console.log("Correct match:", item);

    // Add the item visually to the cart (clone + resize)
    const cart = $("#cart-dropzone");
    const img = $(this).clone().removeClass("shelf-item").addClass("cart-item");
    img.css({ width: "50px", margin: "5px" }); // smaller size for cart
    cart.append(img);

    // Reset the selected word so the next one can be chosen
    selectedWord = null;

    // Notify feedback system (handled by teammates)
    window.postMessage({ type: "demoCorrect" }, "*");
  } else {
    console.log("Wrong match:", item);

    // Notify feedback system (handled by teammates)
    window.postMessage({ type: "demoWrong" }, "*");
  }
});
