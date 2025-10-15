// ==============================================
// Owned by Team 13
// ==============================================


"use strict";

const app = Vue.createApp({
  data() {
    return {
      tempStreets: [
        'Rackarberget',
        'Kungsgatan',
        'Daghammarskölds väg',
        'Torgny Segersteds allé',
        'Flogstavägen'
      ],

      isLoading: true,
      currentScreen: 'game',

      progress: 1,
      progressMax: 10,

      houseOptions: [],
      correctHouseIndex: -1,
      currentQuestion: null,
      currentStreet: '',

      showTranslation: false,
      swedishSentence: ["Jag", "bor", "på", "-street", "-int"],
      englishSentence: ["I", "live", "on", "-street", "-int"],
      prompt: [],
      translatedIndexes: [],

      vocabNumbers: [],
      // vocabStreets: [],
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
    // startGame() {
    //   this.progress = 1;
    //   this.currentScreen = 'game';
    //   this.startNewRound();
    // },
    // backToMenu() {
    //   this.currentScreen = 'menu';
    // },
    startNewRound() {
        // Remove any leftover "✔ Correct!" / "✖ Wrong..." messages
      document.querySelectorAll(".house-message").forEach(n => n.remove());
      this.translatedIndexes = [];
      this.prompt = [...this.swedishSentence];
      this.showTranslation = false;

      this.translatedIndexes = [];
      this.prompt = [...this.swedishSentence];
      this.showTranslation = false;

      const randomNoIndex = this.irandom_range(1, this.vocabNumbers.length - 1);
      const vocab = window.vocabulary.get_vocab(this.vocabNumbers[randomNoIndex]);
      this.currentQuestion = vocab;

      const randomStreetIndex = this.irandom_range(0, this.tempStreets.length - 1);
      this.currentStreet = this.tempStreets[randomStreetIndex];
      // const randomStreetIndex = this.irandom_range(0, this.vocabStreets.length - 1);
      // this.currentStreet = window.vocabulary.get_vocab(this.vocabStreets[randomStreetIndex]).sv;

      const houseCount = 4;
      const highestNumber = this.vocabNumbers.length - 1;
      const result = this.generateRandomHouses(vocab.literal, houseCount, highestNumber);

      this.houseOptions = result.houseArray;
      this.correctHouseIndex = result.correctHouse;
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
      return; // stay on the same round
    } else {
      const ok = document.createElement("div");
      ok.className = "house-message correct";
      ok.textContent = "✔ Correct!";
      btns[selectedIndex].parentElement.insertBefore(ok, btns[selectedIndex].nextSibling);

      // briefly show it, then proceed using your existing code below
      setTimeout(() => {
        this.progress += 1;
        if (this.progress >= this.progressMax) {
          alert("Congrats! You finished 10 rounds.");
          localStorage.setItem("team13_level1_completed", "1");

          window.location.href = 'index.html';
          return;
        }
        this.startNewRound();
      }, 700);
      return; // prevent the original block below from running immediately
    }


        this.progress += wasCorrect ? 1 : -1;
        if (this.progress < 1)  {
          this.progress = 1;
        }

        if (this.progress >= this.progressMax) {
          alert("Congrats! You finished 10 rounds.");
          window.location.href = 'index.html';
          return;
        }

        this.startNewRound();
      },

      toggleTranslation() {
        this.showTranslation = !this.showTranslation;
      },

      translateWord(wordIndex) {

        if (this.swedishSentence[wordIndex] === '-int' || this.swedishSentence[wordIndex] === '-street') {
          return;
        }

        const isAlreadyTranslated = this.translatedIndexes.includes(wordIndex);
        if (isAlreadyTranslated) {
          const swedishWord = this.swedishSentence[wordIndex];
          const newPrompt = [...this.prompt];
          newPrompt[wordIndex] = swedishWord;
          this.prompt = newPrompt;
          this.translatedIndexes = this.translatedIndexes.filter(index => index !== wordIndex);
        } else {
          const englishWord = this.englishSentence[wordIndex];
          const newPrompt = [...this.prompt];
          newPrompt[wordIndex] = englishWord;
          this.prompt = newPrompt;
          this.translatedIndexes.push(wordIndex);
        }
      },

      renderWord(word) {
        switch (word) {
          case 
            "-street": return this.currentStreet;

          case 
            "-int": return this.currentQuestion ? this.currentQuestion.sv : '';
        
          default: 
            return word;
        }
      },
    
    generateRandomHouses(houseNumber, houseCount, highestNumber) {
      const doubleHouses = this.irandom_range(0, 1);
      const maxPos = Math.min(Math.floor((houseNumber - 1) / (1 + doubleHouses)), houseCount - 1);
      const minPos = Math.min(
        Math.max(Math.ceil((houseCount - 1) - (highestNumber - houseNumber) / (1 + doubleHouses)), 0),
        houseCount - 1
      );
    
      const relativeHousePosition = this.irandom_range(Math.max(0, minPos), maxPos);
      const houses = [];
    
      for (let i = 0; i < houseCount; i++) {
        houses.push(houseNumber - (relativeHousePosition - i) * (1 + doubleHouses));
      }
    
      return { houseArray: houses, correctHouse: relativeHousePosition };
    },

    irandom_range(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  },
  
  mounted() {

    if (localStorage.getItem("team13_level1_completed") === null) {
      localStorage.setItem("team13_level1_completed", "0");
    }

    window.vocabulary.when_ready(() => {
      console.log("Vocabulary loaded, vue ready");
      this.vocabNumbers = window.vocabulary.get_category("number");
      // this.vocabStreets = window.vocabulary.get_category("street");
      this.isLoading = false;
      this.startNewRound();
    });
  }
  
});

app.mount('#app');