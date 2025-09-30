export const LevelOneView = {
  name: "level-one-view",
  props: ["switchTo"],
  template: `
        <div class=level-one-view>
          <h1>THIS IS THE LEVEL 1 VIEW</h1>
          <wardrobe-container></wardrobe-container>    
          <div class = button-container> 
            <go-back-button @click="switchTo('ChooseLevelView')"></go-back-button>
          </div>
        </div>
      `,
};