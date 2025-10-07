/**
 * Reusable component that manages the three-tries system logic
 * Can be used across all levels to handle attempt counting and feedback
 */
export const TriesManager = {
  name: "tries-manager",
  props: {
    maxTries: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      currentTry: 1,
      showCorrectFeedback: false,
      showIncorrectFeedback: false,
      feedbackAttemptNumber: 1, // Store the attempt number to show in feedback
      questionTries: 0, // Number of tries on current question
      totalAttempts: 0,
      totalCorrectAnswers: 0,
      sessionData: {
        startTime: null,
        questionsCompleted: 0,
        totalSessionTries: 0
      },
      questionHistory: []
    };
  },

  mounted() {
    this.initializeSession();
  },

  methods: {
    initializeSession() {
      this.sessionData.startTime = new Date();
    },

    handleAttempt(isCorrect) {
      this.totalAttempts++;
      this.questionTries++;
      this.sessionData.totalSessionTries++;
      
      if (isCorrect) {
        this.showCorrectFeedback = true;
        this.totalCorrectAnswers++;
        this.sessionData.questionsCompleted++;
        
        // Save question result
        this.saveQuestionResult(true, this.questionTries);
        
        // Emit success event to parent
        this.$emit('question-completed', { 
          success: true, 
          tries: this.questionTries 
        });
        
        setTimeout(() => {
          this.showCorrectFeedback = false;
          this.resetForNextQuestion();
        }, 3000);
        
      } else {
        this.feedbackAttemptNumber = this.currentTry; // Store current attempt for feedback
        this.showIncorrectFeedback = true;
        
        setTimeout(() => {
          this.showIncorrectFeedback = false;
        }, 3000);
        
        // Check if max tries reached
        if (this.currentTry >= this.maxTries) {
          // Save question result as failed after max tries
          this.saveQuestionResult(false, this.questionTries);
          
          // Emit failure event to parent
          this.$emit('question-completed', { 
            success: false, 
            tries: this.questionTries 
          });
          
          // After 3 tries, move to next question
          setTimeout(() => {
            this.resetForNextQuestion();
          }, 3500);
        } else {
          this.currentTry++; // Increment for next attempt
        }
      }
    },

    resetForNextQuestion() {
      this.questionTries = 0;
      this.currentTry = 1;
      this.feedbackAttemptNumber = 1;
      this.$emit('ready-for-next-question');
    },

    saveQuestionResult(isCorrect, tries) {
      const questionResult = {
        wasCorrect: isCorrect,
        triesUsed: tries,
        timestamp: new Date()
      };
      this.questionHistory.push(questionResult);
    }
  },

  template: `
    <div class="tries-manager">
      <div class="feedback-area">
        <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
        <incorrect-answer-feedback 
          v-if="showIncorrectFeedback"
          :attempt-number="feedbackAttemptNumber"
          :max-attempts="maxTries">
        </incorrect-answer-feedback>
      </div>
      
      <!-- Slot for game content -->
      <slot></slot>
    </div>
  `,
};