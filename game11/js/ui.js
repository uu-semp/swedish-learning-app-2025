// ui.js
// Renders shelf + shopping list and exposes helpers for highlighting and cart placement.



/**
 * Extracts a key from image path.
 * The key is based on the image filename and is used to identify shelf items.
 *
 * @param {string} p - The path to the image.
 * @returns {string|undefined} The lowercase filename without its extension.
 */
function keyFromImgPath(p) {
  if (!p) return undefined;
  const base = p.split('/').pop() || '';
  return base.split('.')[0].toLowerCase();
}


let _listEls = [];                          // <li> refs for highlight
const _shelfImgByKey = new Map();           // key -> <img> on the shelf
let _dropzoneWired = false;                 // ensure we wire the dropzone once
let _imgErrorAlerted = false;               // show the image error alert only once
let _currentIndex = 0;                     // Is there to track which is the current item, this is used for sound.



/**
 * Sends the selected shelf item to the popup game logic.
 * This is used for both clicking an item and dropping an item into the cart.
 *
 * @param {string} key - The key identifying the selected item.
 */
function sendPick(key) {
  if (!key) return;
  const img = _shelfImgByKey.get(String(key));
  // If already solved, do nothing (prevents double-sending)
  if (img && img.classList.contains('is-picked')) return;

  if (typeof window.sendPickToPopup === 'function') {
    const label = img?.dataset.sv || key;
    window.sendPickToPopup(key, label);  
    console.debug('[ui] sendPick -> popup', key);
  } else {
    console.warn('[ui] sendPickToPopup not available');
  }
}



/**
 * Displays the items on the shelf and sets up the interactions for each item.
 * The appearance of the items depends on the selected game mode:
 * It also allows the player to select items by clicking,
 * or dragging them to the shopping cart.
 *
 * @param {Object[]} shelf - The items that should be displayed on the shelf.
 * @param {number} mode - The current game mode.
 */
export function displayShelf(shelf, mode) {
  const shelfContainer = document.querySelector('.shelf_items');
  if (!shelfContainer) {
    console.error('[ui] .shelf_items not found in DOM');
    return;
  }

  // Clear previous shelf items and reset the mapping
  shelfContainer.textContent = '';
  _shelfImgByKey.clear();

  shelf.forEach(item => {
    const key = keyFromImgPath(item.img) || String(item.id || '').toLowerCase();

    let element;

    if (mode === 2) {
      // Mode 2: show Swedish word
      element = createTextItem(item.sv);
    } else {
      // Mode 1: show image
      element = document.createElement('img');
      element.src = "../" + item.img;
      element.alt = item.sv || item.en || '';
      // Fallback: replace a broken image with a text placeholder so the game keeps working
      element.onerror = () => {
        console.error('[ui] Image failed to load:', item.img);
        const fallback = createTextItem('⚠ ' + (item.sv || item.en || key));
        Object.assign(fallback.dataset, element.dataset);
        wireShelfItem(fallback, key);
        element.replaceWith(fallback);
        _shelfImgByKey.set(key, fallback);
        if (!_imgErrorAlerted) {
          _imgErrorAlerted = true;
          alert('Some images failed to load; showing text instead.');
        }
      };
    }
    element.dataset.key = key;
    element.dataset.sv = item.sv || item.en || key;
    element.dataset.audio = item.audio || ''; // adding audio in dataset

    wireShelfItem(element, key);
    shelfContainer.appendChild(element);
    _shelfImgByKey.set(key, element);
  });

  setupCartDropzone();

  console.log('[ui] Displaying shelf; items:', shelf.length);
}

function createTextItem(text) {
  const element = document.createElement('div');
  // Todo, move it to css file
  element.style.backgroundColor = 'white';
  element.style.color = 'black';
  element.style.width = '80px';
  element.textContent = text;
  return element;
}

function wireShelfItem(element, key) {
    // Click-> same path as drop
    element.tabIndex = 0;
    element.addEventListener('click', (e) => { e.stopPropagation(); sendPick(key); });
    //TODO: curretly not working, need to fix it
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sendPick(key); }
    });

    // Drag & drop payload
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
      if (element.classList.contains('is-picked')) { e.preventDefault(); return; }
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', key);
        e.dataTransfer.effectAllowed = 'copy';
        try { e.dataTransfer.setDragImage(element, element.width / 2, element.height / 2); } catch {}
      }
      console.debug('[ui] dragstart', key);
    });
}



/**
 * Plays the audio pronunciation for the currently highlighted shopping-list item.
 * It gets the current item using _currentIndex and plays its associated audio file.
 * If no audio file is available, the function stops and displays a warning.
 */
function playCurrentSound() {
  const state = window.__game11GameState;
  const item = state?.shoppingList?.[_currentIndex];

  const audioPath = item?.audio;
  if (!audioPath) {
    console.warn('[ui] No audio available for current item');
    return;
  }
  const audio = new Audio("../" + audioPath);
  audio.play().catch(err => console.warn('[ui] audio play failed:', err));
}



/**
 * Displays the shopping list and creates the sound button.
 * The displayed language depends on the selected game mode.
 *
 * @param {Object[]} list - The shopping-list items to display.
 * @param {number} mode - The current game mode.
 */
export function displayShoppingList(list, mode) {
  const listWrap = document.querySelector('.shopping_list');
  if (!listWrap) {
    console.error('[ui] .shopping_list not found in DOM');
    return;
  }

  listWrap.textContent = '';
  const ul = document.createElement('ul');
  ul.className = 'shopping-list';

  _listEls = list.map(item => {
    const li = document.createElement('li');
    if (mode === 2) {
      li.textContent = item.en;
    } else  if (mode === 1 ) {
      li.textContent = item.sv;
    } else {
      ul.classList.add('no-bullets');
      li.textContent = "";
    }
    ul.appendChild(li);
    return li;
  });

  listWrap.appendChild(ul);
  
  // Create soundbutton and run function to play sound
  // only create sound button for mode 1 and mode 3 (mode 1 is image-based, mode 3 is audio-based)
  if(mode === 3) {
      const soundBtn = document.createElement('button');
      soundBtn.className = 'play-sound-larger-btn';
      soundBtn.innerHTML = '<i class="fa-solid fa-headphones"></i>'
      soundBtn.type = 'button';
      soundBtn.addEventListener('click', () => {
        soundBtn.classList.add('playing');
        playCurrentSound();
        soundBtn.disabled = true;
         setTimeout(() => {
          soundBtn.classList.remove('playing');
          soundBtn.disabled = false;

        }, 1500);
      });      
      listWrap.appendChild(soundBtn);
  } else if (mode === 1) {
      const soundBtn = document.createElement('button');
      soundBtn.className = 'play-sound-btn';
      soundBtn.innerHTML = '<i class="fa-solid fa-headphones"></i>'
      soundBtn.type = 'button';
      soundBtn.addEventListener('click', () => {
        soundBtn.classList.add('playing');
        playCurrentSound();
        soundBtn.disabled = true;
        setTimeout(() => {
          soundBtn.classList.remove('playing');
          soundBtn.disabled = false;
        }, 1500);
      });      
      listWrap.appendChild(soundBtn);
  }
  // Default highlight first row
  highlightListIndex(0);

  // Expose helpers for the parent (index.html)
  window.Game11UI = window.Game11UI || {};
  window.Game11UI.highlightListIndex = highlightListIndex;
  window.Game11UI.placeItemInCart = placeItemInCart;

  console.log('[ui] Displaying shopping list');
}



/**
 * Sets up the copyright information for the images in the game.
 * It also handles opening and closing the copyright information modal.
 *
 * @param {Object[]} shelf - The shelf items containing copyright information.
 * @param {number} mode - The current game mode.
 */
export function displayCopyright(shelf, mode) {
  // CopyRight Info
  /** @type {HTMLElement} */
  const copyright_modal = document.querySelector("#copyright");
  if (!copyright_modal) {
    console.error('[ui] copyright not found in DOM');
    return;
  }

  /** @type {HTMLElement} */
  const copyright_modal_exit = document.querySelector("#close-copyright");
  if (!copyright_modal_exit) {
    console.error('[ui] copyright_modal_exit not found in DOM');
    return;
  }

  const copyrightBtn = document.querySelector("#copyrightBtn");
  if (!copyrightBtn) {
    console.error('[ui] copyrightBtn not found in DOM');
    return;
  }

  copyrightBtn.addEventListener("click", () => {
    copyright_modal.style.display = "block";
  });

  copyright_modal_exit.addEventListener("click", () => {
    copyright_modal.style.display = "none";
  });

  // Add copyright from every item in the shelf
  shelf.forEach((item, i) => {
    const IMAGE_ID = `#image${i+1}`;
    const currentImage = document.querySelector(IMAGE_ID);
    if (!currentImage) {
      console.error(`[ui] image${i} not found in DOM`);
      return;
    }
    
    let copyrightInfo = item.img_copyright || "None";

    // NOTE: If the database changes the HTML to fix "broken" link, remove this.
    // NOTE: This fix also only works with items from "papunet.net".
    if (copyrightInfo.includes("Papunet")) {
      const REF_START = 29;
      const URL_START = 35;
      const CC_REF_START = 133;
      copyrightInfo = item.img_copyright.slice(0, REF_START) 
        + 'target="_blank" href="https://'
        + item.img_copyright.slice(URL_START, CC_REF_START)
        + 'target="_blank" '
        + item.img_copyright.slice(CC_REF_START);
    }

    currentImage.innerHTML = copyrightInfo;
  });
}

/* ---------- Helpers ---------- */



/**
 * Highlights the current item in the shopping list.
 * It updates the current index and changes the appearance of the selected item
 * while making the other items less visible.
 *
 * @param {number} idx - The index of the shopping-list item to highlight.
 */
function highlightListIndex(idx) {
  if (!_listEls || !_listEls.length) return;
  const n = Number(idx);
  _currentIndex = n; // Update current index

  _listEls.forEach((li, i) => {
    // TODO: Move these styles to CSS classes and toggle classes instead of inline styles
    if (i === n) {
      li.style.fontWeight = '0';
      li.style.fontSize = '30px';
      li.style.textDecoration = 'underline';
      li.style.opacity = '1';
    } else {
      li.style.fontWeight = '400';
      li.style.textDecoration = 'none';
      li.style.opacity = '0.35';
      li.style.fontSize = '12px';
    }
  });
}



/**
 * Sets up drag-and-drop functionality for the shopping cart.
 * It allows items to be dropped onto the cart and prevents the dropzone
 * from being registered multiple times.
 */
function setupCartDropzone() {
  if (_dropzoneWired) return;

  const dz = document.querySelector('.cart-dropzone');  // overlay on top of the cart
  const cartImg = document.querySelector('.cart');      // cart <img> (fallback target)
  const frame   = document.querySelector('.game-frame');

  function handleDropKey(key) { sendPick(key); }

  // Preferred: explicit overlay
  if (dz) {
    dz.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dz.classList.add('is-hover');
    });
    dz.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    });
    dz.addEventListener('dragleave', () => dz.classList.remove('is-hover'));
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.remove('is-hover');
      const key = e.dataTransfer && e.dataTransfer.getData('text/plain');
      handleDropKey(key);
    });
  }

  // Fallback: drop anywhere in the frame but accept only if pointer is over the cart image
  if (frame && cartImg) {
    frame.addEventListener('dragover', (e) => { e.preventDefault(); });
    frame.addEventListener('drop', (e) => {
      e.preventDefault();
      const key = e.dataTransfer && e.dataTransfer.getData('text/plain');
      if (!key) return;
      const r = cartImg.getBoundingClientRect();
      const overCart =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom;
      if (overCart) handleDropKey(key);
    });
  }

  _dropzoneWired = true;
}



/**
 * Places a selected shelf item into the shopping cart and disables the original item.
 * The function supports both image and word-based game modes and prevents
 * an item from being placed in the cart more than once.
 *
 * @param {string} key - The key identifying the shelf item to place in the cart.
 */
function placeItemInCart(key) {
  const cart = document.querySelector('.cart-dropzone .cart_items')
            || document.querySelector('.cart_items'); // fallback
  const shelfElement = _shelfImgByKey.get(String(key));
  if (!cart || !shelfElement) return;

  // Skip if already placed
  if (shelfElement.classList.contains('is-picked')) return;

  // Clone a lightweight visual into the cart
  let clone ;

    if (shelfElement.tagName === 'IMG') {
    // Mode 1: copy the image
    clone = document.createElement('img');
    clone.src = shelfElement.src;
    clone.alt = shelfElement.alt;
  } else {
    // Mode 2: copy the Swedish word
    clone = document.createElement('div');
    clone.textContent = shelfElement.textContent;

    clone.style.backgroundColor = 'white';
    clone.style.color = 'black';
    clone.style.fontSize = '10px';
    clone.style.width = '20px';

  }

  cart.appendChild(clone);

  // Disable the shelf image
  shelfElement.classList.add('is-picked');
  shelfElement.draggable = false;
  shelfElement.tabIndex = -1;
  shelfElement.onclick = null;
  shelfElement.onkeydown = null;

  console.debug('[ui] placed in cart:', key);
}
