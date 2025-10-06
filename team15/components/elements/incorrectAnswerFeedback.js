/**
 * A simple feedback component that displays an "Incorrect!" message.
 */
export const IncorrectAnswerFeedback = {
  name: "incorrect-answer-feedback",
  template: `
    <div class="feedback-container incorrect-feedback">
      <h2 class="feedback-text">{{$language.translate('wrong-answer')}}</h2>
    </div>
  `,
};
