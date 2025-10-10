export async function setUpLevel(numQuestions = 10) {
  try {
    const response = await fetch("./assets/team16_vocab.json");
    const data = await response.json();

    console.log("Loaded street data:", data);

    // all the valid house numbers from the map
    const validHouseNumbers = [
      1, 2, 3, 4, 5, 6, 7,           // Ringgatan
      11, 12, 13, 14, 15, 20,        // Skolgatan
      20, 22, 24, 25, 28, 29, 31     // Parkvägen
    ];

    const selectedNumbers = [];
    while (selectedNumbers.length < Math.min(numQuestions, validHouseNumbers.length)) {
      const randomIndex = Math.floor(Math.random() * validHouseNumbers.length);
      const houseNumber = validHouseNumbers[randomIndex];
      
      if (!selectedNumbers.includes(houseNumber)) {
        selectedNumbers.push(houseNumber);
      }
    }

    const streets = selectedNumbers.map((num) => getStreetInfo(num, data)).filter(s => s !== null);
    console.log("Selected streets:", streets);
    return { streets, allData: data };
  } catch (error) {
    console.error("Error loading level data:", error);
    throw error;
  }
}

export function getStreetInfo(houseNumber, data) {
  // Check Ringgatan (house numbers 1-7)
  if (houseNumber >= 1 && houseNumber <= 7) {
    const house = data["Ringgatan"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Ringgatan" } : null;
  }
  
  // Check Skolgatan (house numbers 11-15, 20)
  const skolgatan = [11, 12, 13, 14, 15, 20];
  if (skolgatan.includes(houseNumber)) {
    const house = data["Skolgatan"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Skolgatan" } : null;
  }
  
  // Check Parkvägen (house numbers 20, 22, 24-25, 28-29, 31)
  const parkvagen = [20, 22, 24, 25, 28, 29, 31];
  if (parkvagen.includes(houseNumber)) {
    const house = data["Parkvägen"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Parkvägen" } : null;
  }
  
  return null; // if the house number does not exist
}