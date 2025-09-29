// ==============================================
// Owned by Team 03
// ==============================================

"use strict";

class VocabularyManager {
  constructor() {
    this.STORAGE_KEY = "team03";
    this.words = this.loadWords();
    console.log("VocabularyManager initialized with storage key:", this.STORAGE_KEY);
  }

  loadWords() {
    const data = window.save.get(this.STORAGE_KEY);
    return data.customWords || [];
  }

  saveWords() {
    const data = window.save.get(this.STORAGE_KEY);
    data.customWords = this.words;
    window.save.set(this.STORAGE_KEY, data);
  }

  generateId() {
    let result = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  addWord(wordData) {
    const newWord = {
      id: this.generateId(),
      swedish: wordData.swedish,
      english: wordData.english,
      article: wordData.article,
      literal: wordData.literal,
      category: wordData.category,
      image: wordData.image
    };

    this.words.push(newWord);
    this.saveWords();
    
    console.log('Word added:', newWord);
    return { success: true, word: newWord };
  }

  getAllWords() {
    return [...this.words];
  }

}

let vocabManager;

$(function() {window.vocabulary.when_ready(function () {

  vocabManager = new VocabularyManager();
  console.log("VocabularyManager created successfully");

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("form").on("submit", handleAddWord);
  $(".submit-btn").on("click", handleAddWord);
  
  displayWords();
  
  console.log("Current words count:", vocabManager.getAllWords().length);

})})

function handleAddWord(event) {
  event.preventDefault();
  
  const wordData = {
    swedish: $("#swedish").val(),
    english: $("#english").val(),
    article: $("input[name='article']:checked").val() || '',
    literal: $("#literal").val(),
    category: $("#category").val(),
    image: '' //TODO
  };

  const result = vocabManager.addWord(wordData);
  
  if (result.success) {
    // clear after submission
    $("#swedish").val('');
    $("#english").val('');
    $("#literal").val('');
    $("#category").val('');
    $("input[name='article']").prop('checked', false);
    
    // update display
    displayWords();
    console.log('Word added successfully');
  }
}

function displayWords() {
  const words = vocabManager.getAllWords();
  const display = $("#words-display");
  
  if (words.length === 0) {
    display.text("No custom words yet.")
    return;
  }

  let html = '<h3>Your Custom Words:</h3><ul>';
  words.forEach(word => {
    html += `<li>
      <strong>${word.swedish}</strong> = ${word.english}
      ${word.article ? `(${word.article})` : ''}
      ${word.literal ? `<br><em>Literal: ${word.literal}</em>` : ''}
      ${word.category ? `<br>Category: ${word.category}` : ''}
      <br><small>ID: ${word.id}</small>
    </li>`;
  });
  html += '</ul>';
  
  display.html(html);
  console.log(`Displayed ${words.length} words`);
}


