/**
 * Enhanced feedback component that displays contextual messages based on attempt number
 * and provides additional feedback for maximum attempts reached.
 */
export const IncorrectAnswerFeedback = {
  name: "incorrect-answer-feedback",
  props: {
    attemptNumber: {
      type: Number,
      default: 1
    },
    maxAttempts: {
      type: Number,
      default: 3
    }
  },
  computed: {
    feedbackMessage() {
      console.log(`IncorrectAnswerFeedback - attemptNumber: ${this.attemptNumber}, maxAttempts: ${this.maxAttempts}`);
      
      if (this.attemptNumber >= this.maxAttempts) {
        console.log('Showing max-attempts-reached message');
        return this.$language.translate('max-attempts-reached');
      } else if (this.attemptNumber === 2) {
        console.log('Showing second-attempt message');
        return this.$language.translate('second-attempt');  
      } else if (this.attemptNumber === 1) {
        console.log('Showing wrong-answer message (first attempt)');
        return this.$language.translate('wrong-answer');
      } else {
        console.log('Showing default wrong-answer message');
        return this.$language.translate('wrong-answer');
      }
    },
    shouldShowMovingMessage() {
      return this.attemptNumber >= this.maxAttempts;
    }
  },
  template: `
    <div class="feedback-container incorrect-feedback">
      <h2 class="feedback-text">{{ feedbackMessage }}</h2>
      <p v-if="shouldShowMovingMessage" class="moving-next-text">
        {{ $language.translate('moving-to-next-question') }}
      </p>
    </div>
  `,
};
