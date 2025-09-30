import gameView from "./components/gameView.js";
import clock from "./components/clock.js";
import cards from "./components/cards.js";
import navigation from "./components/navigation.js";
import statistics from "./components/statistics.js";
import finishView from "./components/finishView.js";
import headerComponent from "./components/header.js";
import footerComponent from "./components/footer.js";
import setClock from "./utils/setClock.js";

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
  mounted() {
    setClock(23, 30);
  },
  template: `
  <header-component></header-component>
  <component :is="currentComponent"></component>
  <footer-component></footer-component>`
});

app.component("game-view", gameView);
app.component("clock", clock);
app.component("cards", cards);
app.component("navigation", navigation);
app.component("statistics", statistics);
app.component("finish-view", finishView);
app.component("header-component", headerComponent);
app.component("footer-component", footerComponent);

app.mount("#app");
