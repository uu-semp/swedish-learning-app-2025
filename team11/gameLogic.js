
// import data
import { getItemsIds } from './data.js';

// Generates an array with size number_of_items with random words
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

// define constants
const ROUND_SIZE = 10;
const DISTRACTOR_COUNT = 6;
const STORAGE_KEY = 'team11_game_state';

/*
//Validation we can add later if we want
export function generateList(number_of_items, array) {
  //check if array is valid
  if (!Array.isArray(array) || array.length === 0) {
    console.error("genrateList: Invalid array provided");
    return [];
  }


*/

//generate shopping list with 10 random food items
export function generateShoppingList(allItems, listSize = ROUND_SIZE) {
  // validate that we have enough items to generate the list
  if (!allItems || allItems.length < listSize) {
    console.error("generateShoppingList: Not enough items to generate the list");
    return [];
  }
  return generateList(listSize, allItems);
}

// Generate shelf items including distractors shuffled
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

function evaluateChoice(state, chosenWord) {
  const target = state.shoppingList[state.currentIndex];
  if (!state.mistakes[target]) state.mistakes[target] = 0;

    if (chosenWord === target) {
      const firstTry = state.mistakes[target] === 0;
      state.correctFirstTry.push(firstTry);

      state.currentIndex++;
      if (state.currentIndex >= state.shoppingList.length) {
        state.finished = true;
      }
      return {correct: true, firstTry};
    } else {
      state.mistakes[target] ++;
      return {correct: false};
    }
  }


function calculateResult(state) {
  const correctOnFirst = state.correctFirstTry.filter(v => v).length;
  const win = correctOnFirst >= Math.ceil(ROUND_SIZE * 0.8);
  return { win, correctOnFirst };
}

export { evaluateChoice, calculateResult };
