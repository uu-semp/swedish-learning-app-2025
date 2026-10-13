// ==============================================
// Owned by Game 07
// ==============================================

"use strict";

// Number of rounds in the game, can be changed whenever
// Could also add a button in category, so the user can select the amount of rounds in any given game
const rounds = 5;
const GAME_ID = "game07";

function game_start(category) {
  let ids = [];
  const game_words = [];

  //If the player chooses the mixed option, retreive all categories into one list
  if (category == "mixed") {
    for (const name of ["clothing", "food", "furniture"]) {
      ids = ids.concat(window.vocabulary.get_category(name) || []);
    }
  }
  // Get all the words from the chosen category
  else {
    ids = window.vocabulary.get_category(category) || [];
  }

  ids = [...new Set(ids)];
  if (ids.length < 4) {
    alert("There are not enough words in this category to start a round.");
    return false;
  }

  const targetIds = [...ids];
  let actualRounds = 0;

  // Each round targets a word that has not yet been answered correctly.
  for (let i = 0; i < rounds; i++) {
    const target = window.vocabulary.get_random(GAME_ID, targetIds);
    if (!target) break;

    targetIds.splice(targetIds.indexOf(target.id), 1);
    const distractorIds = ids.filter(id => id !== target.id);
    const correctAnswer = Math.floor(Math.random() * 4);
    const roundWords = [];
    for (let index = 0; index < 4; index++) {
      if (index === correctAnswer) {
        roundWords.push({ ...target, answer: true });
        continue;
      }

      const rand = Math.floor(Math.random() * distractorIds.length);
      const id = distractorIds.splice(rand, 1)[0];
      roundWords.push({ ...window.vocabulary.get_vocab(id), id, answer: false });
    }

    game_words.push(...roundWords);
    actualRounds++;
  }

  if (actualRounds === 0) {
    alert("You have answered all the words in this category correctly.");
    return false;
  }

  // Add per-round score and wrong-answer trackers.
  const highscore = {};
  for (let i = 0; i < actualRounds; i++) {
    highscore["round" + (i + 1)] = 0;
  }
  highscore["total"] = 0;
  game_words.push(highscore);

  const wrong_words = {};
  for (let i = 0; i < actualRounds; i++) {
    wrong_words["round" + (i + 1)] = [];
  }
  wrong_words["all"] = [];
  game_words.push(wrong_words);

  localStorage.setItem('game_words', JSON.stringify(game_words));
  return true;
};

document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("categorybox")){
    window.vocabulary.when_ready(function () {
      document.getElementById("loader").style.display = "none";
      document.querySelector(".categorybox").style.display = "block";
    });
  }

    if (
    document.getElementById("img-1") &&
    document.getElementById("img-2") &&
    document.getElementById("img-3") &&
    document.getElementById("img-4")
  ) {
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
    document.getElementById("img-1"),
    document.getElementById("img-2"),
    document.getElementById("img-3"),
    document.getElementById("img-4"),
  ];

  const nextBtn = document.getElementById("next-button");
  const soundIcon = document.getElementById("sound-icon");
  const audio = document.getElementById("word-audio");
  const audioSrc = document.getElementById("audio-src");

  let words = JSON.parse(localStorage.getItem("game_words") || "[]");
  if (!words.length) {
    console.error("No words");
    return;
  }

  const highscore = words[words.length - 2];
  const totalRounds = Object.keys(highscore).filter(key => key !== "total").length;

  let correctImage = null;
  let currentRound = 0;
  let selectionLock = false; // Lock selection if user has clicked image

  function currentRoundWords(roundNumber) {
    const start = roundNumber * 4;
    return words.slice(start, start + 4);
  }

  function markCorrectAnswer(image) {
    image.classList.add("correct");
  }

  function markIncorrectAnswer(image) {
    image.classList.add("incorrect");
  }

  function clearSelection() {
    document.getElementById("instruction").textContent =
      "Match the image to the sound";
    imageElements.forEach((image) => {
      image.classList.remove("correct", "incorrect");
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
    if (roundNumber === totalRounds - 1) {
      updateNextButtonText("Finish");
    } else {
      updateNextButtonText("Next");
    }
  }

   function revealAnswer(clickedImage) {
        // If locked, do nothing
        if (selectionLock) {
            return;
        }

        selectionLock = true;

        let words = JSON.parse(localStorage.getItem('game_words') || '[]');
        let highscore = words[words.length - 2]; // last element is the highscore object
        let wrong_words = words[words.length - 1]; // last = wrong words
        const wordSet = currentRoundWords(currentRound); // get current round's 4 words
        const correctAnswer = wordSet.find((word) => word.answer === true);
  
        imageElements.forEach((image, index) => {
            const word = wordSet[index]; // ✅ this defines the word for each image
            
            if (image === correctImage) {
              markCorrectAnswer(image);
            } 
      
            if (image === clickedImage && image === correctImage) {
                document.getElementById('instruction').textContent = 
                    "Correct answer! The correct answer was: " + correctAnswer.sv;
                window.vocabulary.mark_correct(GAME_ID, correctAnswer.id);
                // Update high score  
                highscore["round" + (currentRound + 1)] += 1;
                highscore["total"] += 1;
            } else if (image === clickedImage && image !== correctImage) {
                document.getElementById('instruction').textContent =
                    "Wrong answer! The correct answer was: " + correctAnswer.sv;
                markIncorrectAnswer(image);
                 // Add wrong word to tracking
                wrong_words["round" + (currentRound + 1)].push(word);
                wrong_words["all"].push(word);
            }
        });

        // Save updated data in local storage
        words[words.length - 2] = highscore;
        words[words.length - 1] = wrong_words;
        localStorage.setItem('game_words', JSON.stringify(words));
    }

  imageElements.forEach((image) => {
    image.addEventListener("click", () => {
      revealAnswer(image);
    });
  });

  nextBtn.addEventListener("click", () => {
    if (!selectionLock) {
      return;
    }
    if (currentRound < totalRounds - 1) {
      currentRound++;
      startNewRound(currentRound);
    } else {
      // Game finished
      window.location.href = "results-page.html";
    }
  });

  soundIcon.addEventListener("click", () => {
    // TODO: Does not work yet, there is no sound played when clicking
    const wordSet = currentRoundWords(currentRound);
    const correctAnswer = wordSet.find((word) => word.answer === true);
    audioSrc.src = "../" + correctAnswer.audio;
    audio.load();
    audio.play();
  });

  // First round
  startNewRound(currentRound);
}
