// This is the starting view, consisting of main text and three buttons.
// The switching works by passing the method switch-to (in the template in app.js), which is
// is received as a prop here and is passed down to the buttons

export const StartView = {
  name: "start-view",
  props: ["switchTo"], //This is the method switch-to passed from the parent in app.js in right format for .js
  data() {
    return {
      selectedLanguage: null, // 'sv' or 'en'
    };
  },
  template: `
      <div>
      <!-- Language selection -->
      <div style="position: absolute; top: 25px; right: 20px; display: flex; gap: 8px;">
        <language-flag-button
          src="./components/assets/team15FlagSE.png"
          alt="Swedish"
          value="sv"
          :selected="selectedLanguage === 'sv'"
          @select="selectedLanguage = $event"
        ></language-flag-button>

        <language-flag-button
          src="./components/assets/team15FlagEN.png"
          alt="English"
          value="en"
          :selected="selectedLanguage === 'en'"
          @select="selectedLanguage = $event"
        ></language-flag-button>
      </div>

      <h1 class = "main-text">WELCOME TO THE DRESSING PELLE GAME</h1> 

      <div class = button-grid>
        <div class = button-container> 
          <start-game-button  @click="switchTo('ChooseLevelView')"></start-game-button>
        </div>
        <div class = button-container> 
          <how-to-play-button @click="switchTo('HelpView')"></how-to-play-button>
        </div>
        <div class="button-container"> 
          <images-button @click="switchTo('ImagesView')"></images-button>
        </div>
        <info-button></info-button>
      </div>
    `,
};