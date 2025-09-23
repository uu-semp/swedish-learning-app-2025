export const StartView =  {
    name: "start-view",
    props: ["switchTo"],
    template: `
      <div>
      <header class = "main-text">WELCOME TO THE DRESSING PELLE GAME</header> 
      <div class = button-grid>
        <div class = button-container> 
          <start-game-button :switch-to="switchTo"></start-game-button>
        </div>
        <div class = button-container> 
          <how-to-play-button :switch-to="switchTo"></how-to-play-button>
        </div>
        </div>
        <info-button></info-button>
      </div>
    `
  };