//This file contains functions to get the grocery items from the vocabulary data.

/**
 * Gets the IDs of valid grocery items from the food and fruit categories.
 * Exclude some ids that are not food/fruits that you can buy in a grocery store
 * which is : breakfast, dinner, food, fruit, lunch, vegan, vegetarian
 * @returns {string[]} An array of item IDs that can be used in the game.
 */
export function getItemsIds() {
  const excludedIds = ["567f323c", "2f373051","32191560", "440d3157", "75387a51", "19263071", "6a701276"];
  const Ids = [];
  const foods = window.vocabulary.get_category("food") || [];
  const fruits = window.vocabulary.get_category("fruit") || [];
  foods.map(id => {
    if (!excludedIds.includes(id)) {
          Ids.push(id);
      }
  })
  fruits.map(id => {
    if (!excludedIds.includes(id)) {
          Ids.push(id);
      }
  })
  return Ids;
}



/**
 * Gets the vocabulary data for all valid grocery items
 * @returns {Object[]} An array of grocery item objects containing their IDs and vocabulary data.
 */
export function getItems() {
  const items = [];
  const ids = getItemsIds();
  ids.forEach(id => {
    const v = window.vocabulary.get_vocab(id);
    if (v) {
      items.push({ id, ...v });
    }
  });
  return items;

}
