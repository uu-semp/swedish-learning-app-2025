// ui.js
// Renders shelf + shopping list and exposes a highlighter the parent can call.

function keyFromImgPath(p) {
  if (!p) return undefined;
  const base = p.split('/').pop() || '';
  return base.split('.')[0].toLowerCase(); // ".../food/beer.png" -> "beer"
}

let _listEls = []; // references to <li> nodes for highlighting

export function displayShelf(shelf) {
  const shelfContainer = document.querySelector('.shelf_items');
  if (!shelfContainer) {
    console.error('[ui] .shelf_items not found in DOM');
    return;
  }

  // Clear and render
  shelfContainer.textContent = '';

  shelf.forEach(item => {
    const img = document.createElement('img');
    img.src = "../" + item.img;
    img.alt = item.sv || item.en || '';
    const key = keyFromImgPath(item.img) || String(item.id || '').toLowerCase();

    const sendPick = () => {
      // parent (index.html) exposes this
      if (typeof window.sendPickToPopup === 'function') {
        window.sendPickToPopup(key);
      } else {
        console.warn('[ui] sendPickToPopup not available');
      }
    };

    img.tabIndex = 0;
    img.addEventListener('click', sendPick);
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sendPick(); }
    });

    shelfContainer.appendChild(img);
  });

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

  // Expose highlighter for parent (index.html) to call on status updates
  window.Team11UI = window.Team11UI || {};
  window.Team11UI.highlightListIndex = highlightListIndex;

  console.log('[ui] Displaying shopping list');
}

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
