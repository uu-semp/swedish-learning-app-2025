export default {
  name: "FinishView",
  computed: {
    stats() {
      return this.$root.finishStats || {
        correct: 0, incorrect: 0, skipped: 0, percent: 0, durationMs: 0
      };
    },
    duration() {
      const ms = this.stats.durationMs;
      const sec = Math.floor(ms / 1000) % 60;
      const min = Math.floor(ms / 60000);
      return `${min}m ${sec}s`;
    }
  },
  template: `
    <div class="finish-summary">
      <h2>Game Summary</h2>
      <p>Correct Answers: {{ stats.correct }}</p>
      <p>Incorrect Answers: {{ stats.incorrect }}</p>
      <p>Skipped Questions: {{ stats.skipped }}</p>
      <p>Percentage Correct: {{ stats.percent }}%</p>
      <p>Time Taken: {{ duration }}</p>
      <button @click="$root.currentView = 'game'">Play Again</button>
    </div>
  `
};