export const LevelTwoView = {
    name: "level-two-view",
    props: ["switchTo"],
    template: `
        <div>
        <h1 class = "main-text">THIS IS THE LEVEL 2 VIEW</h1>    
        <div class = button-container> 
          <go-back-button @click="switchTo('ChooseLevelView')"></go-back-button>
        </div>
        </div>
      `,
  };

  console.log("hej från levelTwoView")