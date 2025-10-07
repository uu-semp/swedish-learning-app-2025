export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  data() {
    return {
      selectedLanguage: this.$language.selectedLanguage, // 'sv' or 'en' 
    };
  },
  methods: {
    languageSwitch(Language) {
      this.$language.load(Language);
      this.selectedLanguage = this.$language.selectedLanguage;
    },
  },
  template: `
      <div class="choose-level-view" style="position: relative;">
          <!-- Language selection -->
          <div style="position: absolute; top: 25px; right: 20px; display: flex; gap: 8px;">
              <language-flag-button
                src="./components/assets/team15FlagSE.png"
                alt="Swedish"
                value="sv"
                :selected="selectedLanguage === 'sv'"
                @click="languageSwitch('sv')"
                @select="selectedLanguage = $event"
              ></language-flag-button>

              <language-flag-button
                src="./components/assets/team15FlagEN.png"
                alt="English"
                value="en"
                :selected="selectedLanguage === 'en'"
                @click="languageSwitch('en')"
                @select="selectedLanguage = $event"
              ></language-flag-button>
          </div>

          <h1 class="main-text">{{$language.translate('choose-level')}}</h1>    
          
          <div class="level-buttons-container">
              <level-button :label="$language.translate('level1')" class="big-buttons" @click="switchTo('LevelOneView')"></level-button>
              <level-button :label="$language.translate('level2')" class="big-buttons" @click="switchTo('LevelTwoView')"></level-button>
              <level-button :label="$language.translate('level3')" class="big-buttons" @click="switchTo('LevelThreeView')"></level-button>
          </div>

          <div class="go-back-wrapper"> 
              <go-back-button class="go-back-button-style" @click="switchTo('StartView')"></go-back-button>
          </div>
      </div>
    `,
};