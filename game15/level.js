"use strict";

import {
  setUpLevel,
  randomizeHouseNumbers
} from './setUpLevels.js';
import { getGameProgress, updateGameProgress } from './localStorage.js';

$(function() {
  initializeGame();
});

async function initializeGame() {
  try {
    const { streets, allData } = await setUpLevel(10);
    
    const allHouses = createHousesArray(allData);
    
    new Vue({
      el: '#app',
      data: {
        character: { name: 'Kevin' },
        score: 0, 
        level: 1,
        textAnswer: "",
        currentQuestion: null,
        remainingQuestions: [],
        translation: "",
        feedback: "",
        feedbackClass: "",
        hoveredHouse: null,
        houses: allHouses,
        levelStreets: streets,
        questions: {},
        allStreetData: allData,
        startTime: Date.now(),
        correctAnswersThisLevel: 0
      },

      created() { 
        console.log('Vue instance created, generating questions...');
        this.questions = this.generateQuestions();
        
        const selectedLevel = window.save.get("game15", "selectedLevel") || 1;
        console.log('Selected level from storage:', selectedLevel);
        // Restore saved progress when loading the page
        this.startLevel(selectedLevel, true);
      },

      methods: {
        generateQuestions() {
          const questions = {};

          // Prepare the question list for each level
          for (const level of [1, 2, 3]) {
            questions[level] = this.levelStreets.map(streetInfo =>
              this.createQuestion(streetInfo, level)
            );
          }

          return questions;
        },

        createQuestion(streetInfo, level) {
          const cardinalNumber = streetInfo.number.cardinal.sv;

          // Level 1: Find the house by its address number
          if (level === 1) {
            return {
              instruction: `Jag bor på ${streetInfo.streetName} ${cardinalNumber}`,
              correct: {
                street: streetInfo.streetName,
                number: streetInfo.number.cardinal.literal
              },
              type: "map",
              streetInfo
            };
          }

          // Level 2: Find the house by its position on the street
          if (level === 2) {
            const ordinalNumber = streetInfo.number.ordinal.sv;

            return {
              instruction: `Jag bor i det ${ordinalNumber} huset på ${streetInfo.streetName}`,
              correct: {
                street: streetInfo.streetName,
                number: streetInfo.number.cardinal.literal
              },
              type: "map",
              streetInfo
            };
          }

          // Level 3: Spell the address number of the indicated house
          const colorSv = streetInfo.color.sv;

          return {
            instruction: `Jag bor i det ${colorSv}a huset på ${streetInfo.streetName}. Stava ut min adress.`,
            correct: `${streetInfo.streetName.toLowerCase()} ${cardinalNumber}`,
            type: "text",
            target: streetInfo,
            streetInfo
          };
        },

        startLevel(lv, resume = false) {
          console.log(`Starting level ${lv}...`);

          const gameProgress = getGameProgress();
          const savedCompleted = gameProgress[`level${lv}`].completed;

          this.level = lv;
          this.startTime = Date.now();

          // Resume unfinished levels; completed levels start a new round
          this.correctAnswersThisLevel =
            resume && savedCompleted < 10 ? savedCompleted : 0;

          // Restore the score after a page refresh
          if (resume) {
            this.score = savedCompleted < 10
              ? (gameProgress.score ?? this.correctAnswersThisLevel * 10)
              : 0;
          }

          // Remember the current level, including automatic level changes
          window.save.set("game15", "selectedLevel", lv);

          this.remainingQuestions = [...this.questions[lv]];
          this.pickNextQuestion();
        },

        pickNextQuestion() {
          this.translation = "";
          this.feedback = "";
          this.feedbackClass = "";
          this.hoveredHouse = null;

          if (this.correctAnswersThisLevel >= 10) {
            console.log(`Level ${this.level} complete with ${this.correctAnswersThisLevel} correct answers!`);
            this.completeLevel();
            return;
          }

          if (this.remainingQuestions.length > 0) {
            // Select the house for the next question
            const i = Math.floor(Math.random() * this.remainingQuestions.length);
            const selectedQuestion = this.remainingQuestions.splice(i, 1)[0];

            // Assign new address numbers before displaying the question
            randomizeHouseNumbers(this.houses);

            // Find the selected house by its street and fixed position
            const selectedHouse = this.houses.find(house =>
              house.street === selectedQuestion.streetInfo.streetName &&
              house.position === selectedQuestion.streetInfo.coords.position
            );

            // Use the house's updated number when creating the question
            const streetInfo = {
              ...selectedHouse,
              streetName: selectedHouse.street
            };

            this.currentQuestion = this.createQuestion(streetInfo, this.level);
            this.textAnswer = "";
          } else {
            console.log(`Reloading questions. Progress: ${this.correctAnswersThisLevel}/10`);
            this.feedback = `Du har svarat på ${this.correctAnswersThisLevel}/10 frågor. Fortsätt spela!`;
            this.feedbackClass = "correct";
            
            setTimeout(() => {
              this.remainingQuestions = [...this.questions[this.level]];
              this.pickNextQuestion();
            }, 2000);
          }
        },

        completeLevel() {
          if (this.level < 3) {
            this.feedback = `🎉 Du klarade nivå ${this.level}! Bra jobbat 👏`;
            this.feedbackClass = "correct";
            
            setTimeout(() => {
              this.startTime = Date.now();
              this.startLevel(this.level + 1);
            }, 2000);
          } else {
            this.feedback = "🏆 Du har klarat alla nivåer! Fantastiskt 🎉";
            this.feedbackClass = "correct";
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 3000);
          }
        },

        updateGameProgressMethod() {
          const gameProgress = getGameProgress();
          const levelKey = `level${this.level}`;
          const levelCompleted = this.correctAnswersThisLevel >= 10;
          
          gameProgress[levelKey].completed = this.correctAnswersThisLevel;
          // Save the score together with the completed question count
          gameProgress.score = this.score;
          if (levelCompleted) {
            const timeSpent = Math.round((Date.now() - this.startTime) / 60000);
            gameProgress[levelKey].timeSpent += timeSpent;
          }
          gameProgress[levelKey].lastPlayed = new Date().toISOString().split('T')[0];

          if (this.level === 1 && this.correctAnswersThisLevel >= 10) {
            gameProgress.level2.unlocked = true;
          } else if (this.level === 2 && this.correctAnswersThisLevel >= 10) {
            gameProgress.level3.unlocked = true;
          }

          updateGameProgress(gameProgress);
        },

        recordAttempt() {
          const gameProgress = getGameProgress();
          const levelKey = `level${this.level}`;
          gameProgress[levelKey].attempts++;
          updateGameProgress(gameProgress);
        },

        checkHouseClick(house) {
          if (this.currentQuestion.type !== "map") return;

          this.recordAttempt();
          
          const correctLiteral = this.currentQuestion.correct.number;
          const houseLiteral = house.number.cardinal.literal;
          
          if (house.street === this.currentQuestion.correct.street && 
              houseLiteral === correctLiteral) {
            this.score += 10;
            this.correctAnswersThisLevel++;
            this.updateGameProgressMethod();
            this.feedback = "✅ Rätt svar!";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        checkTextAnswer() {
          if (this.currentQuestion.type !== "text") return;

          this.recordAttempt();
          
          const ans = this.textAnswer.trim().toLowerCase().replace(/\s+/g," ");
          const parts = this.currentQuestion.correct.split(" ");
          if (ans === parts[1]) {
            this.score += 10;
            this.correctAnswersThisLevel++;
            this.updateGameProgressMethod();
            this.feedback = "✅ Rätt! Bra jobbat.";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
            this.textAnswer = "";
          }
        },

        fail() {
          this.feedback = "❌ Fel svar! Försök igen.";
          this.feedbackClass = "wrong";
          setTimeout(() => {
              this.feedback = "";
              this.feedbackClass = "";
            }, 1500);
        },

        restartLevel() {
          this.feedback = "";
          this.feedbackClass = "";
          this.startTime = Date.now();
          this.correctAnswersThisLevel = 0;
          this.remainingQuestions = [...this.questions[this.level]];
          this.pickNextQuestion();
        },

        translateQuestion() {
          if (!this.currentQuestion) return;
          
          if (this.translation) {
            this.translation = "";
            return;
          }

          const streetInfo = this.currentQuestion.streetInfo;
          
          if (this.currentQuestion.type === "map") {
            if (this.level === 1) {
              this.translation = `I live on ${streetInfo.streetName} ${streetInfo.number.cardinal.en}`;
            } else if (this.level === 2) {
              this.translation = `I live in the ${streetInfo.number.ordinal.en} house on ${streetInfo.streetName}`;
            }
          } else if (this.currentQuestion.type === "text") {
            const colorEn = streetInfo.color.en;
            this.translation = `I live in the ${colorEn} house on ${streetInfo.streetName}. Spell out my address.`;
          }
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize game:", error);
    alert("Det gick inte att ladda spelet. Vänligen försök igen.");
  }
}

function createHousesArray(allData) {
  // Number label positions on the map, ordered by house position
  const labelPositions = {
    Ringgatan: [
      { x: 0.484, y: 0.812 },
      { x: 0.322, y: 0.848 },
      { x: 0.383, y: 0.737 },
      { x: 0.163, y: 0.741 },
      { x: 0.201, y: 0.568 },
      { x: 0.128, y: 0.512 },
      { x: 0.061, y: 0.463 }
    ],
    Skolgatan: [
      { x: 0.671, y: 0.664 },
      { x: 0.539, y: 0.569 },
      { x: 0.399, y: 0.445 },
      { x: 0.288, y: 0.365 },
      { x: 0.205, y: 0.299 },
      { x: 0.053, y: 0.248 }
    ],
    "Parkvägen": [
      { x: 0.796, y: 0.484 },
      { x: 0.686, y: 0.404 },
      { x: 0.599, y: 0.329 },
      { x: 0.531, y: 0.276 },
      { x: 0.455, y: 0.219 },
      { x: 0.385, y: 0.155 },
      { x: 0.253, y: 0.126 }
    ]
  };

  // Collect all houses with their click areas and number label positions
  return Object.entries(allData).flatMap(([street, houses]) =>
    houses.map(house => ({
      ...house,
      street,
      x: house.coords.x,
      y: house.coords.y,
      width: house.coords.width,
      height: house.coords.height,
      position: house.coords.position,
      labelCoords: labelPositions[street][house.coords.position - 1]
    }))
  );
}