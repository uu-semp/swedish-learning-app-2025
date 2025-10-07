export const LevelOneView = {
    name: 'level-one-view',
    props: ['switchTo'],
    data() {
        return {
            showModal: false, // Controls the visibility of the modal
            currentQuestion: 1,
            totalQuestions: 10
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
            // Use the actual result from the pelle container component
            // Pass the result to the tries manager
            this.$refs.triesManager.handleAttempt(isCorrect);
        },
        
        onQuestionCompleted(result) {
            console.log('Question completed:', result);
            // Handle question completion (success or failure after max tries)
        },
        
        onReadyForNextQuestion() {
            this.moveToNextQuestion();
        },
        
        moveToNextQuestion() {
            console.log(`Moving from question ${this.currentQuestion} to ${this.currentQuestion + 1}`);
            this.currentQuestion++;
            console.log(`Now on question ${this.currentQuestion} of ${this.totalQuestions}`);
        }
    },

    template: `
      <div class="level-one-view">
            <div class="level-header">
                <h1>{{$language.translate('level1')}}</h1>
                <exit-game-button @click="openModal"></exit-game-button>
            </div>

            <tries-manager 
                ref="triesManager"
                @question-completed="onQuestionCompleted"
                @ready-for-next-question="onReadyForNextQuestion">
                
                <div class="main-content-area">
                    <div class="pelle-wrapper">
                        <pelle-container @item-dropped="handleDropResult"></pelle-container>
                    </div>
                    <div class="wardrobe-wrapper">
                        <wardrobe-container></wardrobe-container>
                    </div>
                </div>
                
            </tries-manager>

            <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click.stop>
                    <h2>{{$language.translate('exit-confirmation')}}</h2>
                    <div class="modal-buttons">
                        <button class="big-buttons" @click="confirmExit">{{$language.translate('yes')}}</button>
                        <button class="big-buttons" @click="closeModal">{{$language.translate('no')}}</button>
                    </div>
                </div>
            </div>
        </div>
      `,
};
