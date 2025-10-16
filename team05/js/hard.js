"use strict";

document.addEventListener("DOMContentLoaded", function() {
  // Wait for the external vocabulary script to be ready
  window.vocabulary.when_ready(initGame);
});

// --- Game State ---
let currentLevel = 7;
const MAX_LEVEL = 9;
const levelFailures = {};
let levelData = {};
let placedItems = new Map();
let staticItems = new Map();
let currentlyDraggedItem = null; // Info about the item being dragged

// --- DOM Element References ---
let gameFrame, levelIndicator, promptBar, itemList, roomContainer, doneButton, modalOverlay, modalTitle, modalText, modalCloseButton;

/**
 * Initializes the game, sets up DOM references and event listeners.
 */
function initGame() {
  selectLevel();
  setupDOM();
  setupEventListeners();
  loadLevel(currentLevel);
}

/**
 * Selects hard game level depending on level URL parameter
 */
function selectLevel() {
  const urlParams = new URLSearchParams(window.location.search);
  const levelFromUrl = urlParams.get('level');
  const parsedLevel = parseInt(levelFromUrl, 10);

  // Check if the parsed level is a number and is within the valid range (7-9)
  if (!isNaN(parsedLevel) && parsedLevel >= 7 && parsedLevel <= 9) {
    currentLevel = parsedLevel;
  }
}

/**
 * Creates the game's HTML structure and caches references to key elements.
 */
function setupDOM() {
  const gameHTML = `
        <div id="game-container">
            <div id="top-bar">
                <div id="level-indicator"></div>
                <div id="prompt-bar"></div>
            </div>
            <div id="game-area">
                <div id="item-list"></div>
                <div id="room-container">
                    <img id="room-background" src="" alt="Room Background"/>
                </div>
            </div>
            <div id="bottom-bar">
                <button id="done-button">Done</button>
            </div>
            <div id="modal-overlay" class="hidden">
                <div id="modal-content">
                    <h3>Hint</h3>
                    <p id="modal-text"></p>
                    <button id="modal-close-button">Try Again</button>
                </div>
            </div>
        </div>`;

  gameFrame = document.querySelector('.game-frame');
  gameFrame.innerHTML = gameHTML;

  // Cache elements
  levelIndicator = document.getElementById('level-indicator');
  promptBar = document.getElementById('prompt-bar');
  itemList = document.getElementById('item-list');
  roomContainer = document.getElementById('room-container');
  doneButton = document.getElementById('done-button');
  modalOverlay = document.getElementById('modal-overlay');
  modalTitle = document.querySelector('#modal-content h3');
  modalText = document.getElementById('modal-text');
  modalCloseButton = document.getElementById('modal-close-button');
}

/**
 * Sets up global event listeners for the game.
 */
function setupEventListeners() {
  doneButton.addEventListener('click', handleDoneClick);

  // --- Drag and Drop Event Listeners ---
  // Allow the room to be a drop target
  roomContainer.addEventListener('dragover', e => e.preventDefault());
  roomContainer.addEventListener('drop', handleDrop);

  // If an item is dragged, its 'dragend' event will always fire
  document.addEventListener('dragend', handleDragEnd);
}

/**
 * Fetches the level data and starts the setup process.
 * @param {number} levelNumber - The level to load (e.g., 7, 8, 9).
 */
async function loadLevel(levelNumber) {
  if (levelNumber > MAX_LEVEL) {
    displayGameComplete();
    return;
  }

  try {
    const indexResponse = await fetch('/team05/assets/level-descriptors/hard/index.json');
    const levelIndex = await indexResponse.json();

    const levelConfig = levelIndex.find(l => l.level === levelNumber);
    if (!levelConfig || levelConfig.include.length === 0) {
      throw new Error(`Configuration for level ${levelNumber} not found.`);
    }

    // Pick a random variation
    const variationPath = levelConfig.include[Math.floor(Math.random() * levelConfig.include.length)];

    const dataResponse = await fetch(variationPath);
    levelData = await dataResponse.json();

    // Pre-fetch vocab data for easy access
    levelData.fullVocabData = levelData.vocabs.map(v => window.vocabulary.get_vocab(v.id));

    setupLevelUI();
  } catch (error) {
    console.error('Failed to load level data:', error);
    promptBar.textContent = 'Error loading level. Please refresh.';
  }
}

/**
 * Resets and populates the UI for the current level.
 */
function setupLevelUI() {
  // Reset state from previous level
  placedItems.clear();
  staticItems.clear();
  itemList.innerHTML = '';
  roomContainer.querySelectorAll('.placed-item, .static-item').forEach(el => el.remove());
  if (!levelFailures[currentLevel]) {
    levelFailures[currentLevel] = 0;
  }

  // Update UI elements
  levelIndicator.textContent = `Level ${currentLevel}`;
  document.getElementById('room-background').src = levelData.background.path;
  promptBar.innerHTML = parsePrompt(levelData.prompt);

  const staticIndices = new Set(levelData.staticVocabs.map(sv => sv.index));
  const roomRect = roomContainer.getBoundingClientRect();
  const smallestRoomDim = Math.min(roomRect.width, roomRect.height);

  // Populate static and draggable items
  levelData.vocabs.forEach((vocab, i) => {
    const vocabIndex = i + 1; // 1-based index
    const fullVocab = levelData.fullVocabData[i];

    if (staticIndices.has(vocabIndex)) {
      // This is a static item, place it in the room
      const staticInfo = levelData.staticVocabs.find(sv => sv.index === vocabIndex);
      const img = document.createElement('img');
      img.src = '/' + fullVocab.img;
      img.className = 'static-item';
      img.style.width = `${vocab.maxWidth * smallestRoomDim}px`;

      img.onload = () => { // Position after image has loaded to get its dimensions
        const x = staticInfo.x * roomRect.width - img.width / 2;
        const y = staticInfo.y * roomRect.height - img.height / 2;
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        staticItems.set(vocabIndex, { ...staticInfo, el: img });
      };
      roomContainer.appendChild(img);
    } else {
      // This is a draggable item, place it in the side list
      const wrapper = document.createElement('div');
      wrapper.className = 'draggable-item-wrapper';

      const img = document.createElement('img');
      img.src = '/' + fullVocab.img;
      img.className = 'draggable-item';
      img.dataset.vocabIndex = vocabIndex;
      img.draggable = true;

      img.addEventListener('dragstart', (e) => {
        currentlyDraggedItem = { vocabIndex, isFromList: true, element: img };
        e.dataTransfer.setData('text/plain', vocabIndex); // Necessary for Firefox
      });

      wrapper.appendChild(img);
      itemList.appendChild(wrapper);
    }
  });
}

/**
 * Parses the prompt string, replacing placeholders like @1 and $1.
 * @param {string} template - The prompt template string.
 * @returns {string} The formatted prompt string.
 */
function parsePrompt(template) {
  return template.replace(/[@$](\d+)/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10);
    const vocab = levelData.fullVocabData[index - 1];
    if (!vocab) return match;

    if (match.startsWith('@')) return vocab.article || '';
    if (match.startsWith('$')) return vocab.sv || '';
    return match;
  });
}

/**
 * Handles dropping an item into the room container.
 * @param {DragEvent} e - The drop event.
 */
function handleDrop(e) {
  e.preventDefault();
  if (!currentlyDraggedItem) return;

  const { vocabIndex, isFromList } = currentlyDraggedItem;
  const roomRect = roomContainer.getBoundingClientRect();

  // Calculate drop coordinates relative to the room
  let x = e.clientX - roomRect.left;
  let y = e.clientY - roomRect.top;

  const relativeX = x / roomRect.width;
  const relativeY = y / roomRect.height;

  if (isFromList) {
    // Hide the item in the list
    currentlyDraggedItem.element.closest('.draggable-item-wrapper').style.display = 'none';

    // Create a new element in the room
    const vocabDef = levelData.vocabs[vocabIndex - 1];
    const fullVocab = levelData.fullVocabData[vocabIndex - 1];
    const smallestRoomDim = Math.min(roomRect.width, roomRect.height);

    const img = document.createElement('img');
    img.src = '/' + fullVocab.img;
    img.className = 'placed-item';
    img.dataset.vocabIndex = vocabIndex;

    img.style.width = `${vocabDef.maxWidth * smallestRoomDim}px`;

    img.draggable = true;

    img.addEventListener('dragstart', (e) => {
      currentlyDraggedItem = { vocabIndex, isFromList: false, element: img };
      e.dataTransfer.setData('text/plain', vocabIndex);
    });

    img.onload = () => { // Position after load to get correct dimensions
      img.style.left = `${x - img.width / 2}px`;
      img.style.top = `${y - img.height / 2}px`;
    };

    roomContainer.appendChild(img);
    placedItems.set(vocabIndex, { el: img, x: relativeX, y: relativeY });

  } else {
    // Move an existing item within the room
    const item = placedItems.get(vocabIndex);
    item.x = relativeX;
    item.y = relativeY;
    item.el.style.left = `${x - item.el.width / 2}px`;
    item.el.style.top = `${y - item.el.height / 2}px`;
  }

  currentlyDraggedItem.wasDroppedInRoom = true;
}

/**
 * Handles the end of any drag operation.
 */
function handleDragEnd() {
  if (!currentlyDraggedItem) return;

  // If an item was dragged from the room but not dropped back in
  if (!currentlyDraggedItem.isFromList && !currentlyDraggedItem.wasDroppedInRoom) {
    const { vocabIndex, element } = currentlyDraggedItem;

    // Remove from room and unhide in list
    element.remove();
    placedItems.delete(vocabIndex);

    const listItem = itemList.querySelector(`.draggable-item[data-vocab-index='${vocabIndex}']`);
    if (listItem) {
      listItem.closest('.draggable-item-wrapper').style.display = 'flex';
    }
  }
  currentlyDraggedItem = null;
}

/**
 * Displays the modal with custom content and button behavior.
 * @param {string} title - The title for the modal.
 * @param {string} text - The main text content.
 * @param {string} buttonText - The text for the close/action button.
 * @param {Function} [onButtonClick] - Optional callback to run when the button is clicked.
 */
function showModal(title, text, buttonText, onButtonClick) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalCloseButton.textContent = buttonText;

  modalCloseButton.onclick = () => {
    modalOverlay.classList.add('hidden');
    if (onButtonClick) {
      onButtonClick();
    }
  };

  modalOverlay.classList.remove('hidden');
}

/**
 * Handles the 'Done' button click, triggering level validation.
 */
function handleDoneClick() {
  if (validateLevel()) {
    currentLevel++;
    loadLevel(currentLevel);
  } else {
    levelFailures[currentLevel]++;
    if (levelFailures[currentLevel] >= 2) {
      // Failed twice, use the modal to move to the next level.
      showModal(
        "Let's Move On",
        "No worries! Let's try the next challenge.",
        "Continue",
        () => {
          currentLevel++;
          loadLevel(currentLevel);
        }
      );
    } else {
      // First fail, show hint and reset the level.
      setupLevelUI(); // Reset the level first
      showModal(
        "Hint",
        levelData.hint,
        "Try Again",
        null // The button only needs to close the modal.
      );
    }
  }
}

/**
 * Validates the player's item placement against the level requirements.
 * @returns {boolean} True if the level is passed, otherwise false.
 */
function validateLevel() {
  const requirements = levelData.proximityRequirements;
  const requiredIndices = new Set();
  requirements.forEach(req => {
    if (!staticItems.has(req.indexA)) requiredIndices.add(req.indexA);
    if (req.indexB !== 0 && !staticItems.has(req.indexB)) requiredIndices.add(req.indexB);
  });

  // 1. Check if exactly the required items (and no extras) are placed.
  if (placedItems.size !== requiredIndices.size) return false;
  for (const placedIndex of placedItems.keys()) {
    if (!requiredIndices.has(placedIndex)) return false;
  }

  const roomRect = roomContainer.getBoundingClientRect();
  const maxDim = Math.max(roomRect.width, roomRect.height);

  // 2. Check proximity requirements.
  for (const req of requirements) {
    const posA = getObjectPosition(req.indexA);
    const posB = getObjectPosition(req.indexB);

    if (!posA || !posB) return false; // An item required for a check wasn't placed

    // Calculate normalized distance
    const dx = (posA.x - posB.x) * roomRect.width;
    const dy = (posA.y - posB.y) * roomRect.height;
    const distance = Math.sqrt(dx * dx + dy * dy) / maxDim;

    if (distance > req.proximity) return false; // Failed proximity check
  }

  return true; // All checks passed
}

/**
 * Gets the relative position of a vocab item.
 * @param {number} index - The 1-based index of the vocab item.
 * @returns {{x: number, y: number} | null} The position or null if not found.
 */
function getObjectPosition(index) {
  if (index === 0) return { x: 0.5, y: 0.5 }; // Pseudo-object at the center
  if (placedItems.has(index)) return placedItems.get(index);
  if (staticItems.has(index)) return staticItems.get(index);
  return null;
}

/**
 * Displays a completion message when all levels are finished.
 */
function displayGameComplete() {
  gameFrame.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center;">
            <h2>Congratulations!</h2>
            <p>You have completed all the levels.</p>
        </div>`;
}
