import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
 import components from "./components/index.js";


const app = createApp({
  data(){
    return {
      currentView: "StartView"  //First default page
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

console.log("HELLO?")
// register all global components by gen AI
Object.entries(components).forEach(([name, component]) => {
    console.log("HELLO", component, name)
    app.component(name, component);
  });


app.mount("#app")
