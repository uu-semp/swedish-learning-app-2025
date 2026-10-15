// ==============================================
// Owned by Game 02 — card grid rendering
// ==============================================

"use strict";

export function getRandomPairs(data, numPairs) {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPairs);
}

export function prepareGridItems(pairs) {
  const cards = [];

  pairs.forEach((pair, index) => {
    const id = `pair-${index}`;
    cards.push({ id, type: "description", content: pair.swedish });
    cards.push({ id, type: "image", content: pair.image_url });
  });

  // Shuffle the final cards
  return cards.sort(() => 0.5 - Math.random());
}

export function renderGrid(cards) {
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
