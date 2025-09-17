// components/gameView.js
window.gameView = {
  name: "GameView",
  template: `
    <div>
      <statistics></statistics>
      <section class="center-section">
        <clock></clock>
        <cards></cards>
      </section>
      <navigation></navigation>
      <!-- test switch to finish view-->
    <button @click="$root.currentView = 'finish'">Switch to FinishView</button>
    </div>
  `
};
