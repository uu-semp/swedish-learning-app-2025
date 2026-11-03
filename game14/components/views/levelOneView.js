import { loadGameData } from "../elements/gameData.js";
import { playSound } from "../elements/playSound.js";

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
    // Get Pelle and the body part words, already loaded when the game started
    try {
      const { pelleSvg, bodyParts } = await loadGameData();
      this.pelleSvg = pelleSvg;
      this.words = bodyParts;
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
    // First click selects a body part, clicking it again plays the sound.
    // Clicking another word selects that one instead.
    selectPart(partName) {
        if (this.selectedPart === partName) {
          playSound(this.words.find((w) => w.en === partName));
        } else {
          this.selectedPart = partName;
        }
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
      <div class="explore-view" @click="clearSelection">
        <div class="go-back-wrapper">
          <capsule-button
            label="go-back"
            size="md"
            @click.stop="switchTo('ChooseLevelView')"
          ></capsule-button>
        </div>

        <h1 class="explore-title">{{$language.translate('level1')}}</h1>

        <div class="explore-content">
          <div class="explore-pelle" v-html="pelleSvg" @click="handlePelleClick"></div>

          <div class="explore-side">
            <p class="explore-instruction">{{$language.translate('explore-instruction')}}</p>
            <p class="explore-audio-hint">
              {{$language.translate('explore-audio-hint-level1')}}
            </p>

            <div class="explore-words">
              <button
                v-for="word in words"
                :key="word.en"
                class="word-cloud"
                :class="{ selected: word.en === selectedPart }"
                @click.stop="selectPart(word.en)"
              >
                <i v-if="word.en === selectedPart" class="fa-solid fa-volume-high word-icon"></i>
                {{ word.article }} {{ word.sv }}
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
};