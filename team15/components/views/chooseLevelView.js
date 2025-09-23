export const ChooseLevelView =  {
    name: "choose-level-view",
    props: ["switchTo"],
    template: `
      <div>
      <header class = "main-text">CHOOSE LEVEL</header>    
      <div class = button-container> 
        <go-back-button :switch-to="switchTo"></go-back-button>
      </div>
      </div>
    `
  };