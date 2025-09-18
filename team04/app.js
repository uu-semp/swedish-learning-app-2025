import gameView from "./components/gameView.js";
import clock from "./components/clock.js";
import cards from "./components/cards.js";
import navigation from "./components/navigation.js";
import statistics from "./components/statistics.js";
import finishView from "./components/finishView.js";

const app = Vue.createApp({
  data() {
    return {
      currentView: 'game' // can be 'game', 'finish', or 'review'
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentView) {
        case 'game': return 'game-view';
        case 'finish': return 'finish-view';
        case 'review': return 'review-view';
        default: return 'game-view'; // fallback
      }
    }
  },
  template: `<component :is="currentComponent"></component>`
});

app.component("game-view", gameView);
app.component("clock", clock);
app.component("cards", cards);
app.component("navigation", navigation);
app.component("statistics", statistics);
app.component("finish-view", finishView);

app.mount("#app");
