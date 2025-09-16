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

function fetch_json_file(file, field) {
    window._vocabulary.pending += 1;

    // This request is async
    fetch(file)
        .then(res => res.json())
        .then(data => {
            console.log(`Data: Successfully loaded \`${file}\``)
            window._vocabulary[field] = data;

            window._vocabulary.pending -= 1;
            checkCallbacks();
        })
        .catch(err => console.error(`Data: Failed to load \`${file}\``, err));
}

// The .. is relative from a team folder. This is needed to support localhost
// and GH pages
fetch_json_file("../assets/vocabulary.json", "vocab");
fetch_json_file("../assets/categories.json", "categories");

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
    },

    load_team_data(team_id) {
        // Stringify incase this get a number
        const team_id_str = String(team_id).padStart(2, "0");
        const team_file = `../assets/team${team_id_str}/vocab_data.json`

        // Only one team should have access at a time. So it should be safe,
        // to store it in a generic `team` field
        fetch_json_file(team_file, "team");
    },

    // This returns the team metadata belonging to the given ID.
    get_team_data(id) {
        const team_data = window._vocabulary?.team ?? {};

        if (id in team_data) {
            return team_data[id];
        }

        return null;
    },

    // Returns all keys available in the loaded team data. Note that
    // `load_team_data()` has to be called first and should be done before
    // `when_ready()`

    get_team_data_keys() {
        const team_data = window._vocabulary?.team ?? {};

        return Object.keys(team_data);
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
