"use strict";

import { setUpLevel } from './setUpLevels.js';
import { getGameProgress, updateGameProgress } from './localStorage.js';

$(function() {
  // Wait for all dependencies to load
  initializeGame();
});

async function initializeGame() {
  try {
    // Loading level data from the backend
    const { streets, allData } = await setUpLevel(10);
    
    // Create houses array for all streets on the map
    const allHouses = createHousesArray(allData);
    
    new Vue({
      el: '#app',
      data: {
        character: { name: 'Kevin' },
        lives: 3, 
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
        startTime: Date.now()
      },

      created() { 
        console.log('Vue instance created, generating questions...');
        this.questions = this.generateQuestions();
        
        const selectedLevel = window.save.get("team16", "selectedLevel") || 1;
        console.log('Selected level from storage:', selectedLevel);
        this.startLevel(selectedLevel);
      },

      methods: {
        generateQuestions() {
          console.log('Generating questions from street data...');
          const questions = {};
          
          // Level 1
          questions[1] = this.levelStreets.map(streetInfo => {
            const cardinalNumber = streetInfo.number.cardinal.sv;
            return {
              instruction: `Jag bor på ${streetInfo.streetName} ${cardinalNumber}`,
              correct: { 
                street: streetInfo.streetName, 
                number: streetInfo.number.cardinal.literal 
              },
              type: "map",
              streetInfo
            };
          });
          
          // Level 2
          questions[2] = this.levelStreets.map(streetInfo => {
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
          });
          
          // Level 3
          questions[3] = this.levelStreets.map(streetInfo => {
            const colorSv = streetInfo.color.sv;
            const cardinalNumber = streetInfo.number.cardinal.sv;
            return {
              instruction: `Jag bor i det ${colorSv}a huset på ${streetInfo.streetName}. Stava ut min adress.`,
              correct: `${streetInfo.streetName.toLowerCase()} ${cardinalNumber}`,
              type: "text",
              target: streetInfo,
              streetInfo
            };
          });
          
          console.log('Generated questions:', questions);
          return questions;
        },

        startLevel(lv) {
          this.level = lv;
          this.remainingQuestions = [...this.questions[lv]];
          this.pickNextQuestion();
        },

        pickNextQuestion() {
          this.translation = "";
          this.feedback = "";
          this.feedbackClass = "";
          this.hoveredHouse = null;

          if (this.remainingQuestions.length > 0) {
            const i = Math.floor(Math.random() * this.remainingQuestions.length);
            this.currentQuestion = this.remainingQuestions.splice(i, 1)[0];
            this.textAnswer = "";
          } else {
            this.completeLevel();
          }
        },

        completeLevel() {
          this.updateGameProgressMethod();  
          
          if (this.level < 3) {
            this.feedback = `🎉 Du klarade nivå ${this.level}! Bra jobbat 👏`;
            this.feedbackClass = "correct";
            setTimeout(() => this.startLevel(this.level + 1), 2000);
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
          const questionsCompleted = this.questions[this.level].length - this.remainingQuestions.length;
          
          
          const timeSpent = Math.round((Date.now() - this.startTime) / 60000);
          
          gameProgress[levelKey].completed = questionsCompleted;
          gameProgress[levelKey].attempts++;
          gameProgress[levelKey].timeSpent += timeSpent;
          gameProgress[levelKey].lastPlayed = new Date().toISOString().split('T')[0];

          // Unlock next level if current level is complete
          if (this.level === 1 && questionsCompleted === 10) {
            gameProgress.level2.unlocked = true;
          } else if (this.level === 2 && questionsCompleted === 10) {
            gameProgress.level3.unlocked = true;
          }

          updateGameProgress(gameProgress);
        },

        checkHouseClick(house) {
          if (this.currentQuestion.type !== "map") return;
          
          const correctLiteral = this.currentQuestion.correct.number;
          const houseLiteral = house.number.cardinal.literal;
          
          if (house.street === this.currentQuestion.correct.street && 
              houseLiteral === correctLiteral) {
            this.score += 10; 
            this.feedback = "✅ Rätt svar!";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        checkTextAnswer() {
          if (this.currentQuestion.type !== "text") return;
          
          const ans = this.textAnswer.trim().toLowerCase().replace(/\s+/g," ");
          if (ans === this.currentQuestion.correct) {
            this.score += 10; 
            this.feedback = "✅ Rätt! Bra jobbat.";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        fail() {
          this.lives--; 
          this.feedback = "❌ Fel svar! Försök igen.";
          this.feedbackClass = "wrong";
          
          if (this.lives <= 0) { 
            this.feedback = `💀 Du förlorade alla liv i nivå ${this.level}. Försök igen!`;
            this.feedbackClass = "wrong";
            setTimeout(() => this.restartLevel(), 2000); 
          } else {
            setTimeout(() => {
              this.feedback = "";
              this.feedbackClass = "";
            }, 1500);
          }
        },

        restartLevel() {
          this.lives = 3;
          this.feedback = "";
          this.feedbackClass = "";
          this.startTime = Date.now();
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
  const houses = [];
  
  // Process answer for Ringgatan
  allData.Ringgatan.forEach((house, index) => {
    houses.push({
      street: "Ringgatan",
      number: house.number.cardinal.literal,
      color: house.color.sv,
      x: house.coords.x,
      y: house.coords.y,
      width: house.coords.width,
      height: house.coords.height,
      position: house.coords.position,
      ...house
    });
  });
  
  // Process answer for Skolgatan
  allData.Skolgatan.forEach((house, index) => {
    houses.push({
      street: "Skolgatan",
      number: house.number.cardinal.literal,
      color: house.color.sv,
      x: house.coords.x,
      y: house.coords.y,
      width: house.coords.width,
      height: house.coords.height,
      position: house.coords.position,
      ...house
    });
  });
  
  // Process answer for Parkvägen
  allData.Parkvägen.forEach((house, index) => {
    houses.push({
      street: "Parkvägen",
      number: house.number.cardinal.literal,
      color: house.color.sv,
      x: house.coords.x,
      y: house.coords.y,
      width: house.coords.width,
      height: house.coords.height,
      position: house.coords.position,
      ...house
    });
  });
  
  return houses;
}