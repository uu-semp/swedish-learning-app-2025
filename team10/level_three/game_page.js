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

const MenuPage = {
    components: {BackButton},
    template: `      
    <div class="container">
        <h2 style="text-align:center; margin-top:4rem;">Level 3 - Spelling</h2>
        <div class="button-container">
            <button class="start-btn" @click="$emit('start')">Start</button>
            <button class="learning-mode-btn" @click="goBack">Menu</button>
        </div>
        <p class="instructions">Instructions: Write the Swedish word for the food item in the image.</p>
        <div class="progress-container">
            <div class="progress-icon">
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        goBack() {
            window.location.href = '../index.html'
        }
    }  
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
    <div class="input-container">
        <div class="swedish-char-btns">
            <button type="button" @click="insertChar('å')">å</button>
            <button type="button" @click="insertChar('ä')">ä</button>
            <button type="button" @click="insertChar('ö')">ö</button>
        </div>
        <form @submit.prevent="submitAnswer" class="answer-container">
            <input 
                type="text" 
                v-model="answer" 
                placeholder="Type the Swedish word" 
                class="answer-box"
                ref="answerInput"
            >
            <button type="submit" class="start-btn">Submit</button>
        </form>
    </div>
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
        },
        insertChar(char) {
            const input = this.$refs.answerInput;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.answer = this.answer.substring(0, start) + char + this.answer.substring(end);

            this.$nextTick(() => {
                input.setSelectionRange(start + 1, start + 1);
                input.focus();
            })
        }
    }
};

const ModalPopup = {
    props: ['show', 'message', 'type', 'userAnswer', 'englishWord', 'correctWord'],
    template: `
    <div v-if="show" class="modal-overlay">
        <div class="modal-content" :class="type">
            <p v-if="type === 'correct'">
                <strong>Correct!</strong><br>
                 <em>{{ message }}</em>
            </p>

            <p v-else-if="type === 'incorrect'">
                <strong>Incorrect!</strong><br>
                You answered: <span class="user-answer">{{ userAnswer }}</span><br>
                The Swedish word for <strong>{{ englishWord }}</strong> is: 
                <strong class="correct-word">{{ correctWord }}</strong>
            </p>

            <p v-else>
              {{ message }}
            </p>
            <button 
                ref="enterButton"
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
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs.enterButton.focus();
                })
            }
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
            :user-answer="userAnswer"
            :english-word="englishWord"
            :correct-word="correctWord"
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
            userAnswer: '',
            englishWord: '',
            correctWord: '',
            compliments: [
                "Great job!",
                "Awesome work!",
                "You nailed it!",
                "Fantastic!",
                "Keep it up!",
                "Perfect answer!",
                "Well done!",
                "You're on fire!",
                "Impressive!",
                "Excellent!"
            ]        
        };
    },
    computed: {
        currentWord() {
            return this.words[this.currentIndex] || null;
        },
        currentImg() {
            return  this.currentWord?.img
                ? "../../" + this.currentWord.img
                : "../../" + this.defaultImg;
        }
    },
    async mounted() {
        if (!window.game_logic) {
            console.error("game_logic is not loaded");
            return;
        }
        this.words = await window.game_logic.getRandomWordSet(10);

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
                this.showFeedback(true, answer);
            } else {
                this.showFeedback(false, answer);
            }
            
        },
        nextWord() {
            if (this.currentIndex == (this.words.length - 1)) {
                this.endGame();
            }
            this.currentIndex++;
        },
        showFeedback(isCorrect, answer) {
            const input = document.querySelector('.answer-box');
            if (input) input.blur();

                if (isCorrect) {
                    const randomIndex = Math.floor(Math.random() * this.compliments.length);
                    const randomCompliment = this.compliments[randomIndex];
                    this.modalType = 'correct';
                    this.modalMessage = randomCompliment;
                } else {
                    this.modalType = 'incorrect';
                    this.userAnswer = answer;
                    this.englishWord = this.currentWord.en;
                    this.correctWord = this.currentWord.sv;
                }

            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.nextWord();
            this.focusAnswerInput();
        },
        endGame() {
            let progress = loadProgress(); // From cookies.js

            // Update score for level 3
            progress.levelScores[3] += this.correctCount;
            let totalScore = progress.levelScores[3];
            console.log('totalscore: ', totalScore)

            if (totalScore >= 10) {
                // Update main application stats
                window.save.stats.setCompletion("team10", 100);
                window.save.stats.incrementWin("team10");
            }

             // GAME COMPLETED 
            this.$emit('game-over', { score: this.correctCount, total: this.words.length, won: ( this.correctCount/this.words.length >= 0.8 )}); 
 
            saveProgress(progress); // Save final score to your cookie
        },
        goBack() {
            this.$emit('back');
        }
    }
};

const GameOverPage = {
  props: ['score', 'total', 'won'],
  template: `
    <div class="game-over" :class="{ win: won, lose: !won }">
      <h2 v-if="won">Congratulations!</h2>
      <h2 v-else>Game Over</h2>

      <p v-if="won">
        You finished the game! You got <strong>{{ score }}</strong> out of <strong>{{ total }}</strong> correct.
      </p>
      <p v-else>
        You got <strong>{{ score }}</strong> out of <strong>{{ total }}</strong>. You need 10 correct answers to win.
      </p>

      <button class="menu-btn" @click="$emit('back-to-menu')">Back to Menu</button>
    </div>
  `
};


const app = createApp({
    components: { MenuPage, GamePage, GameOverPage },
    data() {
        return { 
            currentView: 'menu', 
            finalScore: 0,
            totalWords: 0,
            playerWon: false 
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
        :won="playerWon"
        @back-to-menu="currentView = 'menu'"
    ></game-over-page>
    `,
    methods: {
        handleGameOver({ score, total, won }) {
            this.finalScore = score;
            this.totalWords = total;
            this.playerWon = won;
            this.currentView = 'gameOver';
        }
    }
}).mount('#app');