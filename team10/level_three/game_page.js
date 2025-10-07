// ==============================================
// Owned by Team 10
// ==============================================

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
        <h1 class="title">EatAndLearn</h1>

        <p class="instructions">Instructions: Write the Swedish word for the food item in the image.</p>
        <div class="button-container">
            <back-button @back="goBack"></back-button>
            <button class="start-btn" @click="$emit('start')">Start</button>
        </div>
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
            defaultImg: "assets/images/food/food.png"
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
            console.log('handleSubmit called with answer:', answer);
            alert(`You submitted: ${answer}`);
            this.nextWord();
        },
        nextWord() {
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
            console.log('nextWord called, next index:', this.currentIndex);
        },
        goBack() {
            this.currentView = 'menu';
        }
    }
};


const app = createApp({
    components: { MenuPage, GamePage, BackButton},
    data() {
        return { currentView: 'menu' };
    },
    template: `
    <menu-page v-if="currentView === 'menu'" @start="currentView='game'"></menu-page>
    <game-page v-else></game-page>
    `,
}).mount('#app');