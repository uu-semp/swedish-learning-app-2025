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
        const correct_answer = Math.floor(Math.random() * 4) + 1;

        // Pick four random words from the ids array
        for (let j = 0; j < 4; j++) {
            //Generate a random word from the array
            const rand = Math.floor(Math.random() * ids.length);
            const generated_word = window.vocabulary.get_vocab(ids[rand]);

            // If this word matches the random answer number, mark it as the answer, else mark it as false
            if (j == correct_answer - 1)
                generated_word["answer"] = true;
            else
                generated_word["answer"] = false;

            game_words.push(generated_word);
            ids.splice(rand, 1);
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('img-1') && document.getElementById('img-2')
        && document.getElementById('img-3') && document.getElementById('img-4')) {

        startGame();
    } else {
        console.error("Game images missing");
    }
});

function startGame() {
    gameplay();
}

function gameplay() {
    const imageElements = [
        document.getElementById('img-1'),
        document.getElementById('img-2'),
        document.getElementById('img-3'),
        document.getElementById('img-4')
    ];

    const nextBtn = document.getElementById('next-button');
    const soundIcon = document.getElementById('sound-icon');
    const audio = document.getElementById('word-audio');
    const audioSrc = document.getElementById('audio-src');

    let words = JSON.parse(localStorage.getItem('game_words') || '[]');
    if (!words.length) {
        console.error("No words");
        return;
    }

    let correctImage = null;
    let currentRound = 0;
    let selectionLock = false; // Lock selection if user has clicked image

    function currentRoundWords(roundNumber) {
        const start = roundNumber * 4;
        return words.slice(start, start + 4);
    }

    function markCorrectAnswer(image) {
        image.classList.add('correct');
    }

    function markIncorrectAnswer(image) {
        image.classList.add('incorrect');
    }

    function clearSelection() {
        document.getElementById('instruction').textContent = "Match the image to the sound";
        imageElements.forEach(image => {
            image.classList.remove('correct', 'incorrect');
        });
        selectionLock = false;
    }

    function updateNextButtonText(text) {
        nextBtn.textContent = text;
    }

    function startNewRound(roundNumber) {
        clearSelection();
        const wordSet = currentRoundWords(roundNumber);

        wordSet.forEach((word, index) => {
            const image = imageElements[index];
            image.src = "../" + word.img;
            if (word.answer) {
                correctImage = image;
            }
        });

        // Update Next button text if current round number is same as total amount of rounds
        if (roundNumber === rounds - 1) {
            updateNextButtonText('Finish');
        } else {
            updateNextButtonText('Next');
        }
    }

    function revealAnswer(clickedImage) {
        // If locked, do nothing
        if (selectionLock) {
            return;
        }

        selectionLock = true;

        imageElements.forEach((image) => {
            if (image === correctImage) {
                markCorrectAnswer(image);
            } else {
                markIncorrectAnswer(image);
            }
            if (image === clickedImage && image === correctImage) {
                document.getElementById('instruction').textContent = "Correct answer!";
                // TODO: Update high score  
                let words = JSON.parse(localStorage.getItem('game_words') || '[]');
                let highscore = words[words.length - 1]; // last element is the highscore object

                highscore["round" + (currentRound + 1)] += 1;
                highscore["total"] += 1;

                // Save it back
                words[words.length - 1] = highscore;
                localStorage.setItem('game_words', JSON.stringify(words));

            } else if (image === clickedImage && image !== correctImage) {
                document.getElementById('instruction').textContent = "Wrong answer!";

            }
        });
    }

    imageElements.forEach(image => {
        image.addEventListener('click', () => {
            revealAnswer(image);
        });
    });

    nextBtn.addEventListener('click', () => {
        if (!selectionLock) {
            return;
        }
        if (currentRound < rounds - 1) {
            currentRound++;
            startNewRound(currentRound);
        } else {
            // Game finished
            window.location.href = 'results-page.html';
        }
    });

    soundIcon.addEventListener('click', () => {
        // TODO: Does not work yet, there is no sound played when clicking
        const wordSet = currentRoundWords(currentRound);
        const correctAnswer = wordSet.find(word => word.answer === true);
        audioSrc.src = "../" + correctAnswer.audio;
        audio.load();
        audio.play();
    });

    // First round
    startNewRound(currentRound);
}

