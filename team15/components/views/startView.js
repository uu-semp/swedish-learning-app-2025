// This is the starting view, consisting of main text and three buttons.
// The switching works by passing the method switch-to (in the template in app.js), which is
// is received as a prop here and is passed down to the buttons

export const StartView = {
  name: "start-view",
  props: ["switchTo"], //This is the method switch-to passed from the parent in app.js in right format for .js
  template: `
      <div>
      <h1 class = "main-text">WELCOME TO THE DRESSING PELLE GAME</h1> 
      <div class = button-grid>
        <div class = button-container> 
          <start-game-button  @click="switchTo('ChooseLevelView')"></start-game-button>
        </div>
        <div class = button-container> 
          <how-to-play-button @click="switchTo('HelpView')"></how-to-play-button>
        </div>
        </div>
        <info-button></info-button>
      </div>
    `,
};