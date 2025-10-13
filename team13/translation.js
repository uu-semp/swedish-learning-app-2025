// ==============================================
// Owned by Team 13
// ==============================================


"use strict";

function wordIsTranslated(wordIndex){
  return translatedIndexes.includes(wordIndex)
}

//when requested, translates the word and adds its index to the translatedWords array
function translateWord(wordIndex, englishText, prompt, translatedWords){
  if (!wordIsTranslated(wordIndex)){
    translatedWords[translatedWords.length] = wordIndex
    let newWord = ""
    let englishWord = englishText[wordIndex];

    newWord = englishWord;
    
    prompt[wordIndex] = newWord
  
    renderPrompt()
  }
}

//Pull a random street name from the vocab
function getStreet(){
  const streets = window.vocabulary.get_category("street");

  const randomNo = irandom_range(0, streets.length - 1);
  return window.vocabulary.get_vocab(streets[randomNo]).sv;
}

//Updates the question prompt based on what words have been translated
function updatePrompt(wordIndex) {
  translateWord(wordIndex, currentEnglishText,currentPrompt, translatedIndexes)
  for (let i = 0; i < houseArray.length; i++) {
    const button = document.getElementById(`word-btn-${i}`);
    if (button) {
      button.textContent = `${currentPrompt[i]}`;
    }
  }
}

function renderPrompt(){
  const container = $("#prompt-words")
  container.empty();
  console.log("Length of currentPrompt:")
  console.log(currentPrompt.length)
  currentPrompt.forEach((promptValue,promptIndex) => {
    const btn = $(`<button>${renderWord(promptValue,promptIndex)}</button>`);
    btn.on("click", () => updatePrompt(promptIndex));
    container.append(btn);
  });
}

function renderWord(word, index){
  switch (word){
    case "-street": 
      return currentStreet
    case "-int": return correctHouseNumber_swe;
    default: return word;
  }
}

