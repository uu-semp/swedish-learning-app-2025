export const WardrobeContainer = {
  name: "wardrobe-container",

  data() {
    return {
      selectedCategory: "Accessories", // We set start state as categoryId 0 == chairs

      categories: [
        {
          categoryId: "Accessories",
          label: "Accessories",
          icon: "./components/assets/team15Hat.png",
        },
        {
          categoryId: "Shirts",
          label: "Shirts",
          icon: "./components/assets/team15Shirt.png",
        },
        {
          categoryId: "Pants",
          label: "Pants",
          icon: "./components/assets/team15Pants.png",
        },
        {
          categoryId: "Shoes",
          label: "Shoes",
          icon: "./components/assets/team15Shoes.png",
        },
      ],

      clothingItemCategories: {
        Accessories: [
          {
            id: 0,
            label: "Accessories 1",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 1,
            label: "Accessories 2",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 2,
            label: "Accessories 3",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 3,
            label: "Accessories 4",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 4,
            label: "Accessories 5",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 5,
            label: "Accessories 6",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 6,
            label: "Accessories 7",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 7,
            label: "Accessories 8",
            icon: "./components/assets/team15Hat.png",
          },
          {
            id: 8,
            label: "Accessories 9",
            icon: "./components/assets/team15Hat.png",
          },
        ],

        Shirts: [
          {
            id: 9,
            label: "Shirts 1",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 10,
            label: "Shirts 2",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 11,
            label: "Shirts 3",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 12,
            label: "Shirts 4",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 13,
            label: "Shirts 5",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 14,
            label: "Shirts 6",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 15,
            label: "Shirts 7",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 16,
            label: "Shirts 8",
            icon: "./components/assets/team15Shirt.png",
          },
          {
            id: 17,
            label: "Shirts 9",
            icon: "./components/assets/team15Shirt.png",
          },
        ],

        Pants: [
          {
            id: 18,
            label: "Pants 1",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 19,
            label: "Pants 2",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 20,
            label: "Pants 3",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 21,
            label: "Pants 4",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 22,
            label: "Pants 5",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 23,
            label: "Pants 6",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 24,
            label: "Pants 7",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 25,
            label: "Pants 8",
            icon: "./components/assets/team15Pants.png",
          },
          {
            id: 26,
            label: "Pants 9",
            icon: "./components/assets/team15Pants.png",
          },
        ],

        Shoes: [
          {
            id: 27,
            label: "Shoes 1",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 28,
            label: "Shoes 2",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 29,
            label: "Shoes 3",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 30,
            label: "Shoes 4",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 31,
            label: "Shoes 5",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 32,
            label: "Shoes 6",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 33,
            label: "Shoes 7",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 34,
            label: "Shoes 8",
            icon: "./components/assets/team15Shoes.png",
          },
          {
            id: 35,
            label: "Shoes 9",
            icon: "./components/assets/team15Shoes.png",
          },
        ],
      },
    };
  },

  computed: {
    categoryItems() {
      // when selectedCategory changes this automatically runs and changes the shown images
      return this.clothingItemCategories[this.selectedCategory];
    },
  },

  methods: {
    // Run when category buttons are pressed, sets the selected category id state
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },

    //Do something when an item is chosen
    chosenItem(clothingId) {
      
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

// Sets the rendered images dynamically based upon state of data and conditions, using for loops.
