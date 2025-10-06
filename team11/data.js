// Returns an array with all ids for this teams items.
function getItemsIds() {
  const Ids = [];
  const foods = window.vocabulary.get_category("food") || [];
  const fruits = window.vocabulary.get_category("fruit") || [];
  foods.map(id => {
    Ids.push(id);
  })
  fruits.map(id => {
    Ids.push(id);
  })
  return Ids;
}

// Returns an array of Items.
export function getItems() {
  const items = []
  const ids = getItemsIds();
  ids.map(id => {
    items.push(window.vocabulary.get_vocab(id))
  })
  return items;

}
