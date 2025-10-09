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

        this.hats = [ // list of hats
            { file: 'BlåMössa.png', swedish: 'blå mössa', english: 'blue hat' },
            { file: 'RödMössa.png', swedish: 'röd mössa', english: 'red hat' },
            { file: 'TurkosMössa.png', swedish: 'turkos mössa', english: 'turquoise hat' },
            { file: 'GulOchGrönKeps.png', swedish: 'gul och grön keps', english: 'yellow and green cap' },
            { file: 'RosaOchLilaKeps.png', swedish: 'rosa och lila keps', english: 'pink and purple cap' },
            { file: 'RödOchBlåKeps.png', swedish: 'röd och blå keps', english: 'red and blue cap' }
        ];
        
        this.shirts = [ // list of shirts
            { file: 'GråOchBeigeTröja.png', swedish: 'grå och beige tröja', english: 'gray and beige shirt' },
            { file: 'GrönOchBeigeTröja.png', swedish: 'grön och beige tröja', english: 'green and beige shirt' },
            { file: 'LilaOchBeigeTröja.png', swedish: 'lila och beige tröja', english: 'purple and beige shirt' },
            { file: 'BrunOchGul.png', swedish: 'brun och gul tröja', english: 'brown and yellow shirt' },
            { file: 'LilaOchGul.png', swedish: 'lila och gul tröja', english: 'purple and yellow shirt' },
            { file: 'RödOchGul.png', swedish: 'röd och gul tröja', english: 'red and yellow shirt' }
        ];
        
        this.pants = [ // list of pants
            { file: 'BlåaJeans.png', swedish: 'blåa jeans', english: 'blue jeans' },
            { file: 'GråaJeans.png', swedish: 'gråa jeans', english: 'gray jeans' },
            { file: 'SvartaJeans.png', swedish: 'svarta jeans', english: 'black jeans' },
            { file: 'VitaByxor.png', swedish: 'vita byxor', english: 'white pants' },
            { file: 'GrönaByxor.png', swedish: 'gröna byxor', english: 'green pants' },
            { file: 'OrangeByxor.png', swedish: 'orange byxor', english: 'orange pants' }
        ];
    }
    

    // Generate outfit for game
    generateOutfit() {
        // Head
        const hat = getRandomItem(this.hats);
        
        // Torso  
        const shirt = getRandomItem(this.shirts);
        
        // Legs
        const pants = getRandomItem(this.pants);

        // Merge description
        const swedishText = `${hat.swedish}, ${shirt.swedish}, ${pants.swedish}`;
        const englishText = `${hat.english}, ${shirt.english}, ${pants.english}`;
        
        return {
            // Text for player to see
            swedish: swedishText,
            english: englishText,
            
            // Answer keys for game to check
            correctAnswer: {
                hatFile: hat.file,
                shirtFile: shirt.file,
                pantsFile: pants.file
            },
            
            // Full items (if needed)
            items: {
                hat: hat,
                shirt: shirt, 
                pants: pants
            }
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