"use strict";

$(function() {
  window.vocabulary.when_ready(function() {
    
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

        numberWords: {
          1:"ett", 2:"två", 3:"tre", 4:"fyra", 5:"fem",
          6:"sex", 7:"sju", 8:"åtta", 9:"nio", 10:"tio",
          11:"elva", 12:"tolv", 13:"tretton", 14:"fjorton", 15:"femton",
          16:"sexton", 17:"sjutton", 18:"arton", 19:"nitton", 20:"tjugo",
          21:"tjugoett", 22:"tjugotvå", 23:"tjugotre", 24:"tjugofyra", 25:"tjugofem",
          26:"tjugosex", 27:"tjugosju", 28:"tjugoåtta", 29:"tjugonio", 30:"trettio",
          31:"trettioett"
        },

        ordinalWords: {
          1:"första", 2:"andra", 3:"tredje", 4:"fjärde", 5:"femte",
          6:"sjätte", 7:"sjunde", 8:"åttonde", 9:"nionde", 10:"tionde"
        },

        houses: [
          { street:"Ringgatan", number:1, color:"gul", x:0.490, y:0.763, width:0.12, height:0.16, labelX:0.480, labelY:0.815, position:1 },
          { street:"Ringgatan", number:2, color:"blå", x:0.313, y:0.820, width:0.13, height:0.18, labelX:0.321, labelY:0.850, position:2 },
          { street:"Ringgatan", number:3, color:"rosa", x:0.400, y:0.699, width:0.115, height:0.177, labelX:0.385, labelY:0.732, position:3 },
          { street:"Ringgatan", number:4, color:"vit", x:0.179, y:0.725, width:0.13, height:0.18, labelX:0.165, labelY:0.740, position:4 },
          { street:"Ringgatan", number:5, color:"grön", x:0.210, y:0.570, width:0.11, height:0.16, labelX:0.200, labelY:0.568, position:5 },
          { street:"Ringgatan", number:6, color:"lila", x:0.145, y:0.500, width:0.109, height:0.155, labelX:0.125, labelY:0.515, position:6 },
          { street:"Ringgatan", number:7, color:"röd", x:0.077, y:0.447, width:0.110, height:0.158, labelX:0.060, labelY:0.460, position:7 },
          
          { street:"Skolgatan", number:11, color:"grön", x:0.680, y:0.635, width:0.11, height:0.16, labelX:0.667, labelY:0.665, position:1 },
          { street:"Skolgatan", number:12, color:"lila", x:0.558, y:0.530, width:0.112, height:0.160, labelX:0.539, labelY:0.568, position:2 },
          { street:"Skolgatan", number:13, color:"beige", x:0.425, y:0.425, width:0.145, height:0.177, labelX:0.399, labelY:0.448, position:3 },
          { street:"Skolgatan", number:14, color:"blå", x:0.304, y:0.350, width:0.120, height:0.18, labelX:0.287, labelY:0.367, position:4 },
          { street:"Skolgatan", number:15, color:"gul", x:0.215, y:0.280, width:0.11, height:0.14, labelX:0.207, labelY:0.295, position:5 },
          { street:"Skolgatan", number:20, color:"svart", x:0.065, y:0.235, width:0.12, height:0.18, labelX:0.053, labelY:0.251, position:6 },
          
          { street:"Parkvägen", number:21, color:"blå", x:0.815, y:0.455, width:0.121, height:0.15, labelX:0.797, labelY:0.485, position:1 },
          { street:"Parkvägen", number:22, color:"röd", x:0.705, y:0.380, width:0.130, height:0.146, labelX:0.687, labelY:0.407, position:2 },
          { street:"Parkvägen", number:24, color:"blå", x:0.620, y:0.310, width:0.112, height:0.157, labelX:0.595, labelY:0.328, position:3 },
          { street:"Parkvägen", number:25, color:"rosa", x:0.555, y:0.250, width:0.119, height:0.160, labelX:0.530, labelY:0.275, position:4 },
          { street:"Parkvägen", number:28, color:"röd", x:0.470, y:0.184, width:0.100, height:0.160, labelX:0.455, labelY:0.220, position:5 },
          { street:"Parkvägen", number:29, color:"gul", x:0.398, y:0.120, width:0.119, height:0.168, labelX:0.386, labelY:0.155, position:6 },
          { street:"Parkvägen", number:31, color:"svart", x:0.240, y:0.110, width:0.120, height:0.185, labelX:0.256, labelY:0.127, position:7 }
        ],

        questions: {}
      },

      created(){ 
        this.questions = {
          1: this.houses.map(h => ({
            instruction: `Jag bor på ${h.street} ${this.numberWords[h.number] || h.number}`,
            correct: { street: h.street, number: h.number },
            type: "map"
          })),
          2: this.houses.map(h => ({
            instruction: `Jag bor i det ${this.ordinalWords[h.position]} huset på ${h.street}`,
            correct: { street: h.street, number: h.number },
            type: "map"
          })),
          3: this.houses.map(h => ({
            instruction: `Jag bor i det ${h.color}a huset på ${h.street}. Stava ut min adress.`,
            correct: `${h.street.toLowerCase()} ${this.numberWords[h.number]}`,
            type: "text",
            target: h
          }))
        };

        const selectedLevel = parseInt(localStorage.getItem('selectedLevel')) || 1;
        this.startLevel(selectedLevel);
      },

      methods: {
        startLevel(lv){
          this.level = lv;
          this.remainingQuestions = [...this.questions[lv]];
          this.pickNextQuestion();
        },

        pickNextQuestion(){
          this.translation = "";
          this.feedback = "";
          this.feedbackClass = "";
          this.hoveredHouse = null;

          if (this.remainingQuestions.length > 0) {
            const i = Math.floor(Math.random() * this.remainingQuestions.length);
            this.currentQuestion = this.remainingQuestions.splice(i, 1)[0];
            this.textAnswer = "";
          } else {
            this.updateGameProgress();  
            
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
          }
        },

        updateGameProgress(){
          let progress = JSON.parse(localStorage.getItem('gameProgress')) || {
            level1: { completed: 0, total: 20, unlocked: true, attempts: 0, timeSpent: 0, lastPlayed: null },
            level2: { completed: 0, total: 20, unlocked: false, attempts: 0, timeSpent: 0, lastPlayed: null },
            level3: { completed: 0, total: 20, unlocked: false, attempts: 0, timeSpent: 0, lastPlayed: null }
          };

          const levelKey = `level${this.level}`;
          const questionsCompleted = this.questions[this.level].length;
          
          progress[levelKey].completed = questionsCompleted;
          progress[levelKey].attempts++;
          progress[levelKey].lastPlayed = new Date().toISOString().split('T')[0];

          if (this.level === 1 && questionsCompleted === 20) {
            progress.level2.unlocked = true;
          } else if (this.level === 2 && questionsCompleted === 20) {
            progress.level3.unlocked = true;
          }

          localStorage.setItem('gameProgress', JSON.stringify(progress));
        },

        checkHouseClick(house){
          if (this.currentQuestion.type !== "map") return;
          
          if (house.street === this.currentQuestion.correct.street && 
              house.number === this.currentQuestion.correct.number){
            this.score += 10; 
            this.feedback = "✅ Rätt svar!";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        checkTextAnswer(){
          if (this.currentQuestion.type !== "text") return;
          
          const ans = this.textAnswer.trim().toLowerCase().replace(/\s+/g," ");
          if (ans === this.currentQuestion.correct){
            this.score += 10; 
            this.feedback = "✅ Rätt! Bra jobbat.";
            this.feedbackClass = "correct";
            setTimeout(() => this.pickNextQuestion(), 1000);
          } else { 
            this.fail(); 
          }
        },

        fail(){
          this.lives--; 
          this.feedback = "❌ Fel svar! Försök igen.";
          this.feedbackClass = "wrong";
          
          if (this.lives <= 0){ 
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

        restartLevel(){
          this.lives = 3;
          this.feedback = "";
          this.feedbackClass = "";
          this.remainingQuestions = [...this.questions[this.level]];
          this.pickNextQuestion();
        },

        translateQuestion(){
          if (!this.currentQuestion) return;
          
          if (this.translation) {
            this.translation = "";
            return;
          }

          if (this.currentQuestion.type === "map") {
            if (this.level === 1) {
              this.translation = `I live on ${this.currentQuestion.correct.street} ${this.currentQuestion.correct.number}`;
            } else if (this.level === 2) {
              const house = this.houses.find(h => 
                h.street === this.currentQuestion.correct.street && 
                h.number === this.currentQuestion.correct.number
              );
              const positionEn = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"][house.position - 1];
              this.translation = `I live in the ${positionEn} house on ${house.street}`;
            }
          } else if (this.currentQuestion.type === "text") {
            const colorEn = {
              "gul":"yellow", "blå":"blue", "rosa":"pink", "vit":"white", 
              "grön":"green", "lila":"purple", "röd":"red", "svart":"black", "beige":"beige"
            }[this.currentQuestion.target.color];
            this.translation = `I live in the ${colorEn} house on ${this.currentQuestion.target.street}. Spell out my address.`;
          }
        }
      }
    });
    
  });
});