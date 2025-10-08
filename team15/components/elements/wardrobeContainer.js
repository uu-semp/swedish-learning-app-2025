import clothingItems from "/team15/clothing-items-info.js"

export const WardrobeContainer = {
  name: "wardrobe-container",

  data() {
    return {
      selectedCategory: "accessories", // We set start state as categoryId 0 == chairs
      isDragging:false,

      categories: [
        {
          categoryId: "accessories",
          label: "accessories",
          icon: "./components/assets/team15Hat.png",
        },
        {
          categoryId: "shirts",
          label: "shirts",
          icon: "./components/assets/team15Shirt.png",
        },
        {
          categoryId: "pants",
          label: "pants",
          icon: "./components/assets/team15Pants.png",
        },
        {
          categoryId: "shoes",
          label: "shoes",
          icon: "./components/assets/team15Shoes.png",
        },
      ],
    };
  },

  props:{
    clothes:{
      type:Array,
      required:true,
    }
  },

  computed: {
    categoryItems() {
      console.log("Hello!!", this.clothes)
      const chosenItems = this.clothes.filter(items => items.Subcategory === this.selectedCategory);
      return chosenItems.slice(0,9);
    },
  },

  methods: {
    // Run when category buttons are pressed, sets the selected category id state
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
  },
  template: `
    <div class = "wardrobe">
        <!-- Feedback Components -->
        <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
        <incorrect-answer-feedback v-if="showIncorrectFeedback"></incorrect-answer-feedback>
    
        <div class="container">

        <!-- All the displayed images within the wardrobe container -->
          <clothing-item-button 
          v-for="item in categoryItems"
          :itemID="item.ID"
          :label="\`../../../\${item.Image_url}\`"
          :title="item.label"
          ></clothing-item-button>
        </div>
        
        <!-- The category clothing buttons -->
        <div class=category-container>
            <category-clothing-button
            v-for="cat in categories"
            :key="cat.categoryId"
            :label="cat.icon"
            :title="cat.label"
            @click="selectCategory(cat.categoryId)"
            :class="{selectedCategoryButton: selectedCategory == cat.categoryId}"
            ></category-clothing-button>
        </div>

    </div>
      `,
};

// Sets the rendered images dynamically based upon state of data and conditions, using for loops.
//<!-- @click="chosenItem(item.ID)"-->