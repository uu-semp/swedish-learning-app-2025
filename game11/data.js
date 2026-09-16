// Returns an array with all ids for this teams items.
export function getItemsIds() {
  // Exclude some ids that are not food/fruits that you can buy in a grocery store
  // which is : breakfast, dinner, food, fruit, lunch, vegan, vegetarian
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

// Returns an array of Items.
// Returns an array of Items.
export function getItems() {
  const items = [];
  const ids = getItemsIds();
  ids.forEach(id => {
    const v = window.vocabulary.get_vocab(id);
    if (v) {
      // Attach the id so downstream UI/logic can use it
      items.push({ id, ...v });
    }
  });
  return items;

}
