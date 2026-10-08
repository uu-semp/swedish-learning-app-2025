import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

const MAX_MISTAKES = 2; // Wrong clicks before the answer is shown

export const LevelTwoView = {
  name: "level-two-view",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "",          // The SVG code of Pelle, loaded when the page opens
      words: [],             // The body part words in random order
      currentIndex: 0,       // Which word the player is looking for now
      mistakesOnCurrent: 0,  // Wrong clicks on the current word
      locked: false,         // True while the answer is shown, to ignore clicks
      finished: false,       // True when all words are done
    };
  },
  computed: {
    // The word the player is looking for right now
    currentWord() {
      return this.words[this.currentIndex];
    },
  },
  async mounted() {
    // Load the SVG as text so every body part is clickable
    const response = await fetch("./components/assets/pellecharacterbody.svg");
    this.pelleSvg = await response.text();

    // Load the body part words from the shared vocabulary database
    try {
      await loaddb();
      const words = get_category("body-part").map((id) => get_vocab(id));
      this.words = this.shuffle(words);
    } catch (error) {
      console.error("Could not load the words from the database", error);
    }
  },
  methods: {
    // Put the words in random order (Fisher-Yates shuffle)
    shuffle(list) {
      const copy = [...list];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },

    // Check if the player clicked the right body part
    handlePelleClick(event) {
      const part = event.target.closest("g[id]");
      if (!part || !this.currentWord || this.locked || this.finished) return;

      if (part.id === this.currentWord.en) {
        // Right: keep the part green and go to the next word
        part.classList.add("found");
        this.nextWord();
      } else {
        // Wrong: flash the clicked part red
        this.mistakesOnCurrent++;
        part.classList.add("wrong");
        setTimeout(() => part.classList.remove("wrong"), 600);

        if (this.mistakesOnCurrent >= MAX_MISTAKES) this.showAnswer();
      }
    },

    // After too many mistakes: blink the right body part, then move on
    showAnswer() {
      this.locked = true;
      const svg = this.$el.querySelector(".explore-pelle svg");
      const rightPart = svg.querySelector("#" + this.currentWord.en);
      rightPart.classList.add("hint");

      setTimeout(() => {
        rightPart.classList.remove("hint");
        rightPart.classList.add("found");
        this.locked = false;
        this.nextWord();
      }, 1800);
    },

    nextWord() {
      this.mistakesOnCurrent = 0;
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++;
      } else {
        this.finished = true;
      }
    },
  },
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view find-mode">
          <h1 class="explore-title">{{$language.translate('level2')}}</h1>

          <div class="explore-content">
            <div class="explore-pelle" v-html="pelleSvg" @click="handlePelleClick"></div>

            <div class="explore-side" v-if="currentWord && !finished">
              <p class="explore-instruction">{{$language.translate('level2-instruction')}}</p>
              <div class="find-word">{{ currentWord.article }} {{ currentWord.sv }}</div>
              <p class="find-progress">{{ currentIndex + 1 }} / {{ words.length }}</p>
            </div>
          </div>
        </div>
      </div>
    `,
};