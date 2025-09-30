// ==============================================
// Owned by Team 07
// ==============================================

"use strict";


let fake_words = [
    { en: 'cap', sv: 'keps', sv_pl: 'kepsar', article: 'en', img: 'assets/test.png' },
    { en: 'ring', sv: 'ring', sv_pl: 'ringar', article: 'en', img: 'assets/test.png' },
    { en: 'dress', sv: 'klänning', sv_pl: 'klänningar', article: 'en', img: 'assets/test.png' },
    { en: 'blouse', sv: 'blus', sv_pl: 'blusar', article: 'en', img: 'assets/test.png' }
];

localStorage.setItem('fake_words', JSON.stringify(fake_words));


function game_start(category) {
    // Get all the words from the chosen category
    const ids = window.vocabulary.get_category(category);
    const answer = Math.floor(Math.random() * 4) + 1;
    console.log("Answer is: ", answer);
    const game_words = [];

    // Pick four random words from the category
    for (let i = 0; i < 4; i++) {
        //Generate a random word from the category
        const rand = Math.floor(Math.random() * ids.length);
        const generated_word = window.vocabulary.get_vocab(ids[rand]);

        // If this word matches the random answer number, mark it as the answer, else mark it as false
        if (i == answer - 1)
            generated_word["answer"] = true;
        else
            generated_word["answer"] = false;

        game_words.push(generated_word);
        ids.pop(rand);
    }

    // Add a highscore object to the end of the array for tracking the score
    var highscore = {
        round1: 0,
        round2: 0,
        round3: 0,
        round4: 0,
        total: 0
    }
    game_words.push(highscore);

    // Put the chosen words in local storage
    localStorage.setItem('game_words', JSON.stringify(game_words));
};
