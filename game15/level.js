"use strict";

import { setUpLevel } from './setUpLevels.js';
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
        lives: 3, 
        score: 0, 
        level: 1,
        textAnswer: "",
        currentQuestion: null,
        remainingQuestions: [],
        feedback: "",
        feedbackClass: "",
        hoveredHouse: null,
        houses: allHouses,
        levelStreets: streets,
        questions: {},
        allStreetData: allData,
        startTime: Date.now(),
        isEnglish: false,
        correctAnswersThisLevel: 0
      },

      created() { 
        console.log('Vue instance created, generating questions...');
        this.isEnglish = sessionStorage.getItem('game15_lang') === 'en';
        this.questions = this.generateQuestions();
        
        const selectedLevel = window.save.get("game15", "selectedLevel") || 1;
        console.log('Selected level from storage:', selectedLevel);
        this.startLevel(selectedLevel);
      },

      methods: {
        generateQuestions() {
          console.log('Generating questions from street data...');
          const questions = {};
          
          questions[1] = this.levelStreets.map(streetInfo => {
            const cardinalNumber = streetInfo.number.cardinal.sv;
            return {
              instructionSv: `Jag bor på ${streetInfo.streetName} ${streetInfo.number.cardinal.sv}`,
              instructionEn: `I live on ${streetInfo.streetName} ${streetInfo.number.cardinal.en}`,
              correct: { 
                street: streetInfo.streetName, 
                number: streetInfo.number.cardinal.literal 
              },
              type: "map",
              streetInfo
            };
          });
          
          questions[2] = this.levelStreets.map(streetInfo => {
            const ordinalNumber = streetInfo.number.ordinal.sv;
            return {
              instructionSv: `Jag bor i det ${streetInfo.number.ordinal.sv} huset på ${streetInfo.streetName}`,
              instructionEn: `I live in the ${streetInfo.number.ordinal.en} house on ${streetInfo.streetName}`,
              correct: { 
                street: streetInfo.streetName, 
                number: streetInfo.number.cardinal.literal 
              },
              type: "map",
              streetInfo
            };
          });
          
          questions[3] = this.levelStreets.map(streetInfo => {
            const colorSv = streetInfo.color.sv;
            const cardinalNumber = streetInfo.number.cardinal.sv;
            return {
              instructionSv: `Jag bor i det ${streetInfo.color.sv}a huset på ${streetInfo.streetName}. Stava ut min adress.`,
              instructionEn: `I live in the ${streetInfo.color.en} house on ${streetInfo.streetName}. Spell out my address.`,
              correct: `${streetInfo.streetName.toLowerCase()} ${streetInfo.number.cardinal.sv}`,
              type: "text",
              target: streetInfo,
              streetInfo
            };
          });
          
          console.log('Generated questions:', questions);
          return questions;
        },

        toggleLanguage() {
          this.isEnglish = !this.isEnglish;
          
          sessionStorage.setItem('game15_lang', this.isEnglish ? 'en' : 'sv');
          
          const headerTitle = document.querySelector('header h1');
          const backBtn = document.querySelector('.back-button');
          if (this.isEnglish) {
            if (headerTitle) headerTitle.textContent = headerTitle.getAttribute('data-en');
            if (backBtn) backBtn.childNodes[0].nodeValue = backBtn.getAttribute('data-en');
          } else {
            if (headerTitle) headerTitle.textContent = headerTitle.getAttribute('data-sv');
            if (backBtn) backBtn.childNodes[0].nodeValue = backBtn.getAttribute('data-sv');
          }
        },

        startLevel(lv) {
          console.log(`Starting level ${lv}...`);
          this.level = lv;
          this.correctAnswersThisLevel = 0;
          this.remainingQuestions = [...this.questions[lv]];
          console.log(`Level ${lv} has ${this.remainingQuestions.length} questions`);
          this.pickNextQuestion();
        },

        pickNextQuestion() {
          this.feedback = "";
          this.feedbackClass = "";
          this.hoveredHouse = null;

          if (this.correctAnswersThisLevel >= 10) {
            console.log(`Level ${this.level} complete with ${this.correctAnswersThisLevel} correct answers!`);
            this.updateGameProgressMethod();
            this.completeLevel();
            return;
          }

          if (this.remainingQuestions.length > 0) {
            const i = Math.floor(Math.random() * this.remainingQuestions.length);
            this.currentQuestion = this.remainingQuestions.splice(i, 1)[0];
            this.textAnswer = "";
          } else {
            console.log(`Reloading questions. Progress: ${this.correctAnswersThisLevel}/10`);
            this.feedback = this.isEnglish ? `You have answered ${this.correctAnswersThisLevel}/10 questions. Keep playing!` : `Du har svarat på ${this.correctAnswersThisLevel}/10 frågor. Fortsätt spela!`;
            this.feedbackClass = "correct";
            
            setTimeout(() => {
              this.remainingQuestions = [...this.questions[this.level]];
              this.pickNextQuestion();
            }, 2000);
          }
        },

        completeLevel() {
          if (this.level < 3) {
            this.feedback = this.isEnglish ? `🎉 You passed level ${this.level}! Great job 👏` : `🎉 Du klarade nivå ${this.level}! Bra jobbat 👏`;
            this.feedbackClass = "correct";
            
            setTimeout(() => {
              this.startTime = Date.now();
              this.startLevel(this.level + 1);
            }, 2000);
          } else {
            this.feedback = this.isEnglish ? "🏆 You have passed all levels! Fantastic 🎉" : "🏆 Du har klarat alla nivåer! Fantastiskt 🎉";
            this.feedbackClass = "correct";
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 3000);
          }
        },

        updateGameProgressMethod() {
          const gameProgress = getGameProgress();
          const levelKey = `level${this.level}`;
          
          const timeSpent = Math.round((Date.now() - this.startTime) / 60000);
          
          gameProgress[levelKey].completed = this.correctAnswersThisLevel;
          gameProgress[levelKey].attempts++;
          gameProgress[levelKey].timeSpent += timeSpent;
          gameProgress[levelKey].lastPlayed = new Date().toISOString().split('T')[0];

          if (this.level === 1 && this.correctAnswersThisLevel >= 10) {
            gameProgress.level2.unlocked = true;
          } else if (this.level === 2 && this.correctAnswersThisLevel >= 10) {
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
            this.correctAnswersThisLevel++;
            this.updateGameProgressMethod();
            this.feedback = this.isEnglish ? "✅ Correct answer!" : "✅ Rätt svar!";
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
            this.correctAnswersThisLevel++;
            this.updateGameProgressMethod();
            this.feedback = this.isEnglish ? "✅ Correct! Good job." : "✅ Rätt! Bra jobbat.";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        fail() {
          this.lives--; 
          this.feedback = this.isEnglish ? "❌ Wrong answer! Try again." : "❌ Fel svar! Försök igen.";
          this.feedbackClass = "wrong";
          
          if (this.lives <= 0) { 
            this.feedback = this.isEnglish ? `💀 You lost all lives in level ${this.level}. Try again!` : `💀 Du förlorade alla liv i nivå ${this.level}. Försök igen!`;
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
          this.correctAnswersThisLevel = 0;
          this.remainingQuestions = [...this.questions[this.level]];
          this.pickNextQuestion();
        },
      }
    });
  } catch (error) {
    console.error("Failed to initialize game:", error);
    alert("Det gick inte att ladda spelet. Vänligen försök igen.");
  }
}

function createHousesArray(allData) {
  const houses = [];
  
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