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

    // Initialize empty objects for custom vocabulary extensions
    window._vocabulary.vocab = {};
    window._vocabulary.categories = {};

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
        // First check the internal database
        const internalVocab = resolved_methods.get_vocab(id);
        if (internalVocab) {
            return internalVocab;
        }
        
        // Then check custom vocabulary extensions (like Team03)
        const customVocab = window._vocabulary.vocab[id];
        if (customVocab) {
            return customVocab;
        }
        
        return null;
    },

    // Returns a list of vocabulary IDs belonging to the given category.
    get_category(category) {
        // Get items from the internal database
        const internalItems = resolved_methods.get_category(category) || [];
        
        // Get items from custom vocabulary extensions (like Team03)
        const customItems = window._vocabulary.categories[category] || [];
        
        // Combine and deduplicate
        const allItems = [...new Set([...internalItems, ...customItems])];
        
        return allItems;
    },

    // Returns a random vocabulary item. See `get_vocab()`
    get_random() {
        // First try to get from internal database
        const internalRandom = resolved_methods.get_random();
        if (internalRandom) {
            return internalRandom;
        }
        
        // If no internal items, try custom vocabulary
        const customIds = Object.keys(window._vocabulary.vocab);
        if (customIds.length > 0) {
            const randomIndex = Math.floor(Math.random() * customIds.length);
            const randomId = customIds[randomIndex];
            return window._vocabulary.vocab[randomId];
        }
        
        return null;
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
        // First check internal database
        const internalVocab = resolved_methods.get_vocab(id);
        if (internalVocab && internalVocab.team) {
            return internalVocab.team;
        }
        
        // Then check custom vocabulary (custom words typically don't have team data)
        const customVocab = window._vocabulary.vocab[id];
        if (customVocab && customVocab.team) {
            return customVocab.team;
        }
        
        return null;
    },

    // Returns all keys available in the loaded team data. Note that
    // `load_team_data()` has to be called first and should be done before
    // `when_ready()`
    get_team_data_keys() {
        // Get internal team data keys
        const internalKeys = resolved_methods.vocab_with_team_data() || [];
        
        // Get custom vocabulary keys (custom words typically don't have team data, but include them for completeness)
        const customKeys = Object.keys(window._vocabulary.vocab);
        
        // Combine and deduplicate
        return [...new Set([...internalKeys, ...customKeys])];
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

    // Load Team03 custom words into global vocabulary
    loadTeam03CustomWords();

    // Call all callbacks
    for (const cb of cbs) {
        if (typeof cb === "function") cb();
    }
}

/**
 * Loads Team03's custom words into the global vocabulary system
 * This function is called automatically when the vocabulary system is ready
 */
function loadTeam03CustomWords() {
    // Check if window.save is available
    if (!window.save) {
        console.warn("Team03 Integration: window.save not available");
        return;
    }

    try {
        // First, always populate categories from the existing vocabulary system
        const existingCategories = ['food', 'furniture', 'clothing', 'color', 'number', 'ordinal-number', 'time-text-minues', 'weather', 'day', 'month', 'pants', 'hat', 'shirt', 'character', 'street'];
        
        existingCategories.forEach(cat => {
            const items = resolved_methods.get_category(cat);
            if (items && items.length > 0) {
                window._vocabulary.categories[cat] = [...items]; // Copy the array
            }
        });

        // Get custom words from localStorage
        const team03Data = window.save.get("team03");
        const words = team03Data?.customWords || [];
        
        if (words.length === 0) {
            console.log("Team03 Integration: No custom words found, but categories populated");
            return;
        }

        let added = 0;
        words.forEach(word => {
            const id = `team03-${word.id}`;
            
            // Add to global vocab object
            const vocabEntry = {
                en: word.en,
                sv: word.sv,
                sv_pl: word.sv_pl,
                article: word.article,
                literal: word.literal,
                img: word.img,
                img_copyright: word.img_copyright,
                audio: word.audio
            };

            // Update window._vocabulary.vocab
            if (window._vocabulary && window._vocabulary.vocab) {
                window._vocabulary.vocab[id] = vocabEntry;
                added++;
            }

            // Add to categories
            if (word.category && window._vocabulary && window._vocabulary.categories) {
                const categories = word.category.split(",").map(c => c.trim().toLowerCase());
                categories.forEach(cat => {
                    if (!window._vocabulary.categories[cat]) {
                        window._vocabulary.categories[cat] = [];
                    }
                    if (!window._vocabulary.categories[cat].includes(id)) {
                        window._vocabulary.categories[cat].push(id);
                    }
                });
            }
        });

        if (added > 0) {
            console.log(`Team03 Integration: Loaded ${added} custom words into global vocabulary`);
        }
    } catch (error) {
        console.error("Team03 Integration: Error loading custom words:", error);
    }
}

