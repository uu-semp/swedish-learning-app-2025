// Shuffle a copy of the array without changing the original
export function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export async function setUpLevel(numQuestions = 10) {
  // Load street data
  const response = await fetch("./assets/game15_vocab.json");

  if (!response.ok) {
    throw new Error("Could not load street data");
  }

  const data = await response.json();

  // Collect all houses and add their street names
  const availableHouses = Object.entries(data).flatMap(
    ([streetName, houses]) =>
      houses.map(house => ({
        ...house,
        streetName
      }))
  );

  // Select houses for the questions
  const streets = shuffle(availableHouses).slice(0, numQuestions);

  return { streets, allData: data };
}

export function randomizeHouseNumbers(houses) {
  // Get all street names
  const streetNames = [...new Set(houses.map(house => house.street))];

  // Shuffle address numbers within each street
  for (const street of streetNames) {
    const streetHouses = houses.filter(house => house.street === street);

    const numbers = shuffle(
      streetHouses.map(house => house.number.cardinal)
    );

    // Keep ordinal numbers attached to their original house positions
    streetHouses.forEach((house, index) => {
      house.number = {
        ...house.number,
        cardinal: numbers[index]
      };
    });
  }
}