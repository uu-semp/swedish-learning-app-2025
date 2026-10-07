export const ExploreLevelOneView = {
  name: "explore-level-one",
  props: ["switchTo"],
  data() {
    return {
      pelleSvg: "", // The SVG code of Pelle, loaded when the page opens
    };
  },
  async mounted() {
    // Load the SVG as text so it becomes part of the page,
    // which makes every body part clickable
    const response = await fetch("./components/assets/pellecharacterbody.svg");
    this.pelleSvg = await response.text();
  },
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view">
          <h1 class="main-text">{{$language.translate('level1')}}</h1>

          <div class="explore-pelle" v-html="pelleSvg" style="height: 300px;"></div>
        </div>
      </div>
    `,
};