import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, randomizeHouseNumbers } from '../setUpLevels.js';
import { getGameProgress, updateGameProgress } from '../localStorage.js';

// Run with: 
// node --test game15/tests/game15_test.mjs

// Fake save system so localStorage.js works outside the browser
function fakeSave() {
  const store = {};
  globalThis.window = {
    save: {
      get: key => store[key],
      set: (key, value) => { store[key] = value; }
    }
  };
}

test('shuffle keeps the same items', () => {
  const result = shuffle([1, 2, 3, 4, 5]);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
});

test('shuffle does not change the original array', () => {
  const input = [1, 2, 3];
  shuffle(input);
  assert.deepEqual(input, [1, 2, 3]);
});

test('randomizeHouseNumbers keeps numbers on the same street', () => {
  const houses = [
    { street: 'Skolgatan', number: { cardinal: { literal: '1' } } },
    { street: 'Skolgatan', number: { cardinal: { literal: '2' } } },
    { street: 'Ringgatan', number: { cardinal: { literal: '9' } } }
  ];
  randomizeHouseNumbers(houses);

  const skolgatan = houses
    .filter(h => h.street === 'Skolgatan')
    .map(h => h.number.cardinal.literal)
    .sort();
  assert.deepEqual(skolgatan, ['1', '2']);
  assert.equal(houses[2].number.cardinal.literal, '9');
});

test('getGameProgress creates default progress for a new player', () => {
  fakeSave();
  const progress = getGameProgress();
  assert.equal(progress.level1.completed, 0);
  assert.equal(progress.level3.total, 10);
});

test('getGameProgress returns saved progress', () => {
  fakeSave();
  updateGameProgress({ level1: { completed: 4 }, level2: {}, level3: {} });
  assert.equal(getGameProgress().level1.completed, 4);
});
