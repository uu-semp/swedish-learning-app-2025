// ==============================================
// Owned by Team 13
// ==============================================


"use strict";

//Pull a random street name from the vocab


// Attach functions to a global object
window.translate = {
  translateWord(context, wordIndex) {
    if (context.prompt[wordIndex] === '-int' || context.prompt[wordIndex] === '-street') return;

    let newWord = context.translatedIndexes[wordIndex]
      ? context.swedishSentence[wordIndex]
      : context.englishSentence[wordIndex];

    context.translatedIndexes[wordIndex] = !context.translatedIndexes[wordIndex];
    const newPrompt = [...context.prompt];
    newPrompt[wordIndex] = newWord;
    context.prompt = newPrompt;
  },
  renderWord(context, word){
    switch (word) {
      case 
        "-street": return context.currentStreet;

      case 
        "-int": return context.currentQuestion ? context.currentQuestion.sv : '';

      default: 
        return word;
    }
  },
  toggleTranslation(context) {
    context.showTranslation = !context.showTranslation;
  }
};
