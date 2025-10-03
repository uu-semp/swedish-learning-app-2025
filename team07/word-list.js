// ==============================================
// Owned by Team 07
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  window.vocabulary.when_ready(function () {

    const list = document.getElementById("list");

    // Get all the words from the vocabulary
    const clothing = window.vocabulary.get_category("clothing");
    const food = window.vocabulary.get_category("food");
    const furniture = window.vocabulary.get_category("furniture");
    var ids = clothing.concat(food, furniture);

    

    // Loop through all the words and create a new paragraph for each word
    for (let i = 0; i < ids.length; i++) {
        const word = window.vocabulary.get_vocab(ids[i]);
        const new_paragraph = document.createElement("p");
        new_paragraph.className = "paragraph";
        new_paragraph.innerHTML = word.en + " = " + word.sv;
        list.appendChild(new_paragraph);
    }

  });
});