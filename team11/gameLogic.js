

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