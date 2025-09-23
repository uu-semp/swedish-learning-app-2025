import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import components from "./components/index.js";

const app = createApp({
  data() {
    return {
      currentView: "StartView", //Default start page
    };
  },

  methods: {
    switchViewTo(viewName) {
      this.currentView = viewName; // Sets the new view after button press
    },
  },

  template: `
    <component :is="currentView" :switch-to="switchViewTo"></component>  
    `, //The visual app shown through the index.html, passes the method switchViewTo which is taken as prop from child components
});

// Register all global components, created with help of generative AI
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.mount("#app");