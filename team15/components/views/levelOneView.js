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
      handleDropResult({ isCorrect }) {
            if (isCorrect) {
                this.showIncorrectFeedback = false;
                this.showCorrectFeedback = true;
                setTimeout(() => {
                    this.showCorrectFeedback = false;
                }, 3000);
            } else {
                this.showCorrectFeedback = false;
                this.showIncorrectFeedback = true;
                setTimeout(() => {
                    this.showIncorrectFeedback = false;
                }, 3000);
            }
        },
    },

    template: `
        <div class=level-one-view>
          <h1>THIS IS THE LEVEL 1 VIEW</h1>
          <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
          <incorrect-answer-feedback v-if="showIncorrectFeedback"></incorrect-answer-feedback>
          <pelle-container @item-dropped="handleDropResult"></pelle-container>
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
