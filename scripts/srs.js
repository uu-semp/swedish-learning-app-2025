// ==============================================
// Shared spaced-repetition support
// ==============================================

"use strict";

(() => {
  const SRS_KEY = "srs";

  function requireServices() {
    if (!window.save || !window.vocabulary) {
      throw new Error("SRS requires the shared save and vocabulary APIs.");
    }
  }

  function getWordRecords(gameId) {
    requireServices();
    if (typeof gameId !== "string" || !gameId.trim()) {
      throw new TypeError("gameId must be a non-empty string.");
    }
    return window.save.get(gameId, SRS_KEY) || {};
  }

  function getCategoryIds(category) {
    requireServices();
    if (typeof category !== "string" || !category.trim()) {
      throw new TypeError("category must be a non-empty string.");
    }

    const ids = window.vocabulary.get_category(category);
    if (!Array.isArray(ids)) {
      throw new Error(`Unknown or unavailable vocabulary category: ${category}`);
    }
    return ids;
  }

  function recordAnswer(gameId, wordId, correct) {
    requireServices();
    if (typeof gameId !== "string" || !gameId.trim()) {
      throw new TypeError("gameId must be a non-empty string.");
    }
    if (typeof wordId !== "string" || !wordId.trim()) {
      throw new TypeError("wordId must be a non-empty string.");
    }
    if (typeof correct !== "boolean") {
      throw new TypeError("correct must be a boolean.");
    }

    const records = getWordRecords(gameId);
    const previous = records[wordId] || { seen: 0, correct: 0, wrong: 0 };
    const next = {
      seen: previous.seen + 1,
      correct: previous.correct + Number(correct),
      wrong: previous.wrong + Number(!correct),
      lastSeen: new Date().toISOString(),
    };
    records[wordId] = next;

    if (!window.save.set(gameId, SRS_KEY, records)) {
      throw new Error(`Could not save spaced-repetition data for ${gameId}.`);
    }
    return next;
  }

  function getWordWeights(gameId, category) {
    const ids = getCategoryIds(category);
    if (ids.length === 0) return [];

    const records = getWordRecords(gameId);
    const weightedWords = ids.map((id) => {
      const record = records[id];
      const seen = record?.seen || 0;
      const wrong = record?.wrong || 0;
      const weight = seen === 0 ? 0.5 : (wrong + 1) / (seen + 2);
      const vocabulary = window.vocabulary.get_vocab(id);
      if (!vocabulary) {
        throw new Error(`Vocabulary entry is unavailable for word ${id}.`);
      }
      return { id, ...vocabulary, weight };
    });

    const totalWeight = weightedWords.reduce((sum, word) => sum + word.weight, 0);
    return weightedWords.map(({ weight, ...word }) => ({
      ...word,
      probability: weight / totalWeight,
    }));
  }

  function getWeightedRandom(gameId, category) {
    const words = getWordWeights(gameId, category);
    if (words.length === 0) return null;

    const target = Math.random();
    let cumulative = 0;
    for (const word of words) {
      cumulative += word.probability;
      if (target < cumulative) return word;
    }
    return words[words.length - 1];
  }

  function getSeenWords(gameIds, category = null) {
    requireServices();
    if (!Array.isArray(gameIds)) {
      throw new TypeError("gameIds must be an array of game IDs.");
    }

    const categories = window.vocabulary.get_categories();
    if (!Array.isArray(categories)) {
      throw new Error("Vocabulary categories are unavailable.");
    }
    const wordCategories = new Map();
    for (const categoryName of categories) {
      for (const id of getCategoryIds(categoryName)) {
        wordCategories.set(id, categoryName);
      }
    }

    const totals = new Map();
    for (const gameId of gameIds) {
      const records = getWordRecords(gameId);
      for (const [id, record] of Object.entries(records)) {
        if (!record || record.seen <= 0) continue;
        const wordCategory = wordCategories.get(id);
        if (!wordCategory || (category && wordCategory !== category)) continue;

        const vocabulary = window.vocabulary.get_vocab(id);
        if (!vocabulary) continue;
        const total = totals.get(id) || {
          id,
          ...vocabulary,
          category: wordCategory,
          seen: 0,
          correct: 0,
          wrong: 0,
          lastSeen: "",
        };
        total.seen += record.seen;
        total.correct += record.correct;
        total.wrong += record.wrong;
        if (record.lastSeen > total.lastSeen) total.lastSeen = record.lastSeen;
        totals.set(id, total);
      }
    }

    return [...totals.values()].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  }

  function clear(gameIds) {
    requireServices();
    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      throw new TypeError("At least one game ID is required to clear SRS data.");
    }

    for (const gameId of gameIds) {
      const data = window.save.get(gameId) || {};
      data[SRS_KEY] = {};
      if (!window.save.set(gameId, data)) {
        throw new Error(`Could not clear spaced-repetition data for ${gameId}.`);
      }
    }
  }

  window.srs = {
    recordAnswer,
    getWordWeights,
    getWeightedRandom,
    getSeenWords,
    clear,
  };
})();
