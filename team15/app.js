import { createApp, reactive } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import components from "./components/index.js";

// Global reactive language object, which sets language for whole application
const language = reactive({
  selectedLanguage: "en",
  translations: {}, 

  async load(language){
    this.selectedLanguage = language;

    try {
       // Fetch right JSON language file depending on the language
      const response = await fetch(`./language/${language === "sv" ? "swedish.json" : "english.json"}`);
      this.translations = await response.json();

      console.log("Loaded language: ", language)   
    }
    catch (err){
      console.error("Failed to load language!", err)
    }
  },
  translate(key) {
    // Return the text for this key or the key itself if not found
    return this.translations[key] || key;
  }
})

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

app.config.globalProperties.$language = language;
language.load("en");


// Register all global components, created with help of generative AI
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.mount("#app");