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
      skyViews: ["StartView", "ChooseLevelView", "LevelOneView", "LevelTwoView", "HelpView"], // Views shown on top of the sky background
    };
  },

  methods: {
    switchViewTo(viewName) {
      this.currentView = viewName; // Sets the new view after button press
    },
  },

  template: `
    <sky-background v-if="skyViews.includes(currentView)">
      <language-selection>
        <!-- Help button next to the flags, only on the start view -->
        <capsule-button
          v-if="currentView === 'StartView'"
          size="sm"
          label="?"
          :translate-key="false"
          :title="$language.translate('help')"
          @click="switchViewTo('HelpView')"
        ></capsule-button>
      </language-selection>
      <component :is="currentView" :switch-to="switchViewTo"></component>
    </sky-background>
    <component v-else :is="currentView" :switch-to="switchViewTo"></component>
    `, //The visual app shown through the index.html, passes the method switchViewTo which is taken as prop from child components
    // Views in skyViews are placed inside the sky background, which stays mounted while switching between them
    // The language flags are shown once here, on top of every sky view
});

app.config.globalProperties.$language = language;
language.load("en");


// Register all global components, created with help of generative AI
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.mount("#app");