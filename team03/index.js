// ==============================================
// Owned by Team 03
// ==============================================

"use strict";

class VocabularyManager {
  constructor() {
    this.STORAGE_KEY = "team03";
    this.words = this.loadWords();
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
      english: wordData.english,
      article: wordData.article,
      swedish: wordData.swedish,
      swedish_plural: wordData.swedish_plural,
      literal: wordData.literal,
      category: wordData.category,
      image_url: wordData.image_url,
      image_copyright_info: wordData.image_copyright_info,
      audio_url: wordData.audio_url
    };
    
    // Duplicate prevention
    for(let i = 0; i < this.words.length; i++) {
      if (this.words[i].english.localeCompare(newWord.english) == 0) {
        alert(`The word "${newWord.english}" already exists!`);
        console.log('Word already exists:', newWord.english);
        return {success: false, error: 'Word already exists'};
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
    if (window.save.clear(this.STORAGE_KEY)) {
      this.words = [];
      return {success: true, count: count};
    }
    return {success: false, error: 'Failed to clear storage'};
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
      return {success: true, word: remove};
    }
    return {success: false, error: "Word not found"};
  }
}

let vocabManager;
let selectedCategories = [];

$(function() {
  $(".info-btn").on("click", function(e) {
    e.preventDefault();
    $("#info-dialog").addClass("active");
  });
  
  $(".close-dialog").on("click", function(e) {
    e.preventDefault();
    $("#info-dialog").removeClass("active");
  });
  
  $("#info-dialog").on("click", function(e) {
    if (e.target === this) {
      console.log("Closing dialog via overlay");
      $(this).removeClass("active");
    }
  });

  window.vocabulary.when_ready(function() {
    vocabManager = new VocabularyManager();
    
    $("form").on("submit", handleAddWord);
    $("#clear-all").on("click", handleClearAll);
    $("#category-dropdown").on("change", handleCategorySelect);
    
    //allow deselecting article
    let lastSelectedArticle = null;
    $("input[name='article']").on("click", function() {
      if (lastSelectedArticle === this) {
        this.checked = false;
        lastSelectedArticle = null;
      } else {
        lastSelectedArticle = this;
      }
    });
    
    populateCategoryDropdown();
    displayWords();
  });
});

function handleCategorySelect(event) {
  const value = $(event.target).val();
  if (value && !selectedCategories.includes(value)) {
    selectedCategories.push(value);
    renderCategoryChips();
  }
  $(event.target).val('');
}

function renderCategoryChips() {
  const container = $("#selected-categories");
  container.empty();
  
  selectedCategories.forEach(category => {
    const chip = $(`
      <div class="category-chip">
        <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
        <button type="button" class="remove-category" data-category="${category}">×</button>
      </div>
    `);
    container.append(chip);
  });
  
  $(".remove-category").on("click", function() {
    const categoryToRemove = $(this).data("category");
    selectedCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    renderCategoryChips();
  });
}

function handleAddWord(event) {
  event.preventDefault();
  
  const wordData = {
    english: $("#english").val().trim(),
    swedish: $("#swedish").val().trim(),
    article: $("input[name='article']:checked").val() || '',
    swedish_plural: $("#swedish-plural").val().trim(),
    literal: $("#literal").val().trim(),
    category: selectedCategories.join(", "),
    image_url: $("#image-url").val().trim(),
    image_copyright_info: $("#image-copyright").val().trim(),
    audio_url: $("#audio-url").val().trim()
  };

  if (!validateForm(wordData)) return;

  if (vocabManager.addWord(wordData).success) {
    clearForm();
    displayWords();
  }
}

function clearForm() {
  $("form")[0].reset();
  selectedCategories = [];
  renderCategoryChips();
}

function validateForm(wordData) {
  $('.error-message').text('');
  $('.form-group input, .form-group select').removeClass('error');
  
  const required = [
    {field: 'english', value: wordData.english, message: 'English translation is required'},
    {field: 'swedish', value: wordData.swedish, message: 'Swedish word is required'},
    {field: 'category', value: wordData.category, message: 'At least one category is required'}
  ];
  
  let isValid = true;
  required.forEach(item => {
    if (!item.value) {
      $(`#${item.field}`).addClass('error');
      $(`#${item.field}-error`).text(item.message);
      isValid = false;
    }
  });
  
  return isValid;
}

function displayWords() {
  const words = vocabManager.getAllWords();
  const display = $("#words-display");
  
  if (words.length === 0) {
    display.text("No custom words yet.");
    return;
  }

  const wordItems = words.map(word => `
    <li>
      <strong>${word.swedish}</strong> = ${word.english}
      ${word.article ? `(${word.article})` : ''}
      ${word.swedish_plural ? `<br>Plural: ${word.swedish_plural}` : ''}
      ${word.literal ? `<br><em>Literal: ${word.literal}</em>` : ''}
      ${word.category ? `<br>Category: ${word.category}` : ''}
      ${word.image_url ? `<br>Image: <a href="${word.image_url}" target="_blank">View</a>` : ''}
      ${word.image_copyright_info ? `<br><small>Copyright: ${word.image_copyright_info}</small>` : ''}
      ${word.audio_url ? `<br>Audio: <a href="${word.audio_url}" target="_blank">Listen</a>` : ''}
      <br><small>ID: ${word.id}</small>
      <button class="delete-word btn-delete" data-id="${word.id}">Delete Word</button>
    </li>
  `).join('');
  
  display.html(`<ul>${wordItems}</ul>`);
  $(".delete-word").on("click", handleClearWord);
}

function handleClearAll() {
  if (vocabManager.getAllWords().length === 0) return;

  if (confirm('Are you sure you want to clear all custom words? This cannot be undone.')) {
    if (vocabManager.clearAllWords().success) {
      displayWords();
    }
  }
}

function populateCategoryDropdown() {
  const dropdown = $("#category-dropdown");
  const categories = Object.keys(window._vocabulary.categories || {});
  
  dropdown.find('option:not(:first)').remove();
  
  if (categories.length === 0) {
    dropdown.append($('<option value="general">General</option>'));
    return;
  }
  
  categories.sort().forEach(category => {
    const option = $('<option></option>')
      .attr('value', category)
      .text(category.charAt(0).toUpperCase() + category.slice(1));
    dropdown.append(option);
  });
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
