// This file contains the game logic for the grocery game.
// It includes functions to generate the shopping list, shelf items, 
// evaluate user choices, and calculate the final result.
import { getItemsIds } from './data.js';

// Number of items in each round.
const ROUND_SIZE = 10;
// Number of additional items shown as distractors.
const DISTRACTOR_COUNT = 6;
// Key used to store the current game state.
const STORAGE_KEY = 'game11_game_state';



/**
 * Generates a random list of items from an array.
 *
 * @param {number} number_of_items - The number of items to include in the list.
 * @param {Array} array - The array of items to choose from.
 * @returns {Array} An array containing the requested number of randomly selected items.
 */
export function generateList(number_of_items, array) {
    // copy of the array
  const arr = array.slice();
  // Shuffle the order
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // take the first number_of_items
  return arr.slice(0, number_of_items);
}



/**
 * Generates a random shopping list from the available items.
 *
 * @param {Array} allItems - The available grocery items.
 * @param {number} listSize - The number of items in the shopping list.
 * @returns {Array} A randomly generated shopping list, or an empty array if there are not enough items.
 */
export function generateShoppingList(allItems, listSize = ROUND_SIZE) {
  // validate that we have enough items to generate the list
  if (!allItems || allItems.length < listSize) {
    console.error("generateShoppingList: Not enough items to generate the list");
    return [];
  }
  return generateList(listSize, allItems);
}



/**
 * Generates the items displayed on the shelf.
 *
 * @param {Array} shoppingList - The items that the player needs to find.
 * @param {Array} allItems - All available grocery items.
 * @param {number} distractorCount - The number of additional items to display.
 * @returns {Array} A shuffled array containing the shopping list items and distractors.
 */
export function generateShelf(shoppingList, allItems, distractorCount = DISTRACTOR_COUNT) {
  // validate that we have a valid shopping list
  if (!shoppingList || shoppingList.length === 0) {
    console.error('generateShelf: Invalid shopping list');
    return [];
  }
  
 
  //ID for items in the shopping list
  const shoppingListIds = shoppingList.map(item => item.id);
  
  //Items which can be distractors
  const availableDistractors = allItems.filter(item => !shoppingListIds.includes(item.id));
  
  // Generate distractors
  const distractors = generateList(distractorCount, availableDistractors);
  
  // Combine shopping list items with distractors
  const shelfItems = [...shoppingList, ...distractors];
  
  // Shuffle the array using generateList
  return generateList(shelfItems.length, shelfItems);
}



/**
 * Evaluates the user's choice against the target item.
 *
 * @param {Object} state - The current game state.
 * @param {string} chosenWord - The word chosen by the user.
 * @returns {Object} An object indicating whether the choice was correct and if it was on the first try.
 */
function evaluateChoice(state, chosenWord) {
  const target = state.shoppingList[state.currentIndex];
  if (!state.mistakes[target]) state.mistakes[target] = 0;

    if (chosenWord === target) {
      // Check whether the user selected the correct item on their first attempt.
      const firstTry = state.mistakes[target] === 0;
      // Store whether the item was answered correctly on the first attempt.
      state.correctFirstTry.push(firstTry);
      
      // curretIndecx = Position in the shopping list the player is currently working on.
      state.currentIndex++;
      // Mark the game as finished when all items have been completed.
      if (state.currentIndex >= state.shoppingList.length) {
        state.finished = true;
      }
      return {correct: true, firstTry};
    } else {
      state.mistakes[target] ++;
      return {correct: false};
  }
}



/**
 * Calculates the result of the game based on the player's performance.
 *
 * @param {Object} state - The current game state.
 * @returns {Object} An object containing the win status and the number of correct first tries.
 */
function calculateResult(state) {
  const correctOnFirst = state.correctFirstTry.filter(v => v).length;
  // The player wins if they answered at least 80% of the items correctly on the first try.
  const win = correctOnFirst >= Math.ceil(ROUND_SIZE * 0.8);
  return { win, correctOnFirst };
}

export { evaluateChoice, calculateResult };
