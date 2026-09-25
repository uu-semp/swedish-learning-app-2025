// This is the starting view, consisting of main text and three buttons.
// The switching works by passing the method switch-to (in the template in app.js), which is
// is received as a prop here and is passed down to the buttons

export const StartView = {
  name: "start-view",
  props: ["switchTo"],
  data() {
    return {
      selectedLanguage: this.$language.selectedLanguage,
      cloudInterval: null,
    };
  },
  mounted() {
    this.startCloudGeneration();
  },
  beforeUnmount() {
    if (this.cloudInterval) {
      clearInterval(this.cloudInterval);
    }
  },
  methods: {
    languageSwitch(language) {
      this.$language.load(language);
      this.selectedLanguage = this.$language.selectedLanguage;
    },
    startCloudGeneration() {
      const sky = this.$refs.skyContainer;
      if (!sky) return;

      this.cloudInterval = setInterval(() => {
        this.createRandomCloud(sky);
      }, 6000);
    },
    createRandomCloud(sky) {
      const cloud = document.createElement('div');
      const types = ['small', 'medium', 'large'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      cloud.classList.add('cloud', randomType);

      const randomTop = Math.floor(Math.random() * 50) + 5;
      cloud.style.top = randomTop + '%';

      let duration = 30;
      if (randomType === 'small') duration = Math.floor(Math.random() * 20) + 45;
      if (randomType === 'medium') duration = Math.floor(Math.random() * 15) + 30;
      if (randomType === 'large') duration = Math.floor(Math.random() * 15) + 20;

      cloud.style.animationDuration = duration + 's';

      sky.appendChild(cloud);

      setTimeout(() => {
        if (cloud.parentNode) {
          cloud.remove();
        }
      }, duration * 1000);
    },
  },
  template: `
    <div class="start-view-wrapper">
      <div class="sky" ref="skyContainer">
        <div class="cloud large" style="top: 15%; animation-duration: 40s; animation-delay: -5s;"></div>
        <div class="cloud medium" style="top: 30%; animation-duration: 28s; animation-delay: -12s;"></div>
        <div class="cloud small" style="top: 10%; animation-duration: 55s; animation-delay: -2s;"></div>
        <div class="cloud medium" style="top: 45%; animation-duration: 35s; animation-delay: -18s;"></div>
        <div class="cloud large" style="top: 22%; animation-duration: 45s; animation-delay: -25s;"></div>

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
      </div>
    </div>
  `,
};