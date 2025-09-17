const app = Vue.createApp({
  data() {
    return {
      currentView: 'finish' // can be 'game', 'finish', or 'review'
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentView) {
        case 'game': return 'game-view';
        case 'finish': return 'finish-view';
        case 'review': return 'review-view';
      }
    }
  },
  template: `<component :is="currentComponent"></component>`
});

// Use globally defined components (retrieved from window.xxx)
app.component("game-view", window.gameView);
app.component("clock", window.clock);
app.component("cards", window.cards);
app.component("navigation", window.navigation);
app.component("statistics", window.statistics);
app.component("finish-view", window.finishView);

app.mount("#app");
