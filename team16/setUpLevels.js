export async function setUpLevel(numQuestions = 10) {
  try {
    const response = await fetch("./assets/team16_vocab.json");
    const data = await response.json();

    console.log("Loaded street data:", data);

    // All valid house numbers from the map
    const validHouseNumbers = [
      1, 2, 3, 4, 5, 6, 7,           // Ringgatan
      11, 12, 13, 14, 15, 20,        // Skolgatan
      21, 22, 24, 25, 28, 29, 31     // Parkvägen
    ];

    const shuffled = [...validHouseNumbers].sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, Math.min(numQuestions, validHouseNumbers.length));

    console.log('Selected house numbers:', selectedNumbers);

    const streets = selectedNumbers
      .map((num) => getStreetInfo(num, data))
      .filter(s => s !== null);
    
    console.log("Selected streets:", streets);
    
    if (streets.length < numQuestions) {
      console.warn(`Warning: Only found ${streets.length} valid streets out of ${numQuestions} requested`);
    }
    
    return { streets, allData: data };
  } catch (error) {
    console.error("Error loading level data:", error);
    throw error;
  }
}

export function getStreetInfo(houseNumber, data) {
    
  // Check Ringgatan
  if (houseNumber >= 1 && houseNumber <= 7) {
    const house = data["Ringgatan"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Ringgatan" } : null;
  }
  
  // Check Skolgatan
  const skolgatan = [11, 12, 13, 14, 15, 20];
  if (skolgatan.includes(houseNumber)) {
    const house = data["Skolgatan"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Skolgatan" } : null;
  }
  
  // Check Parkvägen
  const parkvagen = [21, 22, 24, 25, 28, 29, 31];
  if (parkvagen.includes(houseNumber)) {
    const house = data["Parkvägen"].find(h => h.number.cardinal.literal === String(houseNumber));
    return house ? { ...house, streetName: "Parkvägen" } : null;
  }
  
  return null; // House number doesn't exist
}