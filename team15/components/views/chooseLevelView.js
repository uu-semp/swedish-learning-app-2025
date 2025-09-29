export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  template: `
      <div>
      <h1 class = "main-text">CHOOSE LEVEL</h1>    
        <level-button label="LEVEL 1" @click="switchTo('LevelOneView')"></level-button>

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
      </div>
    `,
};