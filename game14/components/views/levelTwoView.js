export const LevelTwoView = {
    name: "level-two-view",
    props: ["switchTo"],
    template: `
        <div>
        <h1 class = "main-text">THIS IS THE LEVEL 2 VIEW</h1>    
        <div class = button-container> 
          <capsule-button label="go-back" size="md" @click="switchTo('ChooseLevelView')"></capsule-button>
        </div>
        </div>
      `,
  };
