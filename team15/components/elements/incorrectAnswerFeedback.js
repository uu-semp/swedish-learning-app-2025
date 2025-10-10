/**
 * A simple feedback component that displays an "Incorrect!" message.
 */
export const IncorrectAnswerFeedback = {
  name: "incorrect-answer-feedback",
  props: {
    message: { type: String, required: false, default: '' },
  },
  template: `
    <div class="feedback-container incorrect-feedback">
      <h2 class="feedback-text">{{ message || $language.translate('wrong-answer') }}</h2>
    </div>
  `,
};
