export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  data() {
    return {
      showLockedModal: false,
    };
  },
  methods: {
    openLockedPrompt() {
      this.showLockedModal = true;
    },

    closeLockedPrompt() {
      this.showLockedModal = false;
    }
  },
  // The sky background and language flags are added around this view in app.js
  template: `
      <div class="choose-level-view">
          <h1 class="main-text">{{$language.translate('choose-level')}}</h1>    
          
          <div class="level-buttons-container">
              <capsule-button
                label="level1"
                size="lg"
                @click="switchTo('LevelOneView')"
              ></capsule-button>
              <capsule-button
                label="level2"
                size="lg"
                @click="switchTo('LevelTwoView')"
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