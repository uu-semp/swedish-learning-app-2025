// ==============================================
// Owned by Team 10
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {

  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working in Learning Mode.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team10");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team10", data);
  });

})});

const app = Vue.createApp({
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
  }
});

app.mount('#flashcard-app');


