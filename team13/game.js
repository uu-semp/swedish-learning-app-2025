// ==============================================
// Owned by Team 13
// ==============================================

import './translation.js'
"use strict";

const app = Vue.createApp({
  
  data() {
    
    return {
      
      tempStreets: [],

      isLoading: true,
      currentScreen: 'game',

      progress: 0,
      progressMax: 10,
      progressMin: 0,
      houseOptions: [], //used in game.html
      correctHouseIndex: -1,
      currentQuestion: null,
      currentStreet: '',
      houseClicked: false,

      showTranslation: false,
      swedishSentence: ["Jag", "bor", "på", "-street", "-int"],
      englishSentence: ["I", "live", "on", "", ""],
      prompt: [],
      translatedIndexes: [],

      vocabNumbers: [],
      vocabStreets: [],
    }
  },

  computed: {
    progressPercentage() {
      return (this.progress / this.progressMax) * 100 + '%';
    },
    translationButtonText() {
      return this.showTranslation ? 'Hide cheat' : 'Cheat';
    },
    startButtonText() {
      return this.isLoading ? 'Loading Vocabulary...' : 'Start Game';
    }
  },

  methods: {
    startNewRound() {
      
      document.querySelectorAll(".house-message").forEach(n => n.remove());
      this.translatedIndexes = [];
      this.prompt = [...this.swedishSentence];
      this.showTranslation = false;

      this.translatedIndexes = [];
      this.prompt = [...this.swedishSentence];
      this.showTranslation = false;

      const randomNoIndex = irandom_range(1, this.vocabNumbers.length - 1);
      const vocab = window.vocabulary.get_vocab(this.vocabNumbers[randomNoIndex]);
      this.currentQuestion = vocab;

      const randomStreetIndex = irandom_range(0 , this.vocabStreets.length - 1);
      const vocabStreet = window.vocabulary.get_vocab(this.vocabStreets[randomStreetIndex]);
      this.currentStreet = vocabStreet.sv

      const houseCount = 4;
      const highestNumber = this.vocabNumbers.length - 1;
      const result = generateRandomHouses(vocab.literal, houseCount, highestNumber);

      this.houseOptions = result.houseArray;
      this.correctHouseIndex = result.correctHouse;
      this.houseClicked = false;
    },

    checkAnswer(selectedIndex) {
      const wasCorrect = (selectedIndex === this.correctHouseIndex);
      // show a message under the clicked house instead of alert
      const btns = document.querySelectorAll("#house-buttons button");
      document.querySelectorAll(".house-message").forEach(n => n.remove());

      if (!wasCorrect) {
        const msg = document.createElement("div");
        msg.className = "house-message wrong";
        msg.innerHTML = "✖ Wrong house<br>Try again!";
        btns[selectedIndex].parentElement.insertBefore(msg, btns[selectedIndex].nextSibling);
        this.progress += wasCorrect ? 1 : -1;
        if (this.progress < this.progressMin)  {
          this.progress = this.progressMin;
        }
        return; // stay on the same round
      } else {
        const ok = document.createElement("div");
        ok.className = "house-message correct";
        ok.textContent = "✔ Correct!";
        btns[selectedIndex].parentElement.insertBefore(ok, btns[selectedIndex].nextSibling);
        if (!this.houseClicked){this.progress += 1}
        this.houseClicked = true;
        setTimeout(() => {
          
          if (this.progress >= this.progressMax) {
            save.set("team13", "stage_completed_1", true) 
            save.stats.incrementWin("team13");
            save.stats.setCompletion("team13", 100);
            //for future: make this "stage_completed_" + stageNumber.string()
            window.location.href = 'end_screen.html';
            return;
          }
          this.startNewRound();
        }, 700);
        return; // prevent the original block below from running immediately
      }
    },

    toggleTranslation() {
      translate.toggleTranslation(this);
    },
    translateWord(wordIndex) {
      translate.translateWord(this, wordIndex);
    },
    renderWord(word) {
      return translate.renderWord(this, word)
    },
  },

  mounted() {
    window.vocabulary.when_ready(() => {
      console.log("Vocabulary loaded, vue ready");
      this.vocabNumbers = window.vocabulary.get_category("number");
      this.vocabStreets = window.vocabulary.get_category("street");
      this.isLoading = false;
      this.startNewRound();
    });
  }

});

app.mount('#app');