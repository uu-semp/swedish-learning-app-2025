// ==============================================
// Owned by Team 10
// ==============================================

const { createApp } = Vue

const DisplayLevel = {
    template: `
    <h2 class="display-level">{{ LevelText }}</h2>
    `,
    data() {
        return {
            LevelText: 'Level 3'
        }
    }
}

const DisplayInstructions = {
    template: `
        <div class="display-instructions">
            <p>{{ LevelInstructions }}</p>
        </div>
        `,
    data() {
        return {
            LevelInstructions: 'Instructions: Given the image and the English word, write the Swedish word. Then press “Enter” to submit your response.'
        }
    }
}

const DispayImage = {
    template: `
    <img :src="imgSrc" alt="Alternative image text" class=display-image>
    `,
    data() { 
        return {imgSrc: "../../assets/images/food/food.png"}
    }
}

const AnswerContainer = {
    template: `
    <form @submit.prevent="submitAnswer" class="answer-container">
        <input type="text" v-model="answer" placeholder="Type the Swedish word" class="answer-box">
        <button type="submit" class="submit-button">Submit</button>
    </form>
    `,
    methods: {
        submitAnswer() {
            console.log('submitAnswer called, answer=', this.answer)
            alert('Your answer: ' + this.answer)
            this.answer = ''
        }
    },
    data() {
        return { answer: ''}
    }
}

const BackToMenu = {
    template: `
    <button @click="goBack" class="back-btn">
        <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    `,
    methods: {
        goBack() {
            window.location.href = 'level_three.html'
        }
    }
}


const app = createApp({})

app.component('display-level', DisplayLevel)
app.component('display-instructions', DisplayInstructions)
app.component('display-image', DispayImage)
app.component('answer-container', AnswerContainer)
app.component('back-to-menu', BackToMenu)

app.mount('#app')