export default {
  name: "Navigation",
  props: {
    hasSelection: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <nav class="navigation">
        <button class="level-select-btn" title="Return to level selection menu">Level select menu</button>
        <button class="reset-btn" title="Reset the current game session" @click='$emit("reset")'>Reset session</button>
        <button class="level-btn" title="Previous question" @click='$emit("prev")'>&#8678;</button>
        <button class="level-btn" title="Next question" @click='$emit("next")' :style="highlightNextQuestionBtn">&#8680;</button>
    </nav>
  `,
  computed: {
    /**
     * Create a "blinking effect" by changing the background-color of
     * the Next button when user has made an answer
     * @returns {CSS} CSS animation propert
     */
    highlightNextQuestionBtn() {
      console.log('HAS SELECTION: ' + this.hasSelection);
      if (this.hasSelection) {
        return { animation: 'blinkingEffect 2s infinite' }
      }
    }
  }
};