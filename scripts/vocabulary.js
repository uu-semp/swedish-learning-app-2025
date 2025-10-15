// This file is a hack, while teams are migrating to the async API

const async_methods = import("./vocabulary_await.js").then();
let resolved_methods = null;

"use strict";

window._vocabulary = {
    pending: 1,
    team: null,
};

(async () => {
    resolved_methods = await async_methods;
    await resolved_methods.loaddb();

    window._vocabulary.pending -= 1;
    checkCallbacks();
})();

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
    // - `img`      The URL of the image for this word (Optional)
    // - `audio`    The URL of the audio for this word (Optional)
    get_vocab(id) {
        return resolved_methods.get_vocab(id);
    },

    // Returns a list of vocabulary IDs belonging to the given category.
    get_category(category) {
        return resolved_methods.get_category(category);
    },

    // Returns a random vocabulary item. See `get_vocab()`
    get_random() {
        return resolved_methods.get_random();
    },

    when_ready(callback) {
        if (window._vocabulary !== undefined && window._vocabulary.pending == 0) {
            resolved_methods.deprecated_load_team_data(window._vocabulary.team);
            callback();
        } else {
            this.callbacks.push(callback);
        }
    },

    load_team_data(team_id) {
        if (window._vocabulary !== undefined) {
            window._vocabulary.team = team_id;
        }
    },

    // This returns the team metadata belonging to the given ID.
    get_team_data(id) {
        return resolved_methods.get_vocab(id).team ?? null;
    },

    // Returns all keys available in the loaded team data. Note that
    // `load_team_data()` has to be called first and should be done before
    // `when_ready()`
    get_team_data_keys() {
        return resolved_methods.vocab_with_team_data();
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

    resolved_methods.deprecated_load_team_data(window._vocabulary.team);

    // Call all callbacks
    for (const cb of cbs) {
        if (typeof cb === "function") cb();
    }
}