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


const app = createApp({})

app.component('display-level', DisplayLevel)


app.mount('#app')