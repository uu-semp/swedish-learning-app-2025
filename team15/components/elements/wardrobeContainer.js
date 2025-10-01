export const WardrobeContainer = {
  name: "wardrobe-container",
  data() {
    return {
      showCorrectFeedback: false,
      showIncorrectFeedback: false,
    };
  },
  methods: {
    handleItemDrop(event) {
      // Prevent default to allow drop
      event.preventDefault();
      
      // Get the dragged data
      const droppedItem = event.dataTransfer.getData('text/plain');
      console.log('Dropped item:', droppedItem);
      
      // For now, we'll randomly show correct or incorrect feedback
      // Later this will be replaced with actual game logic
      const isCorrect = Math.random() > 0.5;
      
      if (isCorrect) {
        this.showIncorrectFeedback = false;
        this.showCorrectFeedback = true;
        // Hide feedback after 3 seconds
        setTimeout(() => {
          this.showCorrectFeedback = false;
        }, 3000);
      } else {
        this.showCorrectFeedback = false;
        this.showIncorrectFeedback = true;
        // Hide feedback after 3 seconds
        setTimeout(() => {
          this.showIncorrectFeedback = false;
        }, 3000);
      }
    },
    
    handleDragOver(event) {
      // Prevent default to allow drop
      event.preventDefault();
      // Add visual feedback
      event.target.classList.add('drag-over');
    },
    
    handleDragLeave(event) {
      // Remove visual feedback
      event.target.classList.remove('drag-over');
    }
  },
  template: `
    <div class = "wardrobe">
        <!-- Drop Zone Area -->
        <div class="drop-zone" 
             @drop="handleItemDrop" 
             @dragover="handleDragOver"
             @dragleave="handleDragLeave">
          'Drop Item Here'
        </div>
        
        <!-- Feedback Components -->
        <CorrectAnswerFeedback v-if="showCorrectFeedback"></CorrectAnswerFeedback>
        <IncorrectAnswerFeedback v-if="showIncorrectFeedback"></IncorrectAnswerFeedback>
    
        <div class="container">
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
            <clothing-item-button :label="'../../../assets/furniture/chair.png'"></clothing-item-button>
        </div>
        
        <div class="category-container">
            <category-clothing-button :label="'../../../assets/furniture/chair.png'"></category-clothing-button>
            <category-clothing-button :label="'../../../assets/furniture/chair.png'"></category-clothing-button>
            <category-clothing-button :label="'../../../assets/furniture/chair.png'"></category-clothing-button>
            <category-clothing-button :label="'../../../assets/furniture/chair.png'"></category-clothing-button>
        </div>

    </div>
      `,
};

// Uses the chair image as placeholder!
