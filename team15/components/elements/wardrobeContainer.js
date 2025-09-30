export const WardrobeContainer = {
  name: "wardrobe-container",
  
  data(){
    return {
        
        selectedCategory:0, // We set start state as categoryId 0 == chairs

        categories : [
          {categoryId:0, label:"Chairs", icon:"../../../assets/furniture/chair.png"},
          {categoryId:1, label:"Hats", icon:"../../../assets/main_menu/images/UU_logo.png"}
        ],

        clothingItems:[
          {categoryId: 0, label: "Chair 1", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 2", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 3", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 4", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 5", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 6", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 7", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 8", icon: "../../../assets/furniture/chair.png"},
          {categoryId: 0, label: "Chair 9", icon: "../../../assets/furniture/chair.png"},
          
          {categoryId: 1, id:0, label: "UU 1", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:1, label: "UU 2", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:2, label: "UU 3", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:3, label: "UU 4", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:4, label: "UU 5", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:5, label: "UU 6", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:6, label: "UU 7", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:7, label: "UU 8", icon: "../../../assets/main_menu/images/UU_logo.png"},
          {categoryId: 1, id:8, label: "UU 9", icon: "../../../assets/main_menu/images/UU_logo.png"},
        ]
    }
  },

  computed: {
    categoryItems() {  // when selectedItem changes this automatically runs and changes the shown images
      return this.clothingItems.filter(
        (item) => item.categoryId === this.selectedCategory
      );
    },
  },

  methods: {
    selectCategory(categoryId) {  // Run when category buttons are pressed, sets the selected category id state
      this.selectedCategory = categoryId;  
      console.log(this.selectedCategory);
    },

    chosenItem(clothingId) { 
      console.log(clothingId);
    },

  },

  template: `
    <div class = "wardrobe">
    
        <div class="container">

          <clothing-item-button 
          v-for="item in categoryItems"
          :key="item.categoryId"
          :label="item.icon"
          :title="item.label"
          @click="chosenItem(item.id)"
          ></clothing-item-button>

        </div>
        
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

// Sets the rendered images dynamically based upon state of data and conditions