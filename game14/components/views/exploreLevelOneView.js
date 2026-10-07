import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

export const ExploreLevelOneView = {
  name: "explore-level-one",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "", // The SVG code of Pelle, loaded when the page opens
      words: [],    // The body part words from the database
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
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view">
          <h1 class="explore-title">{{$language.translate('level1')}}</h1>

          <div class="explore-content">
            <div class="explore-pelle" v-html="pelleSvg"></div>

            <div class="explore-words">
              <button
                v-for="word in words"
                :key="word.en"
                class="word-cloud"
              >
                {{ word.article }} {{ word.sv }}
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
};