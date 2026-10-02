// Each theme has several sets. A set is one fixed round: items, their correct
// tiles (0-4, left to right) and prompts. The first prompt in a set places an
// item at an absolute spot; later prompts may be relative, but only to an item
// placed earlier in the same set, so they always make sense in order.
// Each round we pick a theme (least-learned first) then a random set from it.

const themes = {
  office: [
    // Set 1 (original)
    [
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [2] },
      { question: "Dra 'stol' längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa", index: [3, 4] },
      { question: "Dra 'skrivbord' höger om 'dator'.", answer: "desk", swedish: "skrivbord", index: [3, 4] },
      { question: "Dra 'bokhylla' höger om 'stol'.", answer: "bookshelf", swedish: "bokhylla", index: [1] }
    ],
    // Set 2
    [
      { question: "Dra 'lampa' längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Dra 'dator' höger om 'lampa'.", answer: "computer", swedish: "dator", index: [1] },
      { question: "Dra 'skrivbord' mitten.", answer: "desk", swedish: "skrivbord", index: [2] },
      { question: "Dra 'stol' höger om 'skrivbord'.", answer: "chair", swedish: "stol", index: [3] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] }
    ],
    // Set 3
    [
      { question: "Dra 'bokhylla' längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Dra 'stol' höger om 'bokhylla'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [2] },
      { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'skrivbord' längst till höger.", answer: "desk", swedish: "skrivbord", index: [4] }
    ],
    // Set 4
    [
      { question: "Dra 'skrivbord' längst till höger.", answer: "desk", swedish: "skrivbord", index: [4] },
      { question: "Dra 'dator' vänster om 'skrivbord'.", answer: "computer", swedish: "dator", index: [3] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'bokhylla' vänster om 'lampa'.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
      { question: "Dra 'stol' längst till vänster.", answer: "chair", swedish: "stol", index: [0] }
    ],
    // Set 5
    [
      { question: "Dra 'stol' mitten.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Dra 'dator' vänster om 'stol'.", answer: "computer", swedish: "dator", index: [1] },
      { question: "Dra 'bokhylla' längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Dra 'skrivbord' höger om 'stol'.", answer: "desk", swedish: "skrivbord", index: [3] },
      { question: "Dra 'lampa' längst till höger.", answer: "lamp", swedish: "lampa", index: [4] }
    ],
    // Set 6
    [
      { question: "Dra 'dator' längst till vänster.", answer: "computer", swedish: "dator", index: [0] },
      { question: "Dra 'skrivbord' höger om 'dator'.", answer: "desk", swedish: "skrivbord", index: [1] },
      { question: "Dra 'stol' mitten.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Dra 'lampa' höger om 'stol'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] }
    ]
  ],

  livingroom: [
    // Set 1 (original)
    [
      { question: "Dra 'soffa' längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [2] },
      { question: "Dra 'bord' vänster om 'tv'.", answer: "table", swedish: "bord", index: [0, 1] },
      { question: "Dra 'lampa' höger om 'tv'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'matta' vänster om 'tv'.", answer: "carpet", swedish: "matta", index: [0, 1] }
    ],
    // Set 2
    [
      { question: "Dra 'tv' längst till vänster.", answer: "tv", swedish: "tv", index: [0] },
      { question: "Dra 'bord' höger om 'tv'.", answer: "table", swedish: "bord", index: [1] },
      { question: "Dra 'soffa' mitten.", answer: "couch", swedish: "soffa", index: [2] },
      { question: "Dra 'lampa' höger om 'soffa'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [4] }
    ],
    // Set 3
    [
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Dra 'soffa' höger om 'matta'.", answer: "couch", swedish: "soffa", index: [1] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'tv' höger om 'lampa'.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'bord' längst till höger.", answer: "table", swedish: "bord", index: [4] }
    ],
    // Set 4
    [
      { question: "Dra 'lampa' längst till höger.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'tv' vänster om 'lampa'.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'soffa' mitten.", answer: "couch", swedish: "soffa", index: [2] },
      { question: "Dra 'bord' vänster om 'soffa'.", answer: "table", swedish: "bord", index: [1] },
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] }
    ],
    // Set 5
    [
      { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord", index: [2] },
      { question: "Dra 'tv' vänster om 'bord'.", answer: "tv", swedish: "tv", index: [1] },
      { question: "Dra 'soffa' längst till vänster.", answer: "couch", swedish: "soffa", index: [0] },
      { question: "Dra 'lampa' höger om 'bord'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [4] }
    ],
    // Set 6
    [
      { question: "Dra 'soffa' längst till vänster.", answer: "couch", swedish: "soffa", index: [0] },
      { question: "Dra 'lampa' höger om 'soffa'.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [2] },
      { question: "Dra 'bord' höger om 'tv'.", answer: "table", swedish: "bord", index: [3] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [4] }
    ]
  ],

  bedroom: [
    // Set 1 (original)
    [
      { question: "Dra 'säng' längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [3] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [1] }
    ],
    // Set 2
    [
      { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng", index: [2] },
      { question: "Dra 'kudde' vänster om 'säng'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'lampa' längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Dra 'bokhylla' höger om 'säng'.", answer: "bookshelf", swedish: "bokhylla", index: [3] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [4] }
    ],
    // Set 3
    [
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Dra 'säng' höger om 'matta'.", answer: "bed", swedish: "säng", index: [1] },
      { question: "Dra 'kudde' mitten.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Dra 'lampa' höger om 'kudde'.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] }
    ],
    // Set 4
    [
      { question: "Dra 'bokhylla' längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Dra 'lampa' höger om 'bokhylla'.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng", index: [2] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [3] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [4] }
    ],
    // Set 5
    [
      { question: "Dra 'lampa' längst till höger.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'bokhylla' vänster om 'lampa'.", answer: "bookshelf", swedish: "bokhylla", index: [3] },
      { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng", index: [2] },
      { question: "Dra 'kudde' vänster om 'säng'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] }
    ],
    // Set 6
    [
      { question: "Dra 'kudde' längst till vänster.", answer: "pillow", swedish: "kudde", index: [0] },
      { question: "Dra 'säng' höger om 'kudde'.", answer: "bed", swedish: "säng", index: [1] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [3] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] }
    ]
  ],

  kitchen: [
    // Set 1 (original)
    [
      { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [3, 4] },
      { question: "Dra 'bord' höger om 'kylskåp'.", answer: "table", swedish: "bord", index: [3, 4] },
      { question: "Dra 'stol' vänster om 'bord'.", answer: "chair", swedish: "stol", index: [0, 1] },
      { question: "Dra 'dörr' vänster om 'kylskåp'.", answer: "door", swedish: "dörr", index: [0, 1] }
    ],
    // Set 2
    [
      { question: "Dra 'dörr' längst till vänster.", answer: "door", swedish: "dörr", index: [0] },
      { question: "Dra 'stol' höger om 'dörr'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [3] },
      { question: "Dra 'bord' längst till höger.", answer: "table", swedish: "bord", index: [4] }
    ],
    // Set 3
    [
      { question: "Dra 'bord' längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Dra 'stol' höger om 'bord'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'spis' mitten.", answer: "stove", swedish: "spis", index: [2] },
      { question: "Dra 'kylskåp' höger om 'spis'.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
      { question: "Dra 'dörr' längst till höger.", answer: "door", swedish: "dörr", index: [4] }
    ],
    // Set 4
    [
      { question: "Dra 'spis' längst till höger.", answer: "stove", swedish: "spis", index: [4] },
      { question: "Dra 'kylskåp' vänster om 'spis'.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
      { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord", index: [2] },
      { question: "Dra 'stol' vänster om 'bord'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'dörr' längst till vänster.", answer: "door", swedish: "dörr", index: [0] }
    ],
    // Set 5
    [
      { question: "Dra 'stol' mitten.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Dra 'bord' höger om 'stol'.", answer: "table", swedish: "bord", index: [3] },
      { question: "Dra 'dörr' längst till vänster.", answer: "door", swedish: "dörr", index: [0] },
      { question: "Dra 'kylskåp' höger om 'dörr'.", answer: "refrigerator", swedish: "kylskåp", index: [1] },
      { question: "Dra 'spis' längst till höger.", answer: "stove", swedish: "spis", index: [4] }
    ],
    // Set 6
    [
      { question: "Dra 'kylskåp' längst till vänster.", answer: "refrigerator", swedish: "kylskåp", index: [0] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [1] },
      { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord", index: [2] },
      { question: "Dra 'stol' höger om 'bord'.", answer: "chair", swedish: "stol", index: [3] },
      { question: "Dra 'dörr' längst till höger.", answer: "door", swedish: "dörr", index: [4] }
    ]
  ]
};

// Store the selected set globally so both scripts (level.js, imageFetching.js)
// use the same round.
let selectedGroup = null;

function getRandomQuestions() {
  if (!selectedGroup) {
    const learnedWords = save.get("game03", "learnedWords") || [];
    const themeNames = Object.keys(themes);

    // Prefer themes whose words the player has learned the least
    const learnedCounts = themeNames.map(name =>
      themes[name].flat().filter(item => learnedWords.includes(item.swedish)).length
    );
    const minLearned = Math.min(...learnedCounts);
    const leastLearned = themeNames.filter((_, i) => learnedCounts[i] === minLearned);

    const theme = leastLearned[Math.floor(Math.random() * leastLearned.length)];
    const sets = themes[theme];

    // Shuffle the set indices and take the first that isn't the last-played one
    const lastSet = save.get("game03", "lastSet1");
    const order = window.shuffle(sets.map((_, i) => i));
    const setIndex = order.find(i => `${theme}:${i}` !== lastSet) ?? order[0];
    save.set("game03", "lastSet1", `${theme}:${setIndex}`);
    selectedGroup = sets[setIndex];

    console.log('Selected theme:', theme, 'set', setIndex);
  }
  return [...selectedGroup];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
