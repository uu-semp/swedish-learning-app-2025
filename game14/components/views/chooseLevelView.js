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
          </div>

          <h1 class="main-text">{{$language.translate('choose-level')}}</h1>    
          
          <div class="level-buttons-container">
              <capsule-button
                label="level1"
                size="lg"
                @click="switchTo('LevelOneView')"
              ></capsule-button>
              <capsule-button
                label="level2-locked"
                size="lg"
                :locked="true"
                @click="openLockedPrompt"
              ></capsule-button>
              <capsule-button
                label="level3-locked"
                size="lg"
                :locked="true"
                @click="openLockedPrompt"
              ></capsule-button>
          </div>

          <div class="go-back-wrapper"> 
              <capsule-button
                label="go-back"
                size="md"
                @click="switchTo('StartView')"
              ></capsule-button>
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