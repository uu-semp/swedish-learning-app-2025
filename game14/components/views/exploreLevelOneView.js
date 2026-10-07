export const ExploreLevelOneView = {
  name: "explore-level-one",
  props: ["switchTo"],
  template: `
      <div class="start-view-wrapper">
        <div class="sky explore-view">
          <h1 class="main-text">{{$language.translate('level1')}}</h1>

          <!-- Here comes Pelle and the word list -->
        </div>
      </div>
    `,
};