import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
 import components from "./components/index.js";


const app = createApp({
  data(){
    return {
      currentView: "StartView"  //Default start page
    };
  },

  methods: {
    switchViewTo(viewName){
      this.currentView = viewName;
    }
  },
    template : `
    <component :is="currentView" :switch-to="switchViewTo"></component>
    `

})

// Register all global components, created with help of generative AI
Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });


app.mount("#app")
