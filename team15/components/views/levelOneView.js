import clothingItems from "/team15/clothing-items-info.js";

export const LevelOneView = {
    name: 'level-one-view',
    props: ['switchTo'],
    data() {
        return {
            showModal: false, // Controls the visibility of the modal
            showCorrectFeedback: false,
            showIncorrectFeedback: false,
            currentScore: 0, // Initial  player's score
            currentItem: null, 
            availableItems: clothingItems,
            currentIndex: 0,
            // Track attempts for the current item
            currentAttempts: 0,
            incorrectMessage: '',
            // Placeholder progress data
            totalTries: 0,
            correctAnswers: 0,
            showInfo:false,
        };
    },

    mounted() {
        this.startLevel();
    },

    methods: {
            startLevel() {
            if (this.availableItems && this.availableItems.length > 0) {
                this.currentItem = this.availableItems[this.currentIndex];
                    this.currentAttempts = 0;
                    this.incorrectMessage = '';
            } else {
                console.error("No clothing items found to start the level.");
            }
        },

        loadNextItem() {
            this.currentIndex++; 
            if (this.currentIndex < this.availableItems.length) {
                this.currentItem = this.availableItems[this.currentIndex];
                this.currentAttempts = 0;
                this.incorrectMessage = '';
            } else {
                console.log("Level Complete!");
            }
        },

        openModal() {
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.showInfo=false;
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

        // Placeholder progress tracking methods
        incrementTotalTries() {
            this.totalTries = (this.totalTries || 0) + 1;
        },

        recordCorrectAnswer() {
            this.correctAnswers = (this.correctAnswers || 0) + 1;
            // Reset attempts for the next question
            this.currentAttempts = 0;
        },

        recordIncorrectAttempt() {
            // Increment attempts for the current question and return the new value
            this.currentAttempts = Math.min(3, (this.currentAttempts || 0) + 1);
            return this.currentAttempts;
        },

      handleDropResult({ isCorrect, droppedItem }) {
            console.log('Drop result received in LevelOneView:', { isCorrect, droppedItem, expected: this.currentItem ? this.currentItem.ID : null });
            console.log(this.showInfo)
            // Record that the player made a try (placeholder for persistent storage)
            this.incrementTotalTries();
            if (isCorrect) {
                // Correct answer: reset attempts, show success, award point and go next
                this.currentAttempts = 0;
                this.incorrectMessage = '';
                this.showCorrectFeedback = true;
                this.currentScore++;
                // Track correct answers (placeholder)
                this.recordCorrectAnswer();
                setTimeout(() => {
                    this.showCorrectFeedback = false;
                    this.loadNextItem();
                }, 1500);
            } else {
                // Incorrect: increment attempts and choose the message
                const attempts = this.recordIncorrectAttempt();
                // Map attempts to translation keys
                const key = attempts === 1 ? 'wrong-try-1' : (attempts === 2 ? 'wrong-try-2' : 'wrong-try-3');
                this.incorrectMessage = this.$language.translate(key);

                // Show the incorrect feedback with dynamic message
                this.showIncorrectFeedback = true;

                // If third attempt, after showing message advance to next item
                if (this.currentAttempts >= 3) {
                    setTimeout(() => {
                        this.showIncorrectFeedback = false;
                        // ensure no points awarded, reset attempts and move on
                        this.currentAttempts = 0;
                        this.incorrectMessage = '';
                        this.loadNextItem();
                    }, 1500);
                } else {
                    // For attempts 1 or 2, just show message briefly
                    setTimeout(() => {
                        this.showIncorrectFeedback = false;
                    }, 1500);
                }
            }

            console.log('PLAYER DATA UPDATED:', { totalTries: this.totalTries, currentAttempts: this.currentAttempts, correctAnswers: this.correctAnswers, currentScore: this.currentScore });
        },
    },

    template: `
      <div class="level-one-view">
            <div class="level-header">

                <div class="score-counter">
                    <score-counter :score="currentScore" :item-amount="availableItems.length"></score-counter>
                </div>
                
                <dress-pelle-prompt :item="currentItem"></dress-pelle-prompt>
    
            </div>
            
            <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
            <incorrect-answer-feedback v-if="showIncorrectFeedback" :message="incorrectMessage"></incorrect-answer-feedback>         

            <div class="main-content-area">
                                <div class="pelle-wrapper">
                                        <pelle-container
                                            :expected-item-id="currentItem ? currentItem.ID : ''"
                                            @item-dropped="handleDropResult"
                                        ></pelle-container>
                                </div>
                <div class="wardrobe-wrapper">
                    <wardrobe-container></wardrobe-container>
                </div>
            </div>

            <div>
                <exit-game-button @click="openModal"></exit-game-button>
                <info-button @click="this.showInfo=true"></info-button>
            </div>
            <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click.stop>
                    <h2>{{$language.translate('exit-confirmation')}}</h2>
                    <div class="modal-buttons">
                        <button class="big-buttons" @click="confirmExit">{{$language.translate('yes')}}</button>
                        <button class="big-buttons" @click="closeModal">{{$language.translate('no')}}</button>
                    </div>
                </div>
            </div>
            <div v-if="this.showInfo" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click="this.showInfo=false">
                    <h2>{{$language.translate('information-message')}}</h2>
                    <div class="modal-buttons">
                        <button class="big-buttons" id="info-back-button" @click="this.showInfo=false">{{$language.translate('okay-continue')}}</button>
                    </div>
                </div>
            </div>
        </div>
      `,
};