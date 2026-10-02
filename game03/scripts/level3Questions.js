// Each theme has several sets. A set is one fixed round: items, their correct
// tiles (0-6, left to right) and prompts. Items are placed left to right, and
// each relative prompt refers to the neighbour already placed on its left, so
// prompts always make sense in order.
// Each round we pick a theme (least-learned first) then a random set from it.

const themes = {
  office: [
    [
      { question: "Dra 'stol' längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Dra 'bokhylla' höger om 'stol'.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
      { question: "Dra 'spegel' höger om 'bokhylla'.", answer: "mirror", swedish: "spegel", index: [2] },
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [3] },
      { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'skrivbord' höger om 'lampa'.", answer: "desk", swedish: "skrivbord", index: [5] },
      { question: "Dra 'kudde' längst till höger.", answer: "pillow", swedish: "kudde", index: [6] }
    ],
    [
      { question: "Dra 'kudde' längst till vänster.", answer: "pillow", swedish: "kudde", index: [0] },
      { question: "Dra 'spegel' höger om 'kudde'.", answer: "mirror", swedish: "spegel", index: [1] },
      { question: "Dra 'skrivbord' höger om 'spegel'.", answer: "desk", swedish: "skrivbord", index: [2] },
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [3] },
      { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'bokhylla' höger om 'lampa'.", answer: "bookshelf", swedish: "bokhylla", index: [5] },
      { question: "Dra 'stol' längst till höger.", answer: "chair", swedish: "stol", index: [6] }
    ],
    [
      { question: "Dra 'lampa' längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Dra 'dator' höger om 'lampa'.", answer: "computer", swedish: "dator", index: [1] },
      { question: "Dra 'stol' höger om 'dator'.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Dra 'skrivbord' mitten.", answer: "desk", swedish: "skrivbord", index: [3] },
      { question: "Dra 'bokhylla' höger om 'skrivbord'.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Dra 'spegel' höger om 'bokhylla'.", answer: "mirror", swedish: "spegel", index: [5] },
      { question: "Dra 'kudde' längst till höger.", answer: "pillow", swedish: "kudde", index: [6] }
    ],
    [
      { question: "Dra 'skrivbord' längst till vänster.", answer: "desk", swedish: "skrivbord", index: [0] },
      { question: "Dra 'kudde' höger om 'skrivbord'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'bokhylla' höger om 'kudde'.", answer: "bookshelf", swedish: "bokhylla", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'dator' höger om 'lampa'.", answer: "computer", swedish: "dator", index: [4] },
      { question: "Dra 'spegel' höger om 'dator'.", answer: "mirror", swedish: "spegel", index: [5] },
      { question: "Dra 'stol' längst till höger.", answer: "chair", swedish: "stol", index: [6] }
    ],
    [
      { question: "Dra 'bokhylla' längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Dra 'stol' höger om 'bokhylla'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'lampa' höger om 'stol'.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [3] },
      { question: "Dra 'skrivbord' höger om 'dator'.", answer: "desk", swedish: "skrivbord", index: [4] },
      { question: "Dra 'kudde' höger om 'skrivbord'.", answer: "pillow", swedish: "kudde", index: [5] },
      { question: "Dra 'spegel' längst till höger.", answer: "mirror", swedish: "spegel", index: [6] }
    ],
    [
      { question: "Dra 'spegel' längst till vänster.", answer: "mirror", swedish: "spegel", index: [0] },
      { question: "Dra 'kudde' höger om 'spegel'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'lampa' höger om 'kudde'.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator", index: [3] },
      { question: "Dra 'skrivbord' höger om 'dator'.", answer: "desk", swedish: "skrivbord", index: [4] },
      { question: "Dra 'bokhylla' höger om 'skrivbord'.", answer: "bookshelf", swedish: "bokhylla", index: [5] },
      { question: "Dra 'stol' längst till höger.", answer: "chair", swedish: "stol", index: [6] }
    ]
  ],

  livingroom: [
    [
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Dra 'bord' höger om 'matta'.", answer: "table", swedish: "bord", index: [1] },
      { question: "Dra 'blomma' höger om 'bord'.", answer: "flower", swedish: "blomma", index: [2] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'lampa' höger om 'tv'.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'kudde' höger om 'lampa'.", answer: "pillow", swedish: "kudde", index: [5] },
      { question: "Dra 'soffa' längst till höger.", answer: "couch", swedish: "soffa", index: [6] }
    ],
    [
      { question: "Dra 'soffa' längst till vänster.", answer: "couch", swedish: "soffa", index: [0] },
      { question: "Dra 'kudde' höger om 'soffa'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'lampa' höger om 'kudde'.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'bord' höger om 'tv'.", answer: "table", swedish: "bord", index: [4] },
      { question: "Dra 'blomma' höger om 'bord'.", answer: "flower", swedish: "blomma", index: [5] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [6] }
    ],
    [
      { question: "Dra 'blomma' längst till vänster.", answer: "flower", swedish: "blomma", index: [0] },
      { question: "Dra 'soffa' höger om 'blomma'.", answer: "couch", swedish: "soffa", index: [1] },
      { question: "Dra 'bord' höger om 'soffa'.", answer: "table", swedish: "bord", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'tv' höger om 'lampa'.", answer: "tv", swedish: "tv", index: [4] },
      { question: "Dra 'kudde' höger om 'tv'.", answer: "pillow", swedish: "kudde", index: [5] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [6] }
    ],
    [
      { question: "Dra 'lampa' längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [1] },
      { question: "Dra 'soffa' höger om 'matta'.", answer: "couch", swedish: "soffa", index: [2] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'bord' höger om 'tv'.", answer: "table", swedish: "bord", index: [4] },
      { question: "Dra 'kudde' höger om 'bord'.", answer: "pillow", swedish: "kudde", index: [5] },
      { question: "Dra 'blomma' längst till höger.", answer: "flower", swedish: "blomma", index: [6] }
    ],
    [
      { question: "Dra 'bord' längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Dra 'blomma' höger om 'bord'.", answer: "flower", swedish: "blomma", index: [1] },
      { question: "Dra 'kudde' höger om 'blomma'.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'lampa' höger om 'tv'.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Dra 'soffa' höger om 'lampa'.", answer: "couch", swedish: "soffa", index: [5] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [6] }
    ],
    [
      { question: "Dra 'kudde' längst till vänster.", answer: "pillow", swedish: "kudde", index: [0] },
      { question: "Dra 'lampa' höger om 'kudde'.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Dra 'soffa' höger om 'lampa'.", answer: "couch", swedish: "soffa", index: [2] },
      { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [3] },
      { question: "Dra 'bord' höger om 'tv'.", answer: "table", swedish: "bord", index: [4] },
      { question: "Dra 'blomma' höger om 'bord'.", answer: "flower", swedish: "blomma", index: [5] },
      { question: "Dra 'matta' längst till höger.", answer: "carpet", swedish: "matta", index: [6] }
    ]
  ],

  bedroom: [
    [
      { question: "Dra 'säng' längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Dra 'garderob' höger om 'kudde'.", answer: "wardrobe", swedish: "garderob", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [4] },
      { question: "Dra 'spegel' höger om 'matta'.", answer: "mirror", swedish: "spegel", index: [5] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [6] }
    ],
    [
      { question: "Dra 'bokhylla' längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Dra 'spegel' höger om 'bokhylla'.", answer: "mirror", swedish: "spegel", index: [1] },
      { question: "Dra 'garderob' höger om 'spegel'.", answer: "wardrobe", swedish: "garderob", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [4] },
      { question: "Dra 'kudde' höger om 'matta'.", answer: "pillow", swedish: "kudde", index: [5] },
      { question: "Dra 'säng' längst till höger.", answer: "bed", swedish: "säng", index: [6] }
    ],
    [
      { question: "Dra 'matta' längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Dra 'säng' höger om 'matta'.", answer: "bed", swedish: "säng", index: [1] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'bokhylla' höger om 'lampa'.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Dra 'spegel' höger om 'bokhylla'.", answer: "mirror", swedish: "spegel", index: [5] },
      { question: "Dra 'garderob' längst till höger.", answer: "wardrobe", swedish: "garderob", index: [6] }
    ],
    [
      { question: "Dra 'garderob' längst till vänster.", answer: "wardrobe", swedish: "garderob", index: [0] },
      { question: "Dra 'lampa' höger om 'garderob'.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Dra 'spegel' höger om 'lampa'.", answer: "mirror", swedish: "spegel", index: [2] },
      { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng", index: [3] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [4] },
      { question: "Dra 'matta' höger om 'kudde'.", answer: "carpet", swedish: "matta", index: [5] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [6] }
    ],
    [
      { question: "Dra 'lampa' längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Dra 'bokhylla' höger om 'lampa'.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
      { question: "Dra 'matta' höger om 'bokhylla'.", answer: "carpet", swedish: "matta", index: [2] },
      { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng", index: [3] },
      { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [4] },
      { question: "Dra 'spegel' höger om 'kudde'.", answer: "mirror", swedish: "spegel", index: [5] },
      { question: "Dra 'garderob' längst till höger.", answer: "wardrobe", swedish: "garderob", index: [6] }
    ],
    [
      { question: "Dra 'spegel' längst till vänster.", answer: "mirror", swedish: "spegel", index: [0] },
      { question: "Dra 'garderob' höger om 'spegel'.", answer: "wardrobe", swedish: "garderob", index: [1] },
      { question: "Dra 'kudde' höger om 'garderob'.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Dra 'säng' höger om 'lampa'.", answer: "bed", swedish: "säng", index: [4] },
      { question: "Dra 'matta' höger om 'säng'.", answer: "carpet", swedish: "matta", index: [5] },
      { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [6] }
    ]
  ],

  kitchen: [
    [
      { question: "Dra 'stol' längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Dra 'dörr' höger om 'stol'.", answer: "door", swedish: "dörr", index: [1] },
      { question: "Dra 'blomma' höger om 'dörr'.", answer: "flower", swedish: "blomma", index: [2] },
      { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [4] },
      { question: "Dra 'bord' höger om 'spis'.", answer: "table", swedish: "bord", index: [5] },
      { question: "Dra 'skåp' längst till höger.", answer: "cupboard", swedish: "skåp", index: [6] }
    ],
    [
      { question: "Dra 'skåp' längst till vänster.", answer: "cupboard", swedish: "skåp", index: [0] },
      { question: "Dra 'bord' höger om 'skåp'.", answer: "table", swedish: "bord", index: [1] },
      { question: "Dra 'spis' höger om 'bord'.", answer: "stove", swedish: "spis", index: [2] },
      { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
      { question: "Dra 'dörr' höger om 'kylskåp'.", answer: "door", swedish: "dörr", index: [4] },
      { question: "Dra 'stol' höger om 'dörr'.", answer: "chair", swedish: "stol", index: [5] },
      { question: "Dra 'blomma' längst till höger.", answer: "flower", swedish: "blomma", index: [6] }
    ],
    [
      { question: "Dra 'blomma' längst till vänster.", answer: "flower", swedish: "blomma", index: [0] },
      { question: "Dra 'skåp' höger om 'blomma'.", answer: "cupboard", swedish: "skåp", index: [1] },
      { question: "Dra 'stol' höger om 'skåp'.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord", index: [3] },
      { question: "Dra 'kylskåp' höger om 'bord'.", answer: "refrigerator", swedish: "kylskåp", index: [4] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [5] },
      { question: "Dra 'dörr' längst till höger.", answer: "door", swedish: "dörr", index: [6] }
    ],
    [
      { question: "Dra 'dörr' längst till vänster.", answer: "door", swedish: "dörr", index: [0] },
      { question: "Dra 'stol' höger om 'dörr'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'spis' höger om 'stol'.", answer: "stove", swedish: "spis", index: [2] },
      { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord", index: [3] },
      { question: "Dra 'kylskåp' höger om 'bord'.", answer: "refrigerator", swedish: "kylskåp", index: [4] },
      { question: "Dra 'blomma' höger om 'kylskåp'.", answer: "flower", swedish: "blomma", index: [5] },
      { question: "Dra 'skåp' längst till höger.", answer: "cupboard", swedish: "skåp", index: [6] }
    ],
    [
      { question: "Dra 'bord' längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Dra 'stol' höger om 'bord'.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Dra 'dörr' höger om 'stol'.", answer: "door", swedish: "dörr", index: [2] },
      { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [4] },
      { question: "Dra 'skåp' höger om 'spis'.", answer: "cupboard", swedish: "skåp", index: [5] },
      { question: "Dra 'blomma' längst till höger.", answer: "flower", swedish: "blomma", index: [6] }
    ],
    [
      { question: "Dra 'kylskåp' längst till vänster.", answer: "refrigerator", swedish: "kylskåp", index: [0] },
      { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [1] },
      { question: "Dra 'bord' höger om 'spis'.", answer: "table", swedish: "bord", index: [2] },
      { question: "Dra 'dörr' mitten.", answer: "door", swedish: "dörr", index: [3] },
      { question: "Dra 'stol' höger om 'dörr'.", answer: "chair", swedish: "stol", index: [4] },
      { question: "Dra 'skåp' höger om 'stol'.", answer: "cupboard", swedish: "skåp", index: [5] },
      { question: "Dra 'blomma' längst till höger.", answer: "flower", swedish: "blomma", index: [6] }
    ]
  ]
};

// Store the selected set globally so both scripts use the same round.
let selectedGroup = null;

function getRandomQuestions() {
  if (!selectedGroup) {
    const learnedWords = save.get("game03", "learnedWords") || [];
    const themeNames = Object.keys(themes);

    const learnedCounts = themeNames.map(name =>
      themes[name].flat().filter(item => learnedWords.includes(item.swedish)).length
    );
    const minLearned = Math.min(...learnedCounts);
    const leastLearned = themeNames.filter((_, i) => learnedCounts[i] === minLearned);

    const theme = leastLearned[Math.floor(Math.random() * leastLearned.length)];
    const sets = themes[theme];

    // Shuffle the set indices and take the first that isn't the last-played one
    const lastSet = save.get("game03", "lastSet3");
    const order = window.shuffle(sets.map((_, i) => i));
    const setIndex = order.find(i => `${theme}:${i}` !== lastSet) ?? order[0];
    save.set("game03", "lastSet3", `${theme}:${setIndex}`);
    selectedGroup = sets[setIndex];

    console.log('Selected theme:', theme, 'set', setIndex);
  }
  return [...selectedGroup];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
