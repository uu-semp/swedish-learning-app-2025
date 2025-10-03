// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {

  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team14");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team14", data);
  });

})});


// ==============================================

// Helper function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Description generator class
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
    
    // Check if player selected correct clothes
    checkAnswer(playerSelection, correctAnswer) {
        return (
            playerSelection.hatFile === correctAnswer.hatFile &&
            playerSelection.shirtFile === correctAnswer.shirtFile &&
            playerSelection.pantsFile === correctAnswer.pantsFile
        );
    }
}
// Description generator class global instance
window.clothingGenerator = new SwedishClothingDescriptionGenerator(); 

// Swedish clothing generator - creates random outfit descriptions and checks player answers
// Usage: clothingGenerator.generateOutfit() returns {swedish: "text", correctAnswer: {files}}






// fetch description and 'right' clothes to apply
function fetchDescription() {
}

// apply clothes function
function applyClothes(id) {
  // fetch clothes from vocabulary and apply to the character
  //  document.getElementById(id).src
}

// Check clothes function
function checkClothes() {
  // fetch applied clothes and check if user applied the correct clothes
  // just check if 2 sets of clothes id are the same

  // fetch applied clothes ids 
  
  // fetch correct clothes ids from description

  // compare the 2 sets of clothes ids

  // if correct, update score
  // if wrong, give feedback



  // can also update the progress ?
}

// undress area on pelle (and the cloth is going back to the pool)
function undress(id) {
  document.getElementById(id).style.display = "none";
}





/*

Questions for Jacob:
- Descriptions list (json or text or csv)
-> understand the data format for descriptions and actual clothes applied to pelle 

Questions for everyone:
- Who is doing the descriptions database?
  Data format example:
    | -------- | ---------------- | ---------------- |
    | descr_ID | description_text | correct_clothes  | -> should be a list of clothes IDs and be linked to actual images
    | -------- | ---------------- | ---------------- |

  Alternative: 
  just have a images linked to id database and generate a random description and correct clothes algorithmically

  X thsirt and Y trousers 



*/