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
          { front: '<img src="../../assets/images/food/apple.png" alt="Apple" style="max-width:200px;max-height:200px;">', back: 'Äpple', gotIt: false, audio: '../../assets/audio/food/apple.mp3' },
          { front: '<img src="../../assets/images/food/banana.png" alt="Banana" style="max-width:200px;max-height:200px;">', back: 'Banan', gotIt: false, audio: '../../assets/audio/food/banana.mp3' },
          { front: '<img src="../../assets/images/food/bread.png" alt="Bread" style="max-width:200px;max-height:200px;">', back: 'Bröd', gotIt: false, audio: '../../assets/audio/food/bread.mp3' },
          { front: '<img src="../../assets/images/food/cheese.png" alt="Cheese" style="max-width:200px;max-height:200px;">', back: 'Ost', gotIt: false, audio: '../../assets/audio/food/cheese.mp3' },
          { front: '<img src="../../assets/images/food/milk.png" alt="Milk" style="max-width:200px;max-height:200px;">', back: 'Mjölk', gotIt: false, audio: '../../assets/audio/food/milk.mp3' },
          { front: '<img src="../../assets/images/food/eggs.png" alt="Egg" style="max-width:200px;max-height:200px;">', back: 'Ägg', gotIt: false, audio: '../../assets/audio/food/eggs.mp3' },
          { front: '<img src="../../assets/images/food/potato.png" alt="Potato" style="max-width:200px;max-height:200px;">', back: 'Potatis', gotIt: false, audio: '../../assets/audio/food/potato.mp3' },
          { front: '<img src="../../assets/images/food/carrot.png" alt="Carrot" style="max-width:200px;max-height:200px;">', back: 'Morot', gotIt: false, audio: '../../assets/audio/food/carrot.mp3' },
          { front: '<img src="../../assets/images/food/tomato.png" alt="Tomato" style="max-width:200px;max-height:200px;">', back: 'Tomat', gotIt: false, audio: '../../assets/audio/food/tomato.mp3' },
          { front: '<img src="../../assets/images/food/pear.png" alt="Pear" style="max-width:200px;max-height:200px;">', back: 'Päron', gotIt: false, audio: '../../assets/audio/food/pear.mp3' }
        ],
        currentIndex: 0,
        isFlipped: false,
        finished: false
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
        if (this.isFlipped) {
          const audioSrc = this.cards[this.currentIndex].audio;
          if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
          }
        }
      },
      gotIt() {
        this.cards[this.currentIndex].gotIt = true;
        // Remove card if all gotIt
        if (this.cards.every(card => card.gotIt)) {
          this.finished = true;
          return;
        }
        // Move to next card that is not gotIt
        let nextIdx = this.currentIndex;
        do {
          nextIdx = (nextIdx + 1) % this.cards.length;
        } while (this.cards[nextIdx].gotIt);
        this.currentIndex = nextIdx;
        this.isFlipped = false;
      },
      repeat() {
        // Add current card to end if not already at end
        const card = this.cards[this.currentIndex];
        this.cards.push({ ...card, gotIt: false });
        this.isFlipped = false;
        // Move to next card that is not gotIt
        let nextIdx = this.currentIndex;
        do {
          nextIdx = (nextIdx + 1) % this.cards.length;
        } while (this.cards[nextIdx].gotIt);
        this.currentIndex = nextIdx;
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
