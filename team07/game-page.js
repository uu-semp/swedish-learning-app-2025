// ==============================================
// Owned by Team 07
// ==============================================

"use strict";

// Number of rounds in the game, can be changed whenever
// Could also add a button in category, so the user can select the amount of rounds in any given game
const rounds = 2;

function game_start(category) {
    var ids = []
    const game_words = [];

    //If the player chooses the mixed option, retreive all categories into one list
    if (category == "mixed") {
        const clothing = window.vocabulary.get_category("clothing");
        const food = window.vocabulary.get_category("food");
        const furniture = window.vocabulary.get_category("furniture");
        ids = ids.concat(clothing, food, furniture);
    }
    // Get all the words from the chosen category
    else {
        ids = window.vocabulary.get_category(category);
    }

    //Loop through once for each round
    for (let i = 0; i < rounds; i++) {
        // Generate a random number between 1 and 4, this will be the answer for that round
        const answer = Math.floor(Math.random() * 4) + 1;
        console.log("Answer for round " + (i + 1) + " is word number " + answer);

        // Pick four random words from the ids array
        for (let j = 0; j < 4; j++) {
            //Generate a random word from the array
            const rand = Math.floor(Math.random() * ids.length);
            const generated_word = window.vocabulary.get_vocab(ids[rand]);

            // If this word matches the random answer number, mark it as the answer, else mark it as false
            if (j == answer - 1)
                generated_word["answer"] = true;
            else
                generated_word["answer"] = false;

            game_words.push(generated_word);
            ids.pop(rand);
        }
    }

    // Add a highscore object to the end of the array for tracking the score
    // Depending on the number of rounds, will add that many items that track the score for that particular round
    var highscore = {};
    for (let i = 0; i < rounds; i++) {
        highscore["round" + (i + 1)] = 0;
    };
    highscore["total"] = 0;
    game_words.push(highscore);


    // Put the chosen words in local storage
    localStorage.setItem('game_words', JSON.stringify(game_words));
};
