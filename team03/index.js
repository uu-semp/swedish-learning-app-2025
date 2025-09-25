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
    };

    this.words.push(newWord);
    this.saveWords();
    
    console.log('Word added:', newWord);
    return { success: true, word: newWord };
  }

  getAllWords() {
    return [...this.words];
  }

  clearAllWords() {
    const count = this.words.length;
    const result = window.save.clear(this.STORAGE_KEY);
    if (result) {
      this.words = [];
      console.log(`Cleared ${count} words`);
      return { success: true, count: count };
    } else {
      console.log('Failed to clear words');
      return { success: false, error: 'Failed to clear storage' };
    }
  }
}

let vocabManager;

$(function() {window.vocabulary.when_ready(function () {

  vocabManager = new VocabularyManager();
  console.log("VocabularyManager created successfully");

  // this connects to the add word button in the frontend
  //$("#add-word").on("click", handleAddWord);
  
  // this connects to the clear all button
  //$("#clear-all").on("click", handleClearAll);
  
  //displayWords();

})})

function handleAddWord() {
  const wordData = {
    swedish: $("#swedish").val(),
    english: $("#english").val()
  };

  const result = vocabManager.addWord(wordData);
  
  if (result.success) {
    $("#swedish").val('');
    $("#english").val('');
    //displayWords();
    console.log('Word added and displayed');
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
      ${word.swedish} = ${word.english}
      (ID: ${word.id})
    </li>`;
  });
  html += '</ul>';
  
  display.html(html);
  console.log(`Displayed ${words.length} words`);
}

function handleClearAll() {
  if (vocabManager.getAllWords().length === 0) {
    return;
  } else {
    const result = vocabManager.clearAllWords();
    if (result.success) {
      //displayWords();
      console.log(`Cleared ${result.count} words and updated display`);
    }
  }
}