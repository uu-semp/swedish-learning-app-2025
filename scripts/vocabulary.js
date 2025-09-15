// ==============================================
// Owned by the Data Team
// ==============================================

// This creates the `data` object to import the vocabulary

"use strict";

window._vocabulary = {
    vocab: null,
    categories: null,
    pending: 0
}

window._vocabulary.pending += 1;
// This request is async
// The .. is relative from a team folder. This is needed to support localhost
// and GH pages
fetch("../assets/vocabulary.json")
    .then(res => res.json())
    .then(data => {
        console.log("Successfully loaded the vocabulary")
        window._vocabulary.vocab = data;

        window._vocabulary.pending -= 1;
        checkCallbacks();
    })
    .catch(err => console.error("Failed to load `vocabulary.json`", err));

window._vocabulary.pending += 1;
fetch("../assets/categories.json")
    .then(res => res.json())
    .then(data => {
        console.log("Successfully loaded the categories")
        window._vocabulary.categories = data;

        window._vocabulary.pending -= 1;
        checkCallbacks();
    })
    .catch(err => console.error("Failed to load `categories.json`", err));


// Provide functions to be used by other scripts
window.vocabulary = {
    callbacks: [],

    // This returns the vocabulary metadata belonging to the given ID.
    //
    // Words usually have the following metadata:
    // - `en`       The vocabulary in english
    // - `sv`       The vocabulary in swedish
    // - `article`  The article of the word (Optional)
    // - `literal`  The literal representation of the word (Optional)
    get_vocab(id) {
        if (id in window._vocabulary.vocab) {
            return window._vocabulary.vocab[id];
        }

        return null;
    },

    // Returns a list of vocabulary IDs belonging to the given category.
    get_category(category) {
        if (category in window._vocabulary.categories) {
            return window._vocabulary.categories[category];
        }

        return null;
    },

    // Returns a random vocabulary item. See `get_vocab()`
    get_random() {
        const ids = Object.keys(window._vocabulary.vocab);
        const rand_id = ids[Math.floor(Math.random() * ids.length)];
        return this.get_vocab(rand_id);
    },

    when_ready(callback) {
        if (window._vocabulary !== undefined) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    }
};

function checkCallbacks() {
    // Check that `window.vocabulary` is already defined
    if (window.vocabulary === undefined) {
        return;
    }

    // Check if all pending requests are done
    if (window._vocabulary.pending > 0) {
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
