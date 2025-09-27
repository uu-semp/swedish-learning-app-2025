// ==============================================
// Owned by Team 01
// ==============================================

let numPairs = 8; // number of pairs of cards

"use strict";

$(function () {

  // constants
  const time_delay = 2000; // 2 seconds delay after every match
  const corrects_needed = 8; // number of correct pairs needed to win
  const misses_max = 10; // number of misses allowed before losing
  // variables
  let corrects = 0;
  let misses = 0;

  let flippedCards = []; // array of currently flipped cards


  // Function to show only one screen at a time
  function showScreen(screenId) {
    $("#menu-screen, #game-screen, #end-screen").hide();
    $("#" + screenId).show();
  }

  // Button handlers
  $("#start-game").on("click", function () {
    showScreen("game-screen");
  });

  $("#end-game").on("click", function () {
    resetGame();
    showScreen("end-screen");
  });

  $("#restart-game").on("click", function () {
    showScreen("menu-screen");
  });

  // Initialize on menu screen
  showScreen("menu-screen");

  // Game logic
  mapCards();


  function resetFlipState() {  // when no pair is found, card flips back
    flippedCards[0]?.removeClass("flipped");
    flippedCards[1]?.removeClass("flipped");
    flippedCards = [];
  }

  function resetGame() {
    corrects = 0;
    misses = 0;
    resetFlipState();
  }

  function foundMatch() { 
    corrects++;
    flippedCards[0].addClass("matched");
    flippedCards[1].addClass("matched");
    alert
    if (corrects >= corrects_needed) {
      alert("Congratulations! You've won the game!");
      resetGame();
      showScreen("end-screen");
    }
    resetFlipState();
  }

  function notMatch() {
    misses++;
    if (misses >= misses_max) {
      alert("Game Over! You've exceeded the maximum number of misses.");
      resetGame();
      showScreen("end-screen");
    }
    resetFlipState();
  }
    
  // Event delegation för dynamiskt skapade kort
  $(document).on("click", ".card", clickCard); 

  function clickCard() {
    if (flippedCards.length < 2 && !$(this).hasClass("flipped")) {  // flips clicked card
      $(this).addClass("flipped");
      flippedCards.push($(this));
      //add logic to check for match
    }
    // if (flippedCards.length === 2) { // temp match test
    //   foundMatch();
    if (flippedCards.length === 2) { // temp reset test
      setTimeout(() => {
        resetFlipState();
      }, time_delay);
     }
  }


});
  
// FIXME: repace fetch with API call to get the data.
function mapCards() {
  const data = fetch('sepm25_data_scema_sheet1(1).json')
    .then(response => response.json())
    .then(data => {
      const furnitureOnly = data.filter(item => item.category === 'furniture' && item.image_url !== null);
      const pairs = getRandomPairs(furnitureOnly, numPairs);
      const cards = prepareGridItems(pairs);
      console.log(cards);
      renderGrid(cards);
    });
    
}


function getRandomPairs(data, numPairs) {
  console.log(data);
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPairs);
}

function prepareGridItems(pairs) {
  const cards = [];

  pairs.forEach((pair, index) => {
    const id = `pair-${index}`;
    cards.push({ id, type: 'description', content: pair.swedish });
    cards.push({ id, type: 'image', content: pair.image_url });
  });

  // Shuffle the final cards
  return cards.sort(() => 0.5 - Math.random());
}

function renderGrid(cards) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Rensa befintliga kort
  
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.setAttribute('data-index', index + 1);
    cardElement.setAttribute('data-content', card.content);
    cardElement.setAttribute('data-type', card.type);
    cardElement.setAttribute('data-pair-id', card.id);
    
    // Bestäm innehållet för baksidan baserat på typ
    let backContent;
    if (card.type === 'image') {
      // Fixa bildvägen - lägg till ../ för att gå upp en mapp
      const imagePath = card.content.startsWith('assets/') ? '../' + card.content : card.content;
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
 
