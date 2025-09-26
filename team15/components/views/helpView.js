export const HelpView = {
  name: "help-view",
  props: ["switchTo"],
  template: `
      <div>
      <h1 class = "main-text">THIS IS THE HELP VIEW</h1>    
      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
      </div>
    `,
};