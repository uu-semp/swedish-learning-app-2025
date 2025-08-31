// This creates the `data` object to import the vocabulary

"use strict";

fetch("/assets/vocabulary.json")
    .then(res => res.json())
    .then(data => {
        window._vocabulary = data;
        console.log("Successfully loaded the vocabulary")
    })
    .catch(err => console.error("Failed to load JSON:", err));

// Provide functions to be used by other scripts
window.vocabulary = {
    get_random() {
        let idx = Math.floor(Math.random() * window._vocabulary.vocab.length);
        return window._vocabulary.vocab[idx];
    }
};
