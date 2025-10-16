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
        <input type="text" v-model="answer" placeholder="Type the Swedish word" class="answer-box">
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
        }
    }
};

const GamePage = {
    template: `
    <div class="game">
        <back-button @back="goBack"></back-button>
        <display-level></display-level>
        <display-image :imgSrc="currentImg"></display-image>
        <p class="english-word">What is the Swedish word for: <strong>{{ currentWord?.en || 'Loading...' }}</strong>?</p>
        <answer-container @submit="handleSubmit"></answer-container>
    </div>
    `,
    components: { DisplayLevel, DisplayImage, AnswerContainer, BackButton },
    data() {
        return {
            words: [], 
            currentIndex: 0, 
            defaultImg: "assets/images/food/food.png",
            score: 0, 
            questionsAnswered: 0, 
            isGameOver: false
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
        this.words = await window.game_logic.getRandomWordSet();
        console.log('Words loaded:', this.words);
    },
    methods: {
        handleSubmit(answer) {
            if (this.isGameOver) return;

            const correctAnswer = this.currentWord.sv;
            
            // Compare the user's answer (case-insensitive and trimmed)
            if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
                this.score++;
                // Optional: Visual feedback for correct answer
                document.body.style.backgroundColor = '#d4edda';
            } else {
                // Optional: Visual feedback for incorrect answer
                document.body.style.backgroundColor = '#f8d7da';
            }

            // Reset background color after a moment
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 300);

            this.questionsAnswered++;
            
            if (this.questionsAnswered >= this.words.length) {
                this.endGame();
            } else {
                this.nextWord();
            }
        },
        nextWord() {
            this.currentIndex++;
            console.log('nextWord called, next index:', this.currentIndex);
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
            // This should switch the view back to the menu component
            this.$root.currentView = 'menu';
        }
    }
};


const app = createApp({
    components: { GamePage, BackButton},
    template: `
    <game-page v-else></game-page>
    `,
}).mount('#app');