// Game 11 tests – run from repo root: node --test game11/test/game11.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const GAME = path.resolve(import.meta.dirname, '..');
const ROOT = path.resolve(GAME, '..');






// Build window.vocabulary + localStorage from the repo's words.csv (same fields as scripts/vocabulary_await.js).
const rows = fs.readFileSync(path.join(ROOT, 'words.csv'), 'utf8').trim().split(/\r?\n/)
  .map(line => [...line.matchAll(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)].map(m => m[1].replace(/^"|"$/g, '').replace(/""/g, '"')));
const head = rows.shift();
const col = (r, name) => r[head.indexOf(name)]?.trim();
const vocab = {}, categories = {};
for (const r of rows) {
  const id = col(r, 'ID');
  vocab[id] = { en: col(r, 'English'), sv: col(r, 'Swedish'), img: col(r, 'Image_url'), audio: col(r, 'Audio_url'), img_copyright: col(r, 'Image_copyright_info') };
  (categories[col(r, 'Category')] ??= []).push(id);
}
globalThis.window = { vocabulary: { get_category: c => categories[c], get_vocab: id => vocab[id] } };
const store = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true, value: {
    getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k),
  }
});


// fake save state for the tests
globalThis.save = window.save = {
  get(game, key = null) {
    const data = JSON.parse(localStorage.getItem(game) ?? '{}');
    return key ? (data[key] ?? null) : data;
  },
  set(game, key, value) {
    const data = this.get(game);
    data[key] = value;
    localStorage.setItem(game, JSON.stringify(data));
    return true;
  },
};

const { getItemsIds, getItems } = await import('../js/data.js');
const { generateShoppingList, generateShelf } = await import('../js/gameLogic.js');
const { initGameState, saveState, loadState } = await import('../js/state.js');
const { getAudio, playCurrentSound, AUDIO_START_TRIM } = await import('../js/ui.js');

const EXCLUDED = ['567f323c', '2f373051', '32191560', '440d3157', '75387a51', '19263071', '6a701276'];
const keyOf = item => path.basename(item.img).split('.')[0].toLowerCase(); // same key as ui.js / index.html
const ids = list => list.map(i => i.id);
const items = getItems();

// Only food/fruit words are used, never the excluded non-grocery words.
test('item pool is food/fruit without excluded ids', () => {
  const pool = getItemsIds();
  assert.ok(pool.length >= 16, `only ${pool.length} items`);
  const allowed = [...(categories.food ?? []), ...(categories.fruit ?? [])];
  pool.forEach(id => assert.ok(allowed.includes(id) && !EXCLUDED.includes(id), id));
});

// Every item has Swedish, English and an image.
test('every item has sv, en and img', () => {
  items.forEach(i => assert.ok(i.sv && i.en && i.img, `incomplete: ${i.id}`));
});

// Image and audio files referenced by items exist on disk.
test('image and audio files exist', () => {
  const missing = items.flatMap(i => [i.img, i.audio]).filter(f => f && !fs.existsSync(path.join(ROOT, f)));
  assert.deepEqual(missing, []);
});

// Picking matches by image-filename key, so keys must be unique.
test('item keys are unique', () => {
  const keys = items.map(keyOf);
  assert.equal(new Set(keys).size, keys.length, 'duplicate image names');
});

// Shopping list: 10 unique items.
test('shopping list has 10 unique items', () => {
  const list = generateShoppingList(items);
  assert.equal(new Set(ids(list)).size, 10);
});

// Shelf: 16 unique items = whole shopping list + 6 distractors not on the list.
test('shelf has the shopping list plus 6 distractors', () => {
  const list = generateShoppingList(items);
  const shelf = ids(generateShelf(list, items));
  assert.equal(new Set(shelf).size, 16);
  ids(list).forEach(id => assert.ok(shelf.includes(id), id));
});

// New game state starts at item 0 in mode 1 and is saved.
test('initGameState creates and saves a fresh round', () => {
  store.clear();
  const s = initGameState();
  assert.equal(s.shoppingList.length, 10);
  assert.equal(s.shelf.length, 16);
  assert.deepEqual([s.currentIndex, s.mode, s.finished], [0, 1, false]);
  assert.ok(save.get('game11','game_state'));
});

// Page refresh / mode switch reuses the saved round.
test('saved round is restored', () => {
  store.clear();
  const s = initGameState();
  saveState({ ...s, mode: 2 });
  const again = initGameState();
  assert.deepEqual(ids(again.shoppingList), ids(s.shoppingList));
  assert.equal(again.mode, 2);
});

// Corrupted storage is discarded instead of breaking the game.
test('corrupted saved state is discarded', () => {
  save.set('game11','game_state',{shoppingList:5});
  assert.equal(loadState(), null);
  assert.equal(save.get('game11','game_state'), null);
});

// popup.html's end-screen link must match the real file name (GitHub Pages is case-sensitive).
test('popup links to an existing end screen file', () => {
  const popup = fs.readFileSync(
    path.join(GAME, 'js', 'popup.js'),
    'utf8'
  );

  const match = popup.match(/location\.href\s*=\s*['"]\.\/([^'"]+)['"]/);

  assert.ok(match, 'popup.js does not contain a location.href link');

  const target = match[1];

  assert.ok(
    fs.existsSync(path.join(GAME, 'html', target)),
    `popup opens "${target}", but the file does not exist`
  );
});

// audio is only loaded once per file.
test('audio is cached and plays from the trim point', () => {
  globalThis.Audio = class { load() {} play() { this.played = true; return Promise.resolve(); } };
  window.__game11GameState = { shoppingList: [{ audio: 'a.mp3' }] };

  playCurrentSound();

  const audio = getAudio('a.mp3');

  assert.equal(audio, getAudio('a.mp3'), 'audio not cached');
  assert.ok(audio.played);
  assert.equal(audio.currentTime, AUDIO_START_TRIM);
});

// missing audio shows the error message
test('missing audio shows the error message', () => {
  const msg = { style: {} };

  globalThis.document = { getElementById: id => (id === 'audio-error' ? msg : null) };

  window.__game11GameState = { shoppingList: [{ sv: 'gurka' }] };

  playCurrentSound();

  assert.equal(msg.style.display, 'block');
});
