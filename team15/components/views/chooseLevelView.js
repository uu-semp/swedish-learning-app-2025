export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  template: `
      <div class="choose-level-view">
          
          <div class="language-flags-container">
              </div>

          <h1 class="main-text">CHOOSE LEVEL</h1>    
          
          <div class="level-buttons-container">
              <level-button label="LEVEL 1" class="big-buttons" @click="switchTo('LevelOneView')"></level-button>
              <level-button label="LEVEL 2" class="big-buttons" @click="switchTo('LevelTwoView')"></level-button>
              <level-button label="LEVEL 3" class="big-buttons" @click="switchTo('LevelThreeView')"></level-button>
          </div>

          <div class="go-back-wrapper"> 
              <go-back-button class="go-back-button-style" @click="switchTo('StartView')"></go-back-button>
          </div>
      </div>
    `,
};