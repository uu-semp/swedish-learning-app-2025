// ==============================================
// Owned by Team 10
// ==============================================

import {loadProgress, saveProgress} from '../dev-tools/cookies.js'

const { createApp } = Vue

const BackButton = {
    template: `
    <button class="back-btn" @click="$emit('back')">
        <i class="fa fa-arrow-left"></i>
    </button>
    `
};



const DisplayLevel = {
    template: `
    <h2 class="display-level">{{ LevelText }}</h2>
    `,
    data() {
        return {
            LevelText: 'Level 3 - Spelling'
        }
    }
}

const DisplayImage = {
    props: ['imgSrc'],
    template: `<img :src="imgSrc" alt="Alternative image text" class="display-image">`
};

const AnswerContainer = {
    template: `
    <form @submit.prevent="submitAnswer" class="answer-container">
        <input 
            type="text" 
            v-model="answer" 
            placeholder="Type the Swedish word" 
            class="answer-box"
            ref="answerInput">
        <button type="submit" class="submit-button">Submit</button>
    </form>
    `,
    data() {
        return { answer: ''}
    },
    emits: ['submit'], 
    methods: {
        submitAnswer() {
            console.log('submitAnswer called, answer=', this.answer)
            this.$emit('submit', this.answer)
            this.answer = ''
        },
        focusInput() {
            this.$refs.answerInput.focus();
        }
    }
};

const ModalPopup = {
    props: ['show', 'message', 'type'],
    template: `
    <div v-if="show" class="modal-overlay">
        <div class="modal-content" :class="type">
            <p>{{ message }}</p>
            <button 
                @click="$emit('close')" 
                class="modal-btn">
                    Close
            </button>
        </div>
    </div>
    `,
    emits: ['close'],
    methods: {
        handleEnter() {
            this.$emit('close')
        }
    }
};

const GamePage = {
    template: `
    <div class="game">
        <back-button @back="goBack"></back-button>
        <display-level></display-level>
        <display-image :imgSrc="currentImg"></display-image>
        <p class="english-word">
            What is the Swedish word for: <strong>{{ currentWord?.en || 'Loading...' }}</strong>?
        </p>
        <answer-container 
            ref="answerContainer" 
            @submit="handleSubmit"
        </answer-container>

        <modal-popup 
            :show="showModal" 
            :message="modalMessage" 
            :type="modalType" 
            @close="closeModal">
        </modal-popup>
    </div>
    `,
    components: { DisplayLevel, DisplayImage, AnswerContainer, BackButton, ModalPopup},
    data() {
        return {
            words: [], 
            currentIndex: 0,
            correctCount: 0, 
            defaultImg: "assets/images/food/food.png",
            showModal: false,
            modalMessage: '',
            modalType: '', 
        };
    },
    computed: {
        currentWord() {
            return this.words[this.currentIndex] || null;
        },
        currentImg() {
            return "../../" + this.currentWord?.img || this.defaultImg;
        }
    },
    async mounted() {
        if (!window.game_logic) {
            console.error("game_logic is not loaded");
            return;
        }
        this.words = await window.game_logic.getRandomWordSet(3);

        this.$nextTick(() => {
                this.focusAnswerInput();
            });
    },
    methods: {
        focusAnswerInput() {
            const answerComponent = this.$refs.answerContainer;
            if (answerComponent) answerComponent.focusInput();
        },
        handleSubmit(answer) {
            if (this.showModal) return;
            console.log('handleSubmit called with answer:', answer);
            if (this.currentWord && answer.toLowerCase() === this.currentWord.sv.toLowerCase()) {
                this.correctCount++;
                this.showFeedback(true);
            } else {
                this.showFeedback(false);
            }
            
        },
        nextWord() {
            if (this.currentIndex == (this.words.length - 1)) {
                this.$emit('game-over', { score: this.correctCount, total: this.words.length });
            }
            this.currentIndex++;
        },
        showFeedback(isCorrect) {
            const input = document.querySelector('.answer-box');
            if (input) input.blur();

            this.modalMessage = isCorrect ? 'Correct!' : 'Incorrect, Try again!';
            this.modalType = isCorrect ? 'correct' : 'incorrect';
            this.showModal = true;

            if (isCorrect){
                setTimeout(() => this.closeModal(), 1500);
            }
        },
        closeModal() {
            this.showModal = false;
            this.nextWord();
            this.focusAnswerInput();
        },
        endGame() {
            this.isGameOver = true;
            let progress = loadProgress(); // From cookies.js

            // Update score for level 3
            progress.levelScores[3] += this.score;
            let totalScore = progress.levelScores[3];

            if (totalScore >= 10) {
                // GAME COMPLETED 
                alert(`Congratulations! You finished the game!`);
                
                // Update main application stats
                window.save.stats.setCompletion("team10", 100);
                window.save.stats.incrementWin("team10");
            } else {
                alert(`Game over! You got ${this.score}/${this.words.length}. You need 10 correct answers to win.`);
            }

            saveProgress(progress); // Save final score to your cookie
            
            // Redirect back to the main menu after a short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        },
        goBack() {
            this.$emit('back');
        }
    }
};

const GameOverPage = {
    props: ['score', 'total'],
    template: `
    <div class="game-over">
        <h2>Game finished!</h2>
        <p>You got {{ score }} out of {{ total }} words correct!</p>
        <button @click="$emit('back-to-menu')">Back to Menu</button>
    </div>
    `
};

const app = createApp({
    components: { MenuPage, GamePage, GameOverPage },
    data() {
        return { 
            currentView: 'menu', 
            finalScore: 0,
            totalWords: 0 
        };
    },
    template: `
    <menu-page 
        v-if="currentView === 'menu'" 
        @start="currentView='game'"
    ></menu-page>
    <game-page 
        v-else-if="currentView === 'game'" 
        @back="currentView='menu'"
        @game-over="handleGameOver"
    ></game-page>
    <game-over-page 
        v-else-if="currentView === 'gameOver'"
        :score="finalScore"
        :total="totalWords"
        @back-to-menu="currentView = 'menu'"
    ></game-over-page>
    `,
    methods: {
        handleGameOver({ score, total }) {
            this.finalScore = score;
            this.totalWords = total;
            this.currentView = 'gameOver';
        }
    }
}).mount('#app');