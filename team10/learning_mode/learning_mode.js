// Vue.js logic for learning_mode.html

// Vue check app
const vueCheckApp = Vue.createApp({
  methods: {
    checkVue() {
      alert('Vue.js is working.');
    }
  }
});
vueCheckApp.mount('#vue-check');

// Flashcard app factory with options
function createFlashcardApp(options = { showDebug: true }) {
  return Vue.createApp({
    data() {
      return {
        cards: [],
        currentIndex: 0,
        isFlipped: false,
        finished: false,
        loading: true,
        error: null
      };
    },
    computed: {
      currentCard() {
        if (this.cards.length === 0) return null;
        return this.cards[this.currentIndex];
      }
    },
    methods: {
      loadVocabularyData() {
        if (window.vocabulary && window.vocabulary.when_ready) {
          window.vocabulary.when_ready(() => {
            try {
              console.log('Loading cards...');
              
              const foodIds = window.vocabulary.get_category("food");
              
              // Shuffle and pick 10 random words
              const shuffled = foodIds.sort(() => 0.5 - Math.random());
              const selected = shuffled.slice(0, 10);
              
              // Convert to flashcard format
              this.cards = selected.map(id => {
                const wordData = window.vocabulary.get_vocab(id);
                return {
                  id: id,
                  front: `<img src="../../${wordData.img}" alt="${wordData.en}" style="max-width:200px;max-height:200px;">`,
                  back: wordData.sv,
                  gotIt: false,
                  audio: `../../${wordData.audio}`,
                  english: wordData.en
                };
              });
              
              this.loading = false;
              console.log(`Loaded ${this.cards.length} cards`);
            } catch (error) {
              console.error('Error loading vocabulary:', error);
              this.error = `Failed to load vocabulary: ${error.message}`;
              this.loading = false;
            }
          });
        } else {
          this.error = 'Vocabulary system not available';
          this.loading = false;
        }
      },
      flipCard() {
        if (this.cards.length === 0) return;
        this.isFlipped = !this.isFlipped;
        if (this.isFlipped) {
          const audioSrc = this.cards[this.currentIndex].audio;
          if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
          }
        }
      },
      gotIt() {
        if (this.cards.length === 0) return;
        this.cards[this.currentIndex].gotIt = true;
        
        // Remove card if all gotIt
        if (this.cards.every(card => card.gotIt)) {
          this.finished = true;
          return;
        }
        
        // Reset flip state and wait for animation before changing card
        this.isFlipped = false;
        setTimeout(() => {
          // Move to next card that is not gotIt
          let nextIdx = this.currentIndex;
          do {
            nextIdx = (nextIdx + 1) % this.cards.length;
          } while (this.cards[nextIdx].gotIt);
          this.currentIndex = nextIdx;
        }, 200); // Wait for flip animation to complete
      },
      repeat() {
        if (this.cards.length === 0) return;
        
        // Add current card to end if not already at end
        const card = this.cards[this.currentIndex];
        this.cards.push({ ...card, gotIt: false });
        
        // Reset flip state and wait for animation before changing card
        this.isFlipped = false;
        setTimeout(() => {
          // Move to next card that is not gotIt
          let nextIdx = this.currentIndex;
          do {
            nextIdx = (nextIdx + 1) % this.cards.length;
          } while (this.cards[nextIdx].gotIt);
          this.currentIndex = nextIdx;
        }, 300); // Wait for flip animation to complete
      }
    },
    mounted() {
      if (options.showDebug) {
        console.log('Flashcard Vue app is running!');
        const debugDiv = document.createElement('div');
        debugDiv.style.color = 'green';
        debugDiv.textContent = 'Flashcard Vue app is running!';
        document.getElementById('flashcard-app').prepend(debugDiv);
      }
      
      this.loadVocabularyData();
    }
  });
}

// Allow showDebug to be controlled from HTML via data-show-debug attribute
const flashcardAppElem = document.getElementById('flashcard-app');
let showDebug = true;
if (flashcardAppElem && flashcardAppElem.hasAttribute('data-show-debug')) {
  const attr = flashcardAppElem.getAttribute('data-show-debug');
  showDebug = attr === 'true';
}
const flashcardApp = createFlashcardApp({ showDebug });
flashcardApp.mount('#flashcard-app');
