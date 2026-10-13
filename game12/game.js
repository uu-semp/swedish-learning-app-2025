// ==============================================
// Owned by Game 12
// ==============================================


"use strict";

const GAME_ID = "game12";

const app = Vue.createApp({
  data() {
    return {
      tempStreets: [
      ],

      isLoading: true,
      currentScreen: 'game',
      completionMessage: 'All available vocabulary has been answered correctly.',
      canRestartLearning: false,

      progress: 0,
      progressMax: 10,
      progressMin: 0,

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
      this.translatedIndexes = [];
      this.prompt = [...this.swedishSentence];
      this.showTranslation = false;

      const vocab = window.vocabulary.get_random(
        GAME_ID,
        this.vocabNumbers
      );
      if (!vocab) {
        this.completionMessage = 'All available numbers have been answered correctly.';
        this.canRestartLearning = true;
        this.currentScreen = 'complete';
        return;
      }
      const houseNumber = Number(vocab.literal);
      if (!Number.isSafeInteger(houseNumber) || houseNumber < 1) {
        console.error(
          `Game 12: vocabulary entry "${vocab.id}" has an invalid Literal value:`,
          vocab.literal
        );
        this.completionMessage = 'A number is missing a valid numeric value. Please check the vocabulary data.';
        this.canRestartLearning = false;
        this.currentScreen = 'complete';
        return;
      }
      this.currentQuestion = vocab;

      const randomStreetIndex = irandom_range(0, this.vocabStreets.length - 1);
      const vocabStreet = window.vocabulary.get_vocab(this.vocabStreets[randomStreetIndex]);
      this.currentStreet = vocabStreet.sv;

      const houseCount = 4;
      const highestNumber = Math.max(
        ...this.vocabNumbers.map(id => Number(window.vocabulary.get_vocab(id).literal))
      );
      const result = generateRandomHouses(houseNumber, houseCount, highestNumber);

      this.houseOptions = result.houseArray;
      this.correctHouseIndex = result.correctHouse;
    },

    checkAnswer(selectedIndex) {
      const wasCorrect = (selectedIndex === this.correctHouseIndex);
      alert(wasCorrect ? "Correct!" : "Wrong house.");

      if (wasCorrect) {
        window.vocabulary.mark_correct(GAME_ID, this.currentQuestion.id);
      }

      this.progress += wasCorrect ? 1 : -1;
      if (this.progress < this.progressMin)  {
        this.progress = this.progressMin;
      }

      if (this.progress >= this.progressMax) {
        alert(`Congrats! You finished ${this.progressMax} rounds.`);
        save.set("game12", "stage_completed_1", true) 
        save.stats.incrementWin("game12");
        save.stats.setCompletion("game12", 100);
        //for future: make this "stage_completed_" + stageNumber.string()
        window.location.href = 'end_screen.html';
        return;
      }

      this.startNewRound();
    },

    restartLearning() {
      window.vocabulary.reset_progress(GAME_ID);
      this.progress = 0;
      this.canRestartLearning = false;
      this.currentScreen = 'game';
      this.startNewRound();
    },

    toggleTranslation() {
      this.showTranslation = !this.showTranslation;
    },

    translateWord(wordIndex) {

      if (this.prompt[wordIndex] === '-int' || 
          this.prompt[wordIndex] === '-street') {
        return;
      }
      let newWord = ""
      if (this.translatedIndexes[wordIndex]){
        newWord = this.swedishSentence[wordIndex];  
      }else{
        newWord = this.englishSentence[wordIndex];
      }
      this.translatedIndexes[wordIndex] = !this.translatedIndexes[wordIndex];
      const newPrompt = [...this.prompt];
      newPrompt[wordIndex] = newWord;
      this.prompt = newPrompt;
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


  },
  
  mounted() {
    window.vocabulary.when_ready(() => {
      console.log("Vocabulary loaded, vue ready");
      const numberIds = window.vocabulary.get_category("number") || [];
      this.vocabNumbers = numberIds.filter(id => {
        const literal = Number(window.vocabulary.get_vocab(id)?.literal);
        return Number.isSafeInteger(literal) && literal > 0;
      });
      this.vocabStreets = window.vocabulary.get_category("street") || [];
      this.isLoading = false;
      if (this.vocabNumbers.length === 0 || this.vocabStreets.length === 0) {
        this.completionMessage = "Game vocabulary is unavailable or has no valid numeric values.";
        this.canRestartLearning = false;
        this.currentScreen = 'complete';
        return;
      }
      this.startNewRound();
    });
  }
  
});

app.mount('#app');