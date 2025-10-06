// Vue.js logic for learning_mode.html

// Vue check app
const vueCheckApp = Vue.createApp({
  methods: {
    checkVue() {
      alert('Vue.js is working!');
    }
  }
});
vueCheckApp.mount('#vue-check');

// Flashcard app factory with options
function createFlashcardApp(options = { showDebug: true }) {
  return Vue.createApp({
    data() {
      return {
        cards: [
          { front: 'Hej', back: 'Hello' },
          { front: 'Tack', back: 'Thank you' },
          { front: 'Ja', back: 'Yes' },
          { front: 'Nej', back: 'No' }
        ],
        currentIndex: 0,
        isFlipped: false
      };
    },
    computed: {
      currentCard() {
        return this.cards[this.currentIndex];
      }
    },
    methods: {
      flipCard() {
        this.isFlipped = !this.isFlipped;
      },
      nextCard() {
        this.isFlipped = false;
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      },
      prevCard() {
        this.isFlipped = false;
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
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
