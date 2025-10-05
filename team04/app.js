import gameView from "./components/gameView.js";
import clock from "./components/clock.js";
import cards from "./components/cards.js";
import navigation from "./components/navigation.js";
import statistics from "./components/statistics.js";
import finishView from "./components/finishView.js";
import setClock from "./utils/setClock.js";
import startView from "./components/startView.js";

const app = Vue.createApp({

  data() {
    return {
      currentView: 'start' // can be 'start', 'game', 'finish', or 'review'
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
  mounted() {
    setClock(24, 60);
  },
  template: `
  <component :is="currentComponent"></component>
  `
});

app.component("game-view", gameView);
app.component("start-view", startView);
app.component("clock", clock);
app.component("cards", cards);
app.component("navigation", navigation);
app.component("statistics", statistics);
app.component("finish-view", finishView);

app.mount("#app");
