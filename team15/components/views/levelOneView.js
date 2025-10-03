export const LevelOneView = {
    name: 'level-one-view',
    props: ['switchTo'],
    data() {
        return {
            showModal: false, // Controls the visibility of the modal
            showCorrectFeedback: false,
            showIncorrectFeedback: false,
        };
    },

    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        confirmExit() {
            this.switchTo('ChooseLevelView'); // Navigate to ChooseLevelView
            this.closeModal();
        },
        handleOverlayClick(event) {
            if (event.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        },
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
        <div class=level-one-view>
          <h1>THIS IS THE LEVEL 1 VIEW</h1>
          <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
          <incorrect-answer-feedback v-if="showIncorrectFeedback"></incorrect-answer-feedback>
          <div class="drop-zone" 
               @drop="handleItemDrop" 
               @dragover="handleDragOver"
               @dragleave="handleDragLeave">
            'Drop Item Here'
          </div>


          
          <wardrobe-container></wardrobe-container>    
          <div class = button-container> 
            <exit-game-button @click="openModal"></exit-game-button>
          </div>

          <!-- Modal Overlay -->
          <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
            <div class="modal-content" @click.stop>
              <h2>Are you sure you want to quit level 1?</h2>
              <div class="modal-buttons">
                <button class="big-buttons" @click="confirmExit">Yes</button>
                <button class="big-buttons" @click="closeModal">No</button>
              </div>
            </div>
          </div>
        </div>
      `,
};
