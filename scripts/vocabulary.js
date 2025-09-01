// ==============================================
// Owned by the Data Team
// ==============================================

// This creates the `data` object to import the vocabulary

"use strict";

// This request is async
// The .. is relative from a team folder. This is needed to support localhost
// and GH pages
fetch("../assets/vocabulary.json")
    .then(res => res.json())
    .then(data => {
        console.log("Successfully loaded the vocabulary")
        window._vocabulary = data;

        runCallbacks();
    })
    .catch(err => console.error("Failed to load JSON:", err));

// Provide functions to be used by other scripts
window.vocabulary = {
    callbacks: [],

    get_random() {
        let idx = Math.floor(Math.random() * window._vocabulary.vocab.length);
        return window._vocabulary.vocab[idx];
    },

    when_ready(callback) {
        if (window.vocabulary !== undefined) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    }
};

function runCallbacks() {
    if (window.vocabulary === undefined) {
        return;
    }

    // Snapshot the current callbacks
    const cbs = window.vocabulary.callbacks;
    
    // Clear the list again
    window.vocabulary.callbacks = []
    
    // Call all callbacks
    for (const cb of cbs) {
        if (typeof cb === "function") cb();
    }
}
