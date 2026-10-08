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
  getAudioContext(); // This is here to allow audio since it needs browsers block audio before a click
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

// Cache for the audio, so it doesn't have to download it.
const _audioCache = new Map();

// Skips the empty silence of all the pronounciations
const AUDIO_START_TRIM = 0.2; // this is in seconds

// Error audio timer
let _audioErrorTimer = null; // timer for hiding the audio error message

// Context necesary to create sound effects with Web audio API
let _audioContext = null;

// Notes for each sound effect with frequency in Hz and start and duration in seconds
const SOUND_EFFECTS = {
  correct: [{ freq: 660, start: 0, dur: 0.12 }, { freq: 880, start: 0.1, dur: 0.2 }],
  wrong:   [{ freq: 220, start: 0, dur: 0.3, type: "triangle" }],
  win:     [523, 659, 784, 1047].map((freq, i) => ({ freq, start: i * 0.12, dur: 0.25 })),
  lose:    [392, 330, 262].map((freq, i) => ({ freq, start: i * 0.2, dur: 0.3 })),
};

// Volume of the sound effects
const SOUND_VOLUME = 0.15; 

/**
 * Returns the shared audio context and also creating it if there is none.
 * This will only work if the browser supports it. 
 * Safari, Edge, Chrome and Firefox do support it.
 *
 * @returns {AudioContext|null} The audio context or null if not supported
 */
function getAudioContext(){
  if(!_audioContext){
    const Context = window.AudioContext || window.webkitAudioContext;
    if(!Context) return null;
    _audioContext = new Context();
  }
  if(_audioContext.state === "suspended") _audioContext.resume();
  return _audioContext;
}


/*
 * Play the sound effect
 *
 * @param {string} name - the soudn to play either correct, wrong, win or lose.
 */
function playSoundEffect(name){
  const notes = SOUND_EFFECTS[name];
  const Context = notes ? getAudioContext() : null;

  if(!Context) return;

  const now = Context.currentTime;
  
  notes.forEach(({ freq, start, dur, type = 'sine' }) => {
    const osc = Context.createOscillator();
    const gain = Context.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    
    // Fade in
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(SOUND_VOLUME, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    osc.connect(gain).connect(Context.destination);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);

  });
}

/**
 * Shows an error message if the audio fails to play
 */
function showAudioError(){
  const msg = document.getElementById('audio-error');
  if (!msg) return;
  msg.style.display = 'block';
  clearTimeout(_audioErrorTimer);
  _audioErrorTimer = setTimeout(() => {
    msg.style.display = 'none';
  }, 2000);
}




/**
 * Returns the cached audio element for the given item.
 * If it is not currently cached, preload it, otherwise load it from the cache.
 *
 * @param {string} path - to the item from the vocabulary data.
 * @return {HTMLAudioElement} the audio element.
 */
function getAudio(path) {
  let audio = _audioCache.get(path);
  if(!audio){
    audio = new Audio("../" + path);
    audio.preload = "auto";
    audio.load();
    _audioCache.set(path, audio);
  }
  return audio;
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
    showAudioError();
    return;
  }
  const audio = getAudio(audioPath);
  audio.currentTime = AUDIO_START_TRIM; // so they start at the Trim

  audio.play().catch(err => {
    console.warn('[ui] audio play failed:', err);
    showAudioError();
  });
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
  // cache the audio of the items
  if (mode === 1 || mode === 3){
    list.forEach(item => {
      if(item.audio){
        getAudio(item.audio); 
      }
    });
  }
  // Default highlight first row
  highlightListIndex(0);

  // Expose helpers for the parent (index.html)
  window.Game11UI = window.Game11UI || {};
  window.Game11UI.highlightListIndex = highlightListIndex;
  window.Game11UI.placeItemInCart = placeItemInCart;
  window.Game11UI.playSoundEffect = playSoundEffect;

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

// Exports for testing
export { getAudio, playCurrentSound, AUDIO_START_TRIM, playSoundEffect };
