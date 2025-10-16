// ==============================================
// Owned by Team 01
// ==============================================

"use strict";

$(function () {
  // constants
  const team_name = "team01"; // Team name for saving data
  const time_delay = 2000; // 2 seconds delay after every match
  const corrects_needed = 8; // number of correct pairs needed to win
  const misses_max = 20; // number of misses allowed before losing

  // variables
  let corrects = 0;
  let misses = 0;
  let wins = save.stats.get(team_name).wins; // Load wins from storage
  $("#wins-count").text(wins); // Update the display with the loaded win count

  let flippedCards = []; // array of currently flipped cards
  let elapsedTime = 0;
  // timer variables
  let startTime = null;
  let timerInterval = null;

  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  // Button handlers
  $("#start-game").on("click", function () {
    showScreen("game-screen");
    startTimer();
  });

  $("#end-game").on("click", function () {
    stopTimer();
    updateEndScreen();
    resetGame();
    showScreen("end-screen");
  });
  // --- Timer Functions ---
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    $("#elapsed-time").text("Time: 0s");
  }

  function updateTimerDisplay() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    $("#elapsed-time").text(`Time: ${elapsedTime}s`);
  }

  $("#restart-game").on("click", function () {
    resetGame();
    mapCards(); // Load new random cards
    showScreen("menu-screen");
  });

  // Initialize on menu screen
  showScreen("menu-screen");

  // Game logic
  mapCards();

  function resetFlipState() {
    // when no pair is found, card flips back
    flippedCards[0]?.removeClass("flipped");
    flippedCards[1]?.removeClass("flipped");
    flippedCards = [];
  }

  function resetGame() {
    corrects = 0;
    misses = 0;
    $("#moves").text(`moves: 0`);
    resetFlipState();
    resetTimer();
  }
  function updateEndScreen() {
    $("#header_endscreen").text(
      corrects >= corrects_needed
        ? "Congratulations! You've won the game!"
        : "Game Over!"
    );
    $("#score").text(corrects);
    $("#time").text(`${elapsedTime} seconds`);
  }
  function foundMatch() {
    corrects++;
    $("#moves").text(`moves: ${misses + corrects}`);

    if (corrects >= corrects_needed) {
      stopTimer();
      updateEndScreen();
      wins++; // Increment wins
      save.stats.incrementWin(team_name); // Save the new win count
      $("#wins-count").text(wins); // Update wins display
      setTimeout(() => {
        $("#wins-count").text(wins); // Update wins display
        resetGame();
        showScreen("end-screen");
      }, 600);
    }
    resetFlipState();
  }

  function notMatch() {
    misses++;
    $("#moves").text(`moves: ${misses + corrects}`);
    // if (misses >= misses_max) {
    //   stopTimer();
    //   alert("Game Over! You've exceeded the maximum number of moves.");
    //   updateEndScreen();
    //   resetGame();
    //   showScreen("end-screen");
    // }
  }

  // Event delegation för dynamiskt skapade kort
  $(document).on("click", ".card", clickCard);

  // keep this at the top
  let allowFlipBack = false;
  let isChecking = false;

  function clickCard() {
    const card = this; // store DOM element directly

    if (isChecking) return;
    if ($(card).hasClass("matched")) return; // Ignore matched cards

    // Flip back if two cards are already flipped and this card is one of them
    if (allowFlipBack && flippedCards.length === 2) {
      resetFlipState();
      allowFlipBack = false;
      return;
    }

    // Flip the clicked card
    if (flippedCards.length < 2 && !$(card).hasClass("flipped")) {
      $(card).addClass("flipped");
      flippedCards.push(card);
    }

    // After flipping 2 cards, check for match
    if (flippedCards.length === 2 && !allowFlipBack) {
      isChecking = true;

      const card1 = $(flippedCards[0]);
      const card2 = $(flippedCards[1]);
      const pairId1 = card1.attr("data-pair-id");
      const pairId2 = card2.attr("data-pair-id");

      if (pairId1 === pairId2) {
        // Match found! Mark cards immediately to prevent further clicks
        card1.addClass("matched");
        card2.addClass("matched");

        // Fade out cards after a delay while keeping their space
        setTimeout(() => {
          card1.fadeTo(300, 0);
          card2.fadeTo(300, 0);
          foundMatch();
          isChecking = false;
        }, 1000); // Wait 1 second before fading out
      } else {
        // No match - allow flip back after 0.5s
        setTimeout(() => {
          allowFlipBack = true;
          isChecking = false;
          notMatch();
        }, 500);
      }
    }
  }

  function resetFlipState() {
    flippedCards.forEach((card) => $(card).removeClass("flipped"));
    flippedCards = [];
    allowFlipBack = false;
  }

  // Hint button click
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
});

function getRandomPairs(data, numPairs) {
  console.log(data);
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPairs);
}

function prepareGridItems(pairs) {
  const cards = [];

  pairs.forEach((pair, index) => {
    const id = `pair-${index}`;
    cards.push({ id, type: "description", content: pair.swedish });
    cards.push({ id, type: "image", content: pair.image_url });
  });

  // Shuffle the final cards
  return cards.sort(() => 0.5 - Math.random());
}

function renderGrid(cards) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Rensa befintliga kort

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.setAttribute("data-index", index + 1);
    cardElement.setAttribute("data-content", card.content);
    cardElement.setAttribute("data-type", card.type);
    cardElement.setAttribute("data-pair-id", card.id);

    // Bestäm innehållet för baksidan baserat på typ
    let backContent;
    if (card.type === "image") {
      // Fixa bildvägen - lägg till ../ för att gå upp en mapp
      const imagePath = card.content.startsWith("assets/")
        ? "../" + card.content
        : card.content;
      backContent = `<img src="${imagePath}" alt="Furniture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
    } else {
      backContent = card.content;
    }

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">${index + 1}</div>
        <div class="card-face card-back">${backContent}</div>
      </div>
    `;

    gameBoard.appendChild(cardElement);
  });
}

// Keep reference to the loaded card data for hints
let currentPairs = [];
let numPairs = 8; // number of pairs of cards

// Modify mapCards() slightly to store the fetched pairs
function mapCards() {
  fetch("../words.csv")
    .then((response) => response.text())
    .then((csv) => {
      const data = csv
        .split("\n")
        .slice(1)
        .map((row) => {
          const [
            id,
            english,
            article,
            swedish,
            swedish_plural,
            literal,
            category,
            image_url,
          ] = row.split(",");
          return {
            id,
            english,
            article,
            swedish,
            swedish_plural,
            literal,
            category,
            image_url,
          };
        });
      const furnitureOnly = data.filter(
        (item) => item.category === "furniture" && item.image_url
      );
      const pairs = getRandomPairs(furnitureOnly, numPairs);
      currentPairs = pairs; // store globally for hint use
      const cards = prepareGridItems(pairs);
      renderGrid(cards);
    });
}