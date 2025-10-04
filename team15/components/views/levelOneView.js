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
                this.showCorrectFeedback = true;
                setTimeout(() => {
                    this.showCorrectFeedback = false;
                }, 3000);
            } else {
                this.showIncorrectFeedback = true;
                setTimeout(() => {
                    this.showIncorrectFeedback = false;
                }, 3000);
            }
        },
    },

    template: `
      <div class="level-one-view">
            <div class="level-header">
                <h1>Level One</h1>
                <exit-game-button @click="openModal"></exit-game-button>
            </div>

            <div class="feedback-area">
                <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
                <incorrect-answer-feedback v-if="showIncorrectFeedback"></incorrect-answer-feedback>
            </div>

            <div class="main-content-area">
                <div class="pelle-wrapper">
                    <pelle-container @item-dropped="handleDropResult"></pelle-container>
                </div>
                <div class="wardrobe-wrapper">
                    <wardrobe-container></wardrobe-container>
                </div>
            </div>

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
