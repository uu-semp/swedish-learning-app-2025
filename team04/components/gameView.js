import shuffleQuestions from "../utils/shuffleQuestions.js";
import progressBar from "./progressBar.js";

export default {
  name: "GameView",
  template: `
    <div class="game-container">
      <statistics></statistics>
      <section class="center-section">
        <clock
          v-if="currentQuestion"
          :hour="currentQuestion.hour"
          :minute="currentQuestion.minute"> 
        </clock>
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
        :has-selection="selectedOption !== null"
        @next="nextQuestion" 
        @prev="prevQuestion"
        @reset="resetQuestion">
      </navigation>
  </div>
  `,
  props: ["selectedLevel"],
  data() {
    return {
      level_1: "623a056b",
      level_2: "2c6d3f66",
      level_3: "47662d57",
      questions: [],
      userAnswers: [], // [{id, user, correct}]
      currentIndex: 0,
      selectedOption: null,
      startTime: null,
      endTime: null,
      answerStats: { correct: 0, incorrect: 0, skipped: 0 },
      answers: [], // [{index, result: 'correct'|'incorrect'|'skipped'}]
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
    console.log("rawData type:", typeof rawData);
    console.log("rawData preview:", rawData);

    // shuffle questions and set current index to 0
    const parsed = JSON.parse(rawData);
    this.questions = shuffleQuestions(parsed);
    this.currentIndex = 0;
    this.startTime = Date.now();
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
      this.selectedOption = index;
      const isCorrect = index === this.currentQuestion.correctIndex;
       // create tuple-like object: { id: questionIndex, user: selectedIndex, correct: correctIndex }
      const id = this.currentIndex;
      
      // update existing answer for this question or push new
      const existing = this.userAnswers.find(a => a.id === id);
      if (existing) {
        this.selectedOption = existing.user;
        return;
      }
      this.selectedOption = index;
      // create tuple-like object: { id: questionIndex, user: selectedIndex, correct: correctIndex }
      const correct = this.currentQuestion ? this.currentQuestion.correctIndex : null;
      const entry = { id, user: index, correct, answered: true }
      // push new answer entry
      this.userAnswers.push(entry);
      
      this.answers[this.currentIndex] = {
        index: this.currentIndex,
        result: isCorrect ? 'correct' : 'incorrect'
      };
  },
    nextQuestion() {
      if (this.selectedOption === null) {
        this.answers[this.currentIndex] = {
          index: this.currentIndex,
          result: 'skipped'
        };
      }
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        const stored = this.userAnswers.find(a => a.id === this.currentIndex);
        this.selectedOption = stored ? stored.user : null;
      } else {
        this.$root.currentView = 'finish';
      }
      if (this.currentIndex >= this.questions.length - 1) {
        this.endTime = Date.now();
        this.$root.finishStats = this.calculateStats();
        this.$root.currentView = 'finish';
      }
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const stored = this.userAnswers.find(a => a.id === this.currentIndex);
        this.selectedOption = stored ? stored.user : null;
      }
    },
    resetQuestion() {
      if (window.confirm("Are you sure you want to reset the quiz? Your progress will be lost.")) {
      if(this.currentIndex > 0) {
        this.currentIndex = 0;
      } 
      this.selectedOption = null;
      this.userAnswers = [];
      this.answers = [];
      }
      
    }, calculateStats() {
      let correct = 0, incorrect = 0, skipped = 0;
      this.answers.forEach(ans => {
        if (!ans) skipped++;
        else if (ans.result === 'correct') correct++;
        else if (ans.result === 'incorrect') incorrect++;
        else skipped++;
      });
      const total = this.questions.length;
      const percent = total ? Math.round((correct / total) * 100) : 0;
      const durationMs = (this.endTime || Date.now()) - this.startTime;
      return {
        correct,
        incorrect,
        skipped,
        percent,
        durationMs
      };
    }
  }
};
