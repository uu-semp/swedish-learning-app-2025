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
    //Duplicate prevention
    for(let i = 0; i<this.words.length; i++) {
      if (this.words[i].english.localeCompare(newWord.english) == 0) {
        alert(`The word "${newWord.english}" already exists!`);
        console.log('Word already exists: ', newWord.english)
        return {success: false, error: 'Word already exists'}
      }
    }

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

  clearWord(id) {
    let found = false;
    let remove = null;
    const newWords =[];
    for(let i = 0; i < this.words.length; i++) {
      if(this.words[i].id === id) {
        found = true;
        remove = this.words[i];
      } else {
        newWords.push(this.words[i]);
      }
    }

    if (found) {
      this.words = newWords;
      this.saveWords();
      console.log("Removed word with id:", id);
      return{ success: true, word: remove};
    } else {
      console.log("Couldn't find word with ID;", id);
      return {success: false, error :"Word not found"};
    }
  }
}

let vocabManager;

$(function() {window.vocabulary.when_ready(function () {

  vocabManager = new VocabularyManager();
  console.log("VocabularyManager created successfully");

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("form").on("submit", handleAddWord);
  $(".submit-btn").on("click", handleAddWord);
  
  $("#clear-all").on("click", handleClearAll);
  
  populateCategoryDropdown();
  
  displayWords();
  
  console.log("Current words count:", vocabManager.getAllWords().length);

})})

function handleAddWord(event) {
  event.preventDefault();
  
  const wordData = {
    swedish: $("#swedish").val().trim(),
    english: $("#english").val().trim(),
    article: $("input[name='article']:checked").val() || '',
    literal: $("#literal").val(),
    category: $("#category").val(),
    image: '' //TODO
  };

  //validate fields
  if (!validateForm(wordData)) {
    return;
  }

  const result = vocabManager.addWord(wordData);
  
  if (result.success) {
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

  let html = '';
  words.forEach(word => {
    html += `<li>
      <strong>${word.swedish}</strong> = ${word.english}
      ${word.article ? `(${word.article})` : ''}
      ${word.literal ? `<br><em>Literal: ${word.literal}</em>` : ''}
      ${word.category ? `<br>Category: ${word.category}` : ''}
      <br><small>ID: ${word.id}</small>
      <button class="delete-word btn-delete" data-id="${word.id}">Delete Word</button>
    </li>`;
  });
  html += '</ul>';
  
  display.html(html);
  $(".delete-word").on("click", handleClearWord);
  console.log(`Displayed ${words.length} words`);
}

function handleClearAll() {
  if (vocabManager.getAllWords().length === 0) {
    console.log('No words to clear');
    return;
  } 

  if (confirm('Are you sure you want to clear all custom words? This cannot be undone.')) {
    const result = vocabManager.clearAllWords();
    if (result.success) {
      displayWords();
      console.log(`Cleared ${result.count} words`);
    } else {
      console.error('Failed to clear words:', result.error);
    }
  }
}

function validateForm(wordData) {
  let isValid = true;
  
  $('.form-group input').removeClass('error');
  $('.form-group select').removeClass('error');
  $('.article-options').removeClass('error');
  $('.error-message').text('');
  
  if (!wordData.english) {
    showValidationError('english', 'English translation is required');
    isValid = false;
  }
  
  if (!wordData.swedish) {
    showValidationError('swedish', 'Swedish word is required');
    isValid = false;
  }
  
  if (!wordData.article) {
    showArticleValidationError('article', 'Please select an article (en or ett)');
    isValid = false;
  }
  
  if (!wordData.category) {
    showValidationError('category', 'Please select a category');
    isValid = false;
  }
  
  return isValid;
}

function showValidationError(fieldId, message) {
  const field = $(`#${fieldId}`);
  const errorElement = $(`#${fieldId}-error`);
  
  field.addClass('error');
  errorElement.text(message);
}

function showArticleValidationError(fieldId, message) {
  const errorElement = $(`#${fieldId}-error`);
  $('.article-options').addClass('error');
  errorElement.text(message);
}

function populateCategoryDropdown() {

  const categorySelect = $("#category");
  
  const categories = Object.keys(window._vocabulary.categories || {});
  
  categorySelect.find('option:not(:first)').remove();
  
  if (categories.length === 0) {
    console.warn('No categories found in vocabulary data');

    //fallback
    const option = $('<option></option>')
      .attr('value', 'general')
      .text('General');
    categorySelect.append(option);
    return;
  }
  
  //add to dropdown
  categories.sort().forEach(category => {
    const option = $('<option></option>')
      .attr('value', category)
      .text(category.charAt(0).toUpperCase() + category.slice(1));
    
    categorySelect.append(option);
  });
  
  console.log(`Loaded ${categories.length} categories from Google datasheet:`, categories);
}

function handleClearWord(event) {
  const id = $(event.target).data("id");
  
  if (confirm("Are you sure you want to delete this word?")) {
    const result = vocabManager.clearWord(id);
    if (result.success) {
      displayWords();
      console.log("Deleted word:", result.word);
    } else {
      console.error("Failed to delete word:", result.error);
    }
  }
}

