/**
 * A simple feedback component that displays a "Correct!" message.
 */
export const CorrectAnswerFeedback = {
  name: "correct-answer-feedback",
  template: `
    <div class="feedback-container correct-feedback">
      <h2 class="feedback-text">{{$language.translate('correct-answer')}}</h2>
    </div>
  `,
};
