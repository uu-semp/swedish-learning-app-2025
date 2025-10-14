import setClock from "../utils/setClock.js";
import shuffleQuestions from "../utils/shuffleQuestions.js";
import progressBar from "./progressBar.js";

export default {
  name: "GameView",
  template: `
    <div class="game-container">
      <statistics 
       :currentIndex="currentIndex"></statistics>
      <section class="center-section">
        <clock></clock>
        <cards 
          v-if="currentQuestion"
          :options="currentQuestion.options"
          :correct-index="currentQuestion.correctIndex"
          :selected-option="selectedOption"
          @select="selectOption">
        </cards>
      </section>
      <progress-bar :steps="questions.length" :active="currentIndex+1"></progress-bar>
      <navigation 
       @next="nextQuestion" 
       @prev="prevQuestion">
      </navigation>

      <button @click="$root.currentView = 'finish'">Switch to FinishView</button>
  </div>
  `,
  props: ["selectedLevel"],
  data() {
    return {
      level_1: "623a056b",
      level_2: "2c6d3f66",
      level_3: "477662d57",
      questions: [],
      answers: [],
      currentIndex: 0,
      selectedOption: null
    };
  },
  components: {
    'progress-bar': progressBar
  },
  created() {
    // get raw data for the selected level
    const levelKey = `level_${this.selectedLevel}`;
    const vocabId = this[levelKey];
    const rawData = window.vocabulary.get_team_data(vocabId);
    // shuffle questions and set current index to 0
    const parsed = JSON.parse(rawData);
    this.questions = shuffleQuestions(parsed);
    this.currentIndex = 0;

    console.log(`Loaded Level ${this.selectedLevel} data:`, this.questions);
  },
  mounted() {
    const firstQ = this.questions[0];
    setClock(firstQ.hour, firstQ.minute); 
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || null;
  },
    isCorrect() {
      if (this.selectedOption === null) return false;
      return this.selectedOption === this.currentQuestion.correctIndex;
    },
    stepArray() {
    return Array.from({ length: this.steps }, (_, i) => i + 1);
  },
  },
    
  methods: {
    selectOption(index) {
      const id = this.currentIndex;
      // If this question was already answered, ignore further selections.
      // To allow changes, change this to `if (existing && !allowChange) { ... }`
      const existing = this.answers.find(a => a.id === id);
      if (existing) {
        this.selectedOption = existing.user;
        return;
      }
      this.selectedOption = index;
      // create tuple-like object: { id: questionIndex, user: selectedIndex, correct: correctIndex }
      const correct = this.currentQuestion ? this.currentQuestion.correctIndex : null;
      const entry = { id, user: index, correct, answered: true }
      // push new answer entry
      this.answers.push(entry);
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        const stored = this.answers.find(a => a.id === this.currentIndex);
        this.selectedOption = stored ? stored.user : null;


        const q = this.questions[this.currentIndex];
        setClock(q.hour, q.minute);
      } else {
        this.$root.currentView = 'finish';
      }
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const stored = this.answers.find(a => a.id === this.currentIndex);
        this.selectedOption = stored ? stored.user : null;

        const q = this.questions[this.currentIndex];
        setClock(q.hour, q.minute);
      }
    }
  }
};
