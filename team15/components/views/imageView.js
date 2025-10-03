import clothingItems from "/team15/clothing-items-info.js";

export const ImagesView = {
  name: "images-view",
  props: ["switchTo"], // Receives navigation method from parent
  
  mounted () {
    console.log(clothingItems);
    console.log(clothingItems.length);
  },

  data() {
    return {
      itemName: "sneakers" // Local variable for item name (can be changed dynamically if needed)
    };
  },

  // Compute the current item based on itemName
  computed: {
    currentItem() {
      // Find the clothing item object that matches the itemName
      return clothingItems.find(item => item.English === this.itemName);
    }
  },

  template: `
    <div class="main-container">
      <!-- Dynamic image based on currentItem -->
      <div class="image-container">
        <img v-if="currentItem" :src="\`../../../\${currentItem.Image_url}\`" :alt="\`\${currentItem.English}\`" class="displayed-image" />
      </div>

      <!-- Item Details -->
      <div class="item-details" v-if="currentItem">
        <p><strong>ID:</strong> {{ currentItem.ID }}</p>
        <p><strong>English word:</strong> {{ currentItem.English }}</p>
        <p><strong>Article:</strong> {{ currentItem.Article || 'N/A' }}</p>
        <p><strong>Swedish word:</strong> {{ currentItem.Swedish }}</p>
        <p><strong>Swedish plural:</strong> {{ currentItem.Swedish_plural || 'N/A' }}</p>
        <p><strong>Category:</strong> {{ currentItem.Category }}</p>
        <p><strong>Subcategory:</strong> {{ currentItem.Subcategory || 'N/A' }}</p>
        <p><strong>Image URL:</strong> {{ currentItem.Image_url }}</p>
      </div>

      <!-- Back button -->
      <div class="button-container"> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
    </div>
  `,
};