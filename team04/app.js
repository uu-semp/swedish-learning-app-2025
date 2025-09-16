import cards from "./components/cards.js";
import clock from "./components/clock.js";
import navigation from "./components/navigation.js";
import statistics from "./components/statistics.js";

const app = Vue.createApp({});
app.component('cards', cards);
app.component('clock', clock);
app.component('navigation', navigation);
app.component('statistics', statistics);
app.mount('#app');