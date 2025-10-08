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
          { front: '<img src="../../assets/images/food/apple.png" alt="Apple" style="max-width:200px;max-height:200px;">', back: 'Äpple' },
          { front: '<img src="../../assets/images/food/banana.png" alt="Banana" style="max-width:200px;max-height:200px;">', back: 'Banan' },
          { front: '<img src="../../assets/images/food/bread.png" alt="Bread" style="max-width:200px;max-height:200px;">', back: 'Bröd' },
          { front: '<img src="../../assets/images/food/cheese.png" alt="Cheese" style="max-width:200px;max-height:200px;">', back: 'Ost' },
          { front: '<img src="../../assets/images/food/milk.png" alt="Milk" style="max-width:200px;max-height:200px;">', back: 'Mjölk' },
          { front: '<img src="../../assets/images/food/egg.png" alt="Egg" style="max-width:200px;max-height:200px;">', back: 'Ägg' },
          { front: '<img src="../../assets/images/food/potato.png" alt="Potato" style="max-width:200px;max-height:200px;">', back: 'Potatis' },
          { front: '<img src="../../assets/images/food/carrot.png" alt="Carrot" style="max-width:200px;max-height:200px;">', back: 'Morot' },
          { front: '<img src="../../assets/images/food/tomato.png" alt="Tomato" style="max-width:200px;max-height:200px;">', back: 'Tomat' },
          { front: '<img src="../../assets/images/food/pear.png" alt="Pear" style="max-width:200px;max-height:200px;">', back: 'Päron' }
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
