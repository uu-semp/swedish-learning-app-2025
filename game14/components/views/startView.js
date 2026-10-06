// This is the starting view, consisting of main text and three buttons.
// The switching works by passing the method switch-to (in the template in app.js), which is
// is received as a prop here and is passed down to the buttons

export const StartView = {
  name: "start-view",
  props: ["switchTo"],
  data() {
    return {
      selectedLanguage: this.$language.selectedLanguage,
    };
  },
  methods: {
    languageSwitch(language) {
      this.$language.load(language);
      this.selectedLanguage = this.$language.selectedLanguage;
    },
  },
  // The sky background is added around this view in app.js
  template: `
        <div class="sky-content">
          <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; z-index: 20; align-items: center;">
            <language-flag-button
              src="./components/assets/game14FlagSE.png"
              alt="Swedish"
              value="sv"
              :selected="selectedLanguage === 'sv'"
              @select="languageSwitch($event)"
            ></language-flag-button>

            <language-flag-button
              src="./components/assets/game14FlagEN.png"
              alt="English"
              value="en"
              :selected="selectedLanguage === 'en'"
              @select="languageSwitch($event)"
            ></language-flag-button>

           <capsule-button
             size="sm"
             label="?"
             :translate-key="false"
             :title="$language.translate('help')"
             @click="switchTo('HelpView')"
           ></capsule-button>

          </div>


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
          src="./components/assets/pelleimg.png"
          alt="Pelle"
          class="pelle-start-right"
        />
  `,
};
