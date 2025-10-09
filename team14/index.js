// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

// ==============================================

// Helper function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}


// Swedish clothing generator - creates random outfit descriptions and checks player answers
  // Usage: clothingGenerator.generateOutfit() returns {swedish: "text", correctAnswer: {files}}
class SwedishClothingDescriptionGenerator {
  constructor() {
    this.hats = [];
    this.shirts = [];
    this.pants = [];
    this.extraCategories = {};
    this.requiredCategories = ["hat", "shirt", "pants"];
    this.descriptionPrefixes = [
      "Idag tar Pelle på sig",
      "Kläderna Pelle har valt idag är",
      "Pelle bestämde sig för att bära",
      "Den här dagen klär sig Pelle i",
      "Pelle valde följande kläder idag"
    ];
    this.isLoaded = false;
    this.loadPromise = this.loadFromCSV();
  }

  async loadFromCSV() {
    try {
  const response = await fetch("./clothing_database.csv");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const csvText = await response.text();
      const lines = csvText.split("\n");

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(",").map(part => part.trim());
        if (parts.length < 4) continue;

        const item = {
          file: parts[0],
          swedish: parts[1],
          english: parts[2],
          category: parts[3]
        };

        if (item.category === "hat") {
          this.hats.push(item);
        } else if (item.category === "shirt") {
          this.shirts.push(item);
        } else if (item.category === "pants") {
          this.pants.push(item);
        } else {
          if (!this.extraCategories[item.category]) {
            this.extraCategories[item.category] = [];
          }
          this.extraCategories[item.category].push(item);
        }
      }

      this.isLoaded = true;
      console.log("Clothing database loaded", {
        hats: this.hats.length,
        shirts: this.shirts.length,
        pants: this.pants.length
      });
    } catch (error) {
      console.error("Failed to load clothing_database.csv", error);
    }
  }

  // Generate outfit for game
  generateOutfit() {
    if (!this.isLoaded) {
      console.warn("Clothing data not ready yet. Call generateOutfit after loadPromise resolves.");
      return null;
    }

    const categoryPools = {
      hat: this.hats,
      shirt: this.shirts,
      pants: this.pants,
      ...this.extraCategories
    };

    const selectedItems = {};
    const missingCategory = this.requiredCategories.find(category => {
      const pool = categoryPools[category] ?? [];
      if (!Array.isArray(pool) || pool.length === 0) {
        console.error(`Missing clothing data for category: ${category}`);
        return true;
      }

      selectedItems[category] = getRandomItem(pool);
      return false;
    });

    if (missingCategory) {
      return null;
    }

    const prefix = getRandomItem(this.descriptionPrefixes);
    const swedishList = this.requiredCategories.map(category => selectedItems[category].swedish);
    const englishList = this.requiredCategories.map(category => selectedItems[category].english);

    const swedishText = `${prefix} ${swedishList.join(', ')}.`;
    const englishText = `Today Pelle is wearing ${englishList.join(', ')}.`;

    const assetFiles = this.requiredCategories.map(category => selectedItems[category].file);
    const byCategory = this.requiredCategories.reduce((acc, category) => {
      acc[category] = selectedItems[category].file;
      return acc;
    }, {});

    const items = this.requiredCategories.reduce((acc, category) => {
      acc[category] = selectedItems[category];
      return acc;
    }, {});

    const correctAnswer = {
      filenames: assetFiles,
      byCategory
    };

    if (byCategory.hat) correctAnswer.hatFile = byCategory.hat;
    if (byCategory.shirt) correctAnswer.shirtFile = byCategory.shirt;
    if (byCategory.pants) correctAnswer.pantsFile = byCategory.pants;

    return {
      swedish: swedishText,
      english: englishText,
      assets: assetFiles,
      correctAnswer,
      items
    };
  }
}

// Description generator class global instance
window.clothingGenerator = new SwedishClothingDescriptionGenerator(); 


// apply clothes function
function applyClothes(id) {
}

// Check clothes function
function checkClothes(correctClothesIds, appliedClothesIds) {
  // Simple comparison of two arrays of clothes IDs
  if (!Array.isArray(correctClothesIds) || !Array.isArray(appliedClothesIds)) {
    return false;
  }

  // Sort both arrays to ignore order
  const sortedCorrect = [...correctClothesIds].sort();
  const sortedApplied = [...appliedClothesIds].sort();

  // Example: sort(['RödMössa.png', 'BlåaJeans.png', 'GråOchBeigeTröja.png']) 
  // becomes ['BlåaJeans.png', 'GråOchBeigeTröja.png', 'RödMössa.png']
  // in this way we can compare arrays without caring the area of the body

  // Check if arrays match
  const isCorrect = sortedCorrect.length === sortedApplied.length && 
                   sortedCorrect.every((id, index) => id === sortedApplied[index]);

  return isCorrect;
}

// undress area on pelle (and the cloth is going back to the pool)
function undress(id) {
  document.getElementById(id).style.display = "none";
}





/*
  Alternative: 
  just have a images linked to id database and generate a random description and correct clothes algorithmically

  X thsirt and Y trousers 

*/