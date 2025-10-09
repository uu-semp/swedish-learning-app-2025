// ui.js
// Renders shelf + shopping list and exposes helpers for highlighting and cart placement.

function keyFromImgPath(p) {
  if (!p) return undefined;
  const base = p.split('/').pop() || '';
  return base.split('.')[0].toLowerCase();
}

let _listEls = [];                          // <li> refs for highlight
const _shelfImgByKey = new Map();           // key -> <img> on the shelf
let _dropzoneWired = false;                 // ensure we wire the dropzone once

// Single unified path: both click and drop call this.
function sendPick(key) {
  if (!key) return;
  const img = _shelfImgByKey.get(String(key));
  // If already solved, do nothing (prevents double-sending)
  if (img && img.classList.contains('is-picked')) return;

  if (typeof window.sendPickToPopup === 'function') {
    window.sendPickToPopup(key);   // ✅ triggers popup pick(id): updates counters + toasts
    console.debug('[ui] sendPick -> popup', key);
  } else {
    console.warn('[ui] sendPickToPopup not available');
  }
}

export function displayShelf(shelf) {
  const shelfContainer = document.querySelector('.shelf_items');
  if (!shelfContainer) {
    console.error('[ui] .shelf_items not found in DOM');
    return;
  }

  shelfContainer.textContent = '';
  _shelfImgByKey.clear();

  shelf.forEach(item => {
    const img = document.createElement('img');
    img.src = "../" + item.img;
    img.alt = item.sv || item.en || '';
    const key = keyFromImgPath(item.img) || String(item.id || '').toLowerCase();
    img.dataset.key = key;

    // Click/keyboard -> same path as drop
    img.tabIndex = 0;
    img.addEventListener('click', () => sendPick(key));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sendPick(key); }
    });

    // Drag & drop payload
    img.draggable = true;
    img.addEventListener('dragstart', (e) => {
      if (img.classList.contains('is-picked')) { e.preventDefault(); return; }
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', key);
        e.dataTransfer.effectAllowed = 'copy';
        try { e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2); } catch {}
      }
      console.debug('[ui] dragstart', key);
    });

    shelfContainer.appendChild(img);
    _shelfImgByKey.set(key, img);
  });

  setupCartDropzone();

  console.log('[ui] Displaying shelf; items:', shelf.length);
}

export function displayShoppingList(list) {
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
    li.textContent = item.sv || item.en || '';
    ul.appendChild(li);
    return li;
  });

  listWrap.appendChild(ul);

  // Default highlight first row
  highlightListIndex(0);

  // Expose helpers for the parent (index.html)
  window.Team11UI = window.Team11UI || {};
  window.Team11UI.highlightListIndex = highlightListIndex;
  window.Team11UI.placeItemInCart = placeItemInCart;

  console.log('[ui] Displaying shopping list');
}

/* ---------- Helpers ---------- */

function highlightListIndex(idx) {
  if (!_listEls || !_listEls.length) return;
  const n = Number(idx);

  _listEls.forEach((li, i) => {
    if (i === n) {
      li.style.fontWeight = '700';
      li.style.textDecoration = 'underline';
      li.style.opacity = '1';
    } else {
      li.style.fontWeight = '400';
      li.style.textDecoration = 'none';
      li.style.opacity = '0.75';
    }
  });
}

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

/** Clone the shelf image into the cart and disable the original on the shelf.
 *  This is called by index.html ONLY after popup confirms ok:true (same as click success).
 */
function placeItemInCart(key) {
  const cart = document.querySelector('.cart-dropzone .cart_items')
            || document.querySelector('.cart_items'); // fallback
  const shelfImg = _shelfImgByKey.get(String(key));
  if (!cart || !shelfImg) return;

  // Skip if already placed
  if (shelfImg.classList.contains('is-picked')) return;

  // Clone a lightweight visual into the cart
  const clone = document.createElement('img');
  clone.src = shelfImg.src;
  clone.alt = shelfImg.alt;
  cart.appendChild(clone);

  // Disable the shelf image
  shelfImg.classList.add('is-picked');
  shelfImg.draggable = false;
  shelfImg.tabIndex = -1;
  shelfImg.onclick = null;
  shelfImg.onkeydown = null;

  console.debug('[ui] placed in cart:', key);
}
