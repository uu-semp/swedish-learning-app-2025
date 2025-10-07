import gameView from "./components/gameView.js";
import clock from "./components/clock.js";
import cards from "./components/cards.js";
import navigation from "./components/navigation.js";
import statistics from "./components/statistics.js";
import finishView from "./components/finishView.js";
import setClock from "./utils/setClock.js";
import startView from "./components/startView.js";

const app = Vue.createApp({
  template: `
  <component :is="currentComponent"
              :selected-level="selectedLevel"
               @level-selected="handleLevelSelected"></component>
  `,
  data() {
    return {
      currentView: 'start', // can be 'start', 'game', 'finish', or 'review'
      vocabReady: false,
      selectedLevel: null // will hold the level selected by the user
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentView) {
        case 'start': return 'start-view';
        case 'game': return 'game-view';
        case 'finish': return 'finish-view';
        case 'review': return 'review-view';
        default: return 'start-view'; // fallback
      }
    }
  },
  created() {
    //load data for Team04 (team ID = 4)
    window.vocabulary.load_team_data(4);
  },
  mounted() {
    setClock(24, 60);
  },
  methods: {
    handleLevelSelected(levelNum) {
      this.selectedLevel = levelNum;
      this.currentView = 'game'; // Switch to game view after level selection
    }
  }
});

app.component("game-view", gameView);
app.component("start-view", startView);
app.component("clock", clock);
app.component("cards", cards);
app.component("navigation", navigation);
app.component("statistics", statistics);
app.component("finish-view", finishView);

app.mount("#app");
