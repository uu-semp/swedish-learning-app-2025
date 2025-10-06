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

// Flashcard app
const flashcardApp = Vue.createApp({
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
    console.log('Flashcard Vue app is running!');
    const debugDiv = document.createElement('div');
    debugDiv.style.color = 'green';
    debugDiv.textContent = 'Flashcard Vue app is running!';
    document.getElementById('flashcard-app').prepend(debugDiv);
  }
});
flashcardApp.mount('#flashcard-app');
