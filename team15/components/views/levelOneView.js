export const LevelOneView = {
    name: "level-one-view",
    props: ["switchTo"],
    data() {
      return {
        showCorrectFeedback: false,
        showIncorrectFeedback: false,
        playerPoints: 50  // Hard-coded points for demo
      };
    },
    methods: {
      testFeedback() {
        // Hide any existing incorrect feedback first (mutual exclusion)
        this.showIncorrectFeedback = false;
        
        // Toggle the feedback visibility for demonstration
        this.showCorrectFeedback = !this.showCorrectFeedback;
        
        // If showing feedback, hide it automatically after 10 seconds
        if (this.showCorrectFeedback) {
          setTimeout(() => {
            this.showCorrectFeedback = false;
          }, 10000);
        }
      },
      testIncorrectFeedback() {
        // Hide any existing correct feedback first (mutual exclusion)
        this.showCorrectFeedback = false;
        
        // Toggle the incorrect feedback visibility for demonstration
        this.showIncorrectFeedback = !this.showIncorrectFeedback;
        
        // If showing feedback, hide it automatically after 10 seconds
        if (this.showIncorrectFeedback) {
          setTimeout(() => {
            this.showIncorrectFeedback = false;
          }, 10000);
        }
      }
    },
    template: `
        <div>
          <h1 class="main-text">THIS IS THE LEVEL 1 VIEW</h1>    
          
          <!-- Test Button for Feedback Demo -->
          <div class="test-section">
            <button @click="testFeedback" class="small-buttons">
              {{ showCorrectFeedback ? 'Hide Feedback' : 'Test Correct Answer Feedback' }}
            </button>
            <button @click="testIncorrectFeedback" class="small-buttons">
              {{ showIncorrectFeedback ? 'Hide Feedback' : 'Test Incorrect Answer Feedback' }}
            </button>
            <p>Current Points: {{ playerPoints }}</p>
          </div>
          
          <!-- Feedback Components -->
          <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
          <incorrect-answer-feedback v-if="showIncorrectFeedback"></incorrect-answer-feedback>
          
          <div class="button-container"> 
            <go-back-button @click="switchTo('ChooseLevelView')"></go-back-button>
          </div>
        </div>
      `,
  };