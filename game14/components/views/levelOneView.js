import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

export const LevelOneView = {
  name: "level-one",
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

      // Remove the highlight from the previously selected body part
      svg.querySelectorAll("g.selected").forEach((part) => part.classList.remove("selected"));

      // Highlight the new one, e.g. the group with id="nose"
      if (newPart) {
        const part = svg.querySelector("#" + newPart);
        if (part) part.classList.add("selected");
      }
    },
  },
  methods: {
    // Select a body part, or unselect it if it is already selected
    selectPart(partName) {
      //console.log("Selected:", partName);
      this.selectedPart = this.selectedPart === partName ? null : partName;
    },

    // Find out which body part was clicked on Pelle
    handlePelleClick(event) {
      const part = event.target.closest("g[id]");
      if (part) {
        event.stopPropagation(); // Don't let the click reach the background
        this.selectPart(part.id);
      }
    },

        // Unselect when clicking somewhere else on the page
    clearSelection() {
      this.selectedPart = null;
    },
  },
   template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view" @click="clearSelection">
          <h1 class="explore-title">{{$language.translate('level1')}}</h1>

          <div class="explore-content">
            <div class="explore-pelle" v-html="pelleSvg" @click="handlePelleClick"></div>

                <div class="score-counter">
                    <score-counter :score="currentScore" :item-amount="numberOfQuestionsAsked"></score-counter>
                </div>
                
                <dress-pelle-prompt :item="currentItem"></dress-pelle-prompt>

                <div class="level-header-actions">
                    <exit-game-button @click="openModal"></exit-game-button>
                </div>
    
            </div>
            
            <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
            <incorrect-answer-feedback v-if="showIncorrectFeedback" :message="incorrectMessage"></incorrect-answer-feedback>         

            <div class="main-content-area">
                                <div class="pelle-wrapper">
                                        <pelle-container
                                            :expected-item-id="currentItem ? currentItem.ID : ''"
                                            @item-dropped="handleDropResult"
                                        ></pelle-container>
                                </div>
                <div class="wardrobe-wrapper">
                    <wardrobe-container :clothes="this.chosenClothingItems"></wardrobe-container>
                </div>
            </div>

            <div>
                <info-button @click="this.showInfo=true"></info-button>
                <license-button @click="this.showLicense=true"></license-button>
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
            <statisticsPopUp v-if="gameOver" @playAgain="restartGame" @exit="confirmExit" :totalNumberTries="totalTries" :score="this.currentScore" :numQuestionsAsked="this.numberOfQuestionsAsked"></statisticsPopUp>
            <div v-if="this.showInfo" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click="this.showInfo=false">
                    <h2>{{$language.translate('information-message')}}</h2>
                    <div class="modal-buttons">
                        <capsule-button id="info-back-button" label="okay-continue" size="md" @click="this.showInfo=false"></capsule-button>
                    </div>
                </div>
            </div>
            <div v-if="this.showLicense" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content license-modal" @click="this.showLicense=false">
                    <h2>{{$language.translate('license-information')}}</h2>
                    <div class="license-content">
                        <p>{{$language.translate('license-details')}}</p>
                        <div class="license-sections">
                            <p><strong>{{$language.translate('license-freepik')}}</strong></p>
                            <p><strong>{{$language.translate('license-public-domain')}}</strong></p>
                            <p><strong>{{$language.translate('license-cc')}}</strong></p>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <capsule-button label="okay-continue" size="md" @click="this.showLicense=false"></capsule-button>
                    </div>
                </div>
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