export default {
  name: "Cards",
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedOption: {
      type: Number,
      default: null
    },
    correctIndex: {
      type: Number,
      default: null
    }
  },
  emits: ["select"], // an event to notify parent of selected option
  template: `
    <div class="cards-group">
      <button 
        v-for="(opt, index) in options" 
        :key="index"
        class="card"
        @click="$emit('select', index)"
        :style="buttonStyle(index)">
        {{ opt }}
      </button>
    </div>
  `,
  methods: {
    buttonStyle(index) {
      if (this.selectedOption === null) return {}; // no selection yet

      if (index === this.selectedOption && index === this.correctIndex) {
        return { backgroundColor: "#4caf50", color: "white" }; // correct
      } else if (index === this.selectedOption && index !== this.correctIndex) {
        return { backgroundColor: "#f44336", color: "white" }; // false
      } else if (this.selectedOption !== this.correctIndex && index === this.correctIndex) {
      return { backgroundColor: "#4caf50", color: "white" }; // show correct answer
      } else {
        return {};
      }
    }
  }
};
