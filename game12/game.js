// ==============================================
// Owned by Game 12
// ==============================================


"use strict";

//Maybe add these to the vocabulary file instead of hardcoding them here
const directionVocab = ["Till vänster om", "Till höger om", "Mittemot"]
const transportVocab = ["Cyklar", "Tar cykeln", "Åker bil", "Tar bilen", "Åker buss", "Tar bussen"]

const app = Vue.createApp({
  data() {
    return {
      tempStreets: [
      ],

      isLoading: true,
      currentScreen: 'game',

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
      directionVocab: [],
      transportVocab: []
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

      const randomNoIndex = irandom_range(1, this.vocabNumbers.length - 1);
      const vocab = window.vocabulary.get_vocab(this.vocabNumbers[randomNoIndex]);
      this.currentQuestion = vocab;

      const randomStreetIndex = irandom_range(0, this.vocabStreets.length - 1);
      const vocabStreet = window.vocabulary.get_vocab(this.vocabStreets[randomStreetIndex]);
      this.currentStreet = vocabStreet.sv

      const houseCount = 4;
      const highestNumber = this.vocabNumbers.length - 1;
      const result = generateRandomHouses(vocab.literal, houseCount, highestNumber);

      this.houseOptions = result.houseArray;
      this.correctHouseIndex = result.correctHouse;
      console.log("Direction", this.directionVocab);
    },

    checkAnswer(selectedIndex) {
      const wasCorrect = (selectedIndex === this.correctHouseIndex);
      alert(wasCorrect ? "Correct!" : "Wrong house.");

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
      this.vocabNumbers = window.vocabulary.get_category("number");
      this.vocabStreets = window.vocabulary.get_category("street");
      this.directionVocab = directionVocab;
      this.transportVocab = transportVocab;
      this.isLoading = false;
      this.startNewRound();
    });
  }
  
});

app.mount('#app');