export default {
    name: "Navigation",
    props: {
      selectedOption: {
        type: Number,
        default: null
      }
    },
    template: `
      <nav class="navigation">
          <button class="level-select-btn" title="Return to level selection menu">Level select menu</button>
          <button class="reset-btn" title="Reset the current game session">Reset session</button>
          <button class="level-btn" title="Previous question" @click='$emit("prev")'>&#8678;</button>
          <button class="level-btn" title="Next question" @click='$emit("next")' :style="highlightNextQuestionBtn">&#8680;</button>
        </div>      
 
      </nav>
    `,
    computed: {
    /**
     * Create a "blinking effect" by changing the background-color of
     * the Next button when user has made an answer
     * @returns {CSS} CSS animation propert
     */
    highlightNextQuestionBtn() {
      if (this.selectedOption !== null) {
        return { animation: 'blinkingEffect 2s infinite' }
      }
    }
  }
  };