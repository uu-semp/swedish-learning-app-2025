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

const app = createApp({})

app.component('display-level', DisplayLevel)
app.component('display-instructions', DisplayInstructions)


app.mount('#app')