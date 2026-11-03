// This is the starting view, consisting of main text and three buttons.
// The switching works by passing the method switch-to (in the template in app.js), which is
// is received as a prop here and is passed down to the buttons

export const StartView = {
  name: "start-view",
  props: ["switchTo"],
  // The sky background, language flags and help button are added around this view in app.js
  template: `
        <div class="sky-content">
          <h1 class="main-text">{{$language.translate('start-message')}}</h1>

          <div class="btn-play-wrapper">
            <capsule-button
              label="play"
              size="lg"
              icon="play"
              @click="switchTo('ChooseLevelView')"
            ></capsule-button>
          </div>
        </div>
        <img
          src="./components/assets/pictures/pelleimg.png"
          alt="Pelle"
          class="pelle-start-right"
        />
  `,
};
