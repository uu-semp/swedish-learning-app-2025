const shelf_items = document.querySelector('.shelf_items');
const shopping_list = document.querySelector('.shopping_list');

// ui.js
function keyFromImgPath(p) {
  if (!p) return undefined;
  const base = p.split('/').pop() || '';
  return base.split('.')[0].toLowerCase();  // e.g. "banana"
}

export function displayShelf(shelf) {
  const shelf_items = document.querySelector('.shelf_items');
  if (!shelf_items) { console.error('[ui] .shelf_items not found'); return; }

  shelf_items.textContent = '';

  shelf.forEach(item => {
    const img = document.createElement('img');
    img.src = "../" + item.img;
    img.alt = item.sv || '';
    const key = keyFromImgPath(item.img) || String(item.id || '');

    const sendPick = () => {
      console.log('[ui] clicked product (key):', key);
      window.sendPickToPopup?.(key);
    };

    img.tabIndex = 0;
    img.addEventListener('click', sendPick);
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sendPick(); }
    });

    shelf_items.appendChild(img);
  });

  console.log('[ui] Displaying shelf; items:', shelf.length);
}

export function displayShoppingList(list) {
  const shopping_list = document.querySelector('.shopping_list');
  if (!shopping_list) { console.error('[ui] .shopping_list not found'); return; }

  shopping_list.textContent = '';
  const ul = document.createElement('ul');
  ul.className = 'shopping-list';

  list.forEach((item, ix) => {
    const li = document.createElement('li');
    li.textContent = item.sv;
    if (ix === 0) { li.style.fontWeight = '700'; li.style.textDecoration = 'underline'; }
    ul.appendChild(li);
  });

  shopping_list.appendChild(ul);
  console.log('[ui] Displaying shopping list');
}
