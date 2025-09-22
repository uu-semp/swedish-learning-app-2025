import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
 import components from "./components/index.js";


const app = createApp({
    template : `
    <start-view></start-view>
    `

})

// register all global components by gen AI
Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });


app.mount("#app")
