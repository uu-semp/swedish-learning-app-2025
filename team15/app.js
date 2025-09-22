import { StartGameButton, HowToPlayButton } from "./components/buttons.js";
import { StartView } from "./views/startView.js";

const app = Vue.createApp({
    template : `
    <start-view></start-view>
    `

})

app.component("start-game-button", StartGameButton)
app.component("how-to-play-button", HowToPlayButton)
app.component("start-view", StartView)

app.mount("#app")
