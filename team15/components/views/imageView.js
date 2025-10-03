export const ImagesView = {
  name: "images-view",
  props: ["switchTo"], // Receives navigation method from parent
  template: `
    <div>
      <!-- Blank page - add content here as needed -->
      <h1 class = "main-text">Images View.</h1> 

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
    </div>
  `,
};