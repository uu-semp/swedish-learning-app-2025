export const LevelThreeView = {
    name: "level-three-view",
    props: ["switchTo"],
    template: `
        <div>
        <h1 class = "main-text">THIS IS THE LEVEL 3 VIEW</h1>    
        <div class = button-container> 
          <go-back-button @click="switchTo('ChooseLevelView')"></go-back-button>
        </div>
        </div>
      `,
  };