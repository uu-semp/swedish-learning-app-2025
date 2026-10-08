import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

export const LevelTwoView = {
  name: "level-two-view",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "",       // The SVG code of Pelle, loaded when the page opens
      words: [],          // The body part words from the database
      selectedPart: null, // English name of the selected body part, e.g. "nose"
    };
  },
  async mounted() {
    // Load the SVG as text so it becomes part of the page,
    // which makes every body part clickable
    const response = await fetch("./components/assets/pellecharacterbody.svg");
    this.pelleSvg = await response.text();

    // Load the body part words from the shared vocabulary database
    try {
      await loaddb();
      this.words = get_category("body-part").map((id) => get_vocab(id));
    } catch (error) {
      console.error("Could not load the words from the database", error);
    }
  },
  watch: {
    // Every time selectedPart changes, highlight the matching body part on Pelle
    selectedPart(newPart) {
      const svg = this.$el.querySelector(".explore-pelle svg");
      if (!svg) return;

      svg.querySelectorAll("g.selected").forEach((part) => part.classList.remove("selected"));

      if (newPart) {
        const part = svg.querySelector("#" + newPart);
        if (part) part.classList.add("selected");
      }
    },
  },
  methods: {
    // Select a body part, or unselect it if it is already selected
    selectPart(partName) {
      this.selectedPart = this.selectedPart === partName ? null : partName;
    },

    // Unselect when clicking somewhere else on the page
    clearSelection() {
      this.selectedPart = null;
    },

    // Find out which body part was clicked on Pelle
    handlePelleClick(event) {
      const part = event.target.closest("g[id]");
      if (part) {
        event.stopPropagation();
        this.selectPart(part.id);
      }
    },
  },
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view" @click="clearSelection">
          <h1 class="explore-title">{{$language.translate('level2')}}</h1>

          <div class="explore-content">
            <div class="explore-pelle" v-html="pelleSvg" @click="handlePelleClick"></div>

            <div class="explore-side">
              <p class="explore-instruction">{{$language.translate('explore-instruction')}}</p>

              <div class="explore-words">
                <button
                  v-for="word in words"
                  :key="word.en"
                  class="word-cloud"
                  :class="{ selected: word.en === selectedPart }"
                  @click.stop="selectPart(word.en)"
                >
                  {{ word.article }} {{ word.sv }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
};