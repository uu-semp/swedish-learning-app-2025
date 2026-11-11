// ==============================================
// Owned by Game 02 — hint modal
// ==============================================

"use strict";

// getCurrentPairs is a function so hints.js always sees the latest round's pairs
export function initHints(getCurrentPairs) {
  $("#hint-button").on("click", function () {
    const flippedTextCards = $(".card.flipped").filter(function () {
      return $(this).data("type") === "description";
    });

    if (flippedTextCards.length === 0) {
      $("#hint-text").text(
        "No text cards are flipped! Flip a card with text to get help."
      );
    } else {
      let hints = [];
      const currentPairs = getCurrentPairs();

      flippedTextCards.each(function () {
        const swedishWord = $(this).data("content");
        const match = currentPairs.find((p) => p.swedish === swedishWord);
        if (match) {
          hints.push(`${swedishWord} → ${match.english}`);
        } else {
          hints.push(`${swedishWord} → (no match found)`);
        }
      });

      $("#hint-text").html(hints.join("<br>"));
    }

    $("#hint-modal").fadeIn();
  });

  // Close modal when clicking the "x"
  $("#close-hint").on("click", function () {
    $("#hint-modal").fadeOut();
  });

  // Optional: close modal when clicking outside the hint box
  $("#hint-modal").on("click", function (e) {
    if (e.target.id === "hint-modal") {
      $(this).fadeOut();
    }
  });
}

export function initLicenses(getWords) {
  $("#licenses-button").on("click", function () {
    const currentWords = getWords();
    
    const list = document.getElementById("licenses-list");
    list.replaceChildren();

    console.log("Building license modal with words:", currentWords);

    currentWords.forEach(word => {
      const entry = document.createElement("div");
      entry.className = "license-entry";

      const title = document.createElement("h4");
      title.textContent = word.english;

      const license = document.createElement("p");
      license.innerHTML = word.license;

      entry.append(title, license);
      list.appendChild(entry);
    });
  });
}

export function initSpellingLicenses(getWords) {
  $("#spelling-licenses-button").on("click", function () {
    
    const list = document.getElementById("spelling-licenses-list");
    list.replaceChildren();

    const words = getWords();

    words.forEach(word => {
      const entry = document.createElement("div");
      entry.className = "license-entry";

      const title = document.createElement("h4");
      title.textContent = word.english;

      const license = document.createElement("p");
      license.innerHTML = word.license;

      entry.append(title, license);
      list.appendChild(entry);
    });
  });
} 