import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

export const LevelTwoView = {
  name: "level-two-view",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "",     // The SVG code of Pelle, loaded when the page opens
      words: [],        // The body part words in random order
      currentIndex: 0,  // Which word the player is looking for now
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
  },
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view find-mode">
          <h1 class="explore-title">{{$language.translate('level2')}}</h1>

          <div class="explore-content">
            <div class="explore-pelle" v-html="pelleSvg"></div>

            <div class="explore-side" v-if="currentWord">
              <p class="explore-instruction">{{$language.translate('level2-instruction')}}</p>
              <div class="find-word">{{ currentWord.article }} {{ currentWord.sv }}</div>
              <p class="find-progress">{{ currentIndex + 1 }} / {{ words.length }}</p>
            </div>
          </div>
        </div>
      </div>
    `,
};