import clothingItems from "/game14/clothing-items-info.js"

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
          icon: "./components/assets/game14Hat.png",
        },
        {
          categoryId: "shirts",
          label: "shirts",
          icon: "./components/assets/game14Shirt.png",
        },
        {
          categoryId: "pants",
          label: "pants",
          icon: "./components/assets/game14Pants.png",
        },
        {
          categoryId: "shoes",
          label: "shoes",
          icon: "./components/assets/game14Shoes.png",
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