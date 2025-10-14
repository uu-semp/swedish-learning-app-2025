export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  data() {
    return {
      selectedLanguage: this.$language.selectedLanguage, // 'sv' or 'en' 
      showLockedModal: false,
    };
  },
  methods: {
    languageSwitch(Language) {
      this.$language.load(Language);
      this.selectedLanguage = this.$language.selectedLanguage;
    },

    openLockedPrompt() {
      this.showLockedModal = true;
    },

    closeLockedPrompt() {
      this.showLockedModal = false;
    }
  },
  template: `
      <div class="choose-level-view">
          <!-- Language selection -->
          <div class="language-selection">
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
              <level-button :label="$language.translate('level2-locked')" class="big-buttons-locked" @click="openLockedPrompt"></level-button>
              <level-button :label="$language.translate('level3-locked')" class="big-buttons-locked" @click="openLockedPrompt"></level-button>
          </div>

          <div class="go-back-wrapper"> 
              <go-back-button @click="switchTo('StartView')"></go-back-button>
          </div>

          <!-- Modal prompt -->
          <div 
            v-if="showLockedModal" 
            class="modal-overlay" 
            @click.self="closeLockedPrompt"
          >
            <div class="modal-content">
              <button class="close-btn" @click="closeLockedPrompt">✖</button>
              <h2>{{$language.translate('not-implemented-prompt')}}</h2>
            </div>
          </div>
      </div>
    `,
};