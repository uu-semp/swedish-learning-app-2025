export const ImagesView = {
  name: "images-view",
  props: ["switchTo"], // Receives navigation method from parent
  
  template: `
    <div>
      <!-- Blank page - add content here as needed -->

      <!-- Hardcoded image for testing (using beanie from clothing-items-info.js) -->
      <div class="image-container">
        <img src="../../../assets/images/clothes/beanie.png" alt="Beanie" class="displayed-image" /> </div>

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
    </div>
  `,
};