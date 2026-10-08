import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

export const ExploreLevelOneView = {
  name: "explore-level-one",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "",
      words: [],
      selectedPart: null,
      showModal: false,
    };
  },
  async mounted() {
    const response = await fetch("./components/assets/pellecharacterbody.svg");
    this.pelleSvg = await response.text();

    try {
      await loaddb();
      this.words = get_category("body-part").map((id) => get_vocab(id));
    } catch (error) {
      console.error("Could not load the words from the database", error);
    }
  },
  watch: {
    selectedPart(newPart) {
      const svg = this.$el.querySelector(".explore-pelle svg");
      if (!svg) return;

      svg.querySelectorAll("g.selected").forEach((part) => part.classList.remove("selected"));

      if (newPart) {
        const part = svg.querySelector(`#${newPart}`);
        if (part) part.classList.add("selected");
      }
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    confirmExit() {
      this.switchTo("ChooseLevelView");
      this.closeModal();
    },
    handleOverlayClick(event) {
      if (event.target.classList.contains("modal-overlay")) {
        this.closeModal();
      }
    },
    selectPart(partName) {
      this.selectedPart = this.selectedPart === partName ? null : partName;
    },
    handlePelleClick(event) {
      const part = event.target.closest("g[id]");
      if (part) {
        event.stopPropagation();
        this.selectPart(part.id);
      }
    },
    clearSelection() {
      this.selectedPart = null;
    },
  },
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view" @click="clearSelection">
          <div class="explore-topbar">
            <div class="explore-topbar-spacer"></div>
            <h1 class="explore-title">{{$language.translate('level1')}}</h1>
            <div class="explore-topbar-actions">
              <exit-game-button @click="openModal"></exit-game-button>
            </div>
          </div>

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

          <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
            <div class="modal-content" @click.stop>
              <h2>{{$language.translate('exit-confirmation')}}</h2>
              <div class="modal-buttons">
                <capsule-button label="yes" size="md" @click="confirmExit"></capsule-button>
                <capsule-button label="no" size="md" @click="closeModal"></capsule-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
};
