// Each theme has several sets. A set is one fixed round: items, their correct
// tiles (0-4, left to right) and prompts. The first prompt places an item at an
// absolute spot; later prompts may be relative, but only to an item placed
// earlier in the same set, so they always make sense in order.
// Each round we pick a theme (least-learned first) then a random set from it.

const themes = {
  office: [
    // Set 1 (original)
    [
      { question: "Placera datorn i mitten.", answer: "computer", swedish: "dator", index: [2] },
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Placera skrivbordet mellan datorn och lampan.", answer: "desk", swedish: "skrivbord", index: [3] },
      { question: "Placera bokhyllan mellan stolen och datorn.", answer: "bookshelf", swedish: "bokhylla", index: [1] }
    ],
    // Set 2
    [
      { question: "Placera lampan längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Placera skrivbordet längst till höger.", answer: "desk", swedish: "skrivbord", index: [4] },
      { question: "Placera datorn i mitten.", answer: "computer", swedish: "dator", index: [2] },
      { question: "Placera bokhyllan mellan lampan och datorn.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
      { question: "Placera stolen mellan datorn och skrivbordet.", answer: "chair", swedish: "stol", index: [3] }
    ],
    // Set 3
    [
      { question: "Placera bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Placera skrivbordet i mitten.", answer: "desk", swedish: "skrivbord", index: [2] },
      { question: "Placera stolen längst till höger.", answer: "chair", swedish: "stol", index: [4] },
      { question: "Placera datorn mellan bokhyllan och skrivbordet.", answer: "computer", swedish: "dator", index: [1] },
      { question: "Placera lampan mellan skrivbordet och stolen.", answer: "lamp", swedish: "lampa", index: [3] }
    ],
    // Set 4
    [
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Placera datorn längst till höger.", answer: "computer", swedish: "dator", index: [4] },
      { question: "Placera bokhyllan mellan stolen och lampan.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
      { question: "Placera skrivbordet mellan lampan och datorn.", answer: "desk", swedish: "skrivbord", index: [3] }
    ],
    // Set 5
    [
      { question: "Placera skrivbordet längst till vänster.", answer: "desk", swedish: "skrivbord", index: [0] },
      { question: "Placera bokhyllan i mitten.", answer: "bookshelf", swedish: "bokhylla", index: [2] },
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", index: [4] },
      { question: "Placera datorn mellan skrivbordet och bokhyllan.", answer: "computer", swedish: "dator", index: [1] },
      { question: "Placera stolen mellan bokhyllan och lampan.", answer: "chair", swedish: "stol", index: [3] }
    ],
    // Set 6
    [
      { question: "Placera datorn längst till vänster.", answer: "computer", swedish: "dator", index: [0] },
      { question: "Placera stolen i mitten.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Placera lampan mellan datorn och stolen.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Placera skrivbordet mellan stolen och bokhyllan.", answer: "desk", swedish: "skrivbord", index: [3] }
    ]
  ],

  livingroom: [
    // Set 1 (original)
    [
      { question: "Placera soffan längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
      { question: "Placera tv:n i mitten.", answer: "tv", swedish: "tv", index: [2] },
      { question: "Placera bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Placera lampan mellan tv:n och soffan.", answer: "lamp", swedish: "lampa", index: [3] },
      { question: "Placera mattan mellan bordet och tv:n.", answer: "carpet", swedish: "matta", index: [1] }
    ],
    // Set 2
    [
      { question: "Placera bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Placera tv:n i mitten.", answer: "tv", swedish: "tv", index: [2] },
      { question: "Placera soffan längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
      { question: "Placera mattan mellan bordet och tv:n.", answer: "carpet", swedish: "matta", index: [1] },
      { question: "Placera lampan mellan tv:n och soffan.", answer: "lamp", swedish: "lampa", index: [3] }
    ],
    // Set 3
    [
      { question: "Placera mattan längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
      { question: "Placera soffan mellan mattan och lampan.", answer: "couch", swedish: "soffa", index: [1] },
      { question: "Placera tv:n mellan lampan och bordet.", answer: "tv", swedish: "tv", index: [3] }
    ],
    // Set 4
    [
      { question: "Placera lampan längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Placera soffan i mitten.", answer: "couch", swedish: "soffa", index: [2] },
      { question: "Placera mattan längst till höger.", answer: "carpet", swedish: "matta", index: [4] },
      { question: "Placera tv:n mellan lampan och soffan.", answer: "tv", swedish: "tv", index: [1] },
      { question: "Placera bordet mellan soffan och mattan.", answer: "table", swedish: "bord", index: [3] }
    ],
    // Set 5
    [
      { question: "Placera soffan längst till vänster.", answer: "couch", swedish: "soffa", index: [0] },
      { question: "Placera bordet i mitten.", answer: "table", swedish: "bord", index: [2] },
      { question: "Placera tv:n längst till höger.", answer: "tv", swedish: "tv", index: [4] },
      { question: "Placera lampan mellan soffan och bordet.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Placera mattan mellan bordet och tv:n.", answer: "carpet", swedish: "matta", index: [3] }
    ],
    // Set 6
    [
      { question: "Placera tv:n längst till vänster.", answer: "tv", swedish: "tv", index: [0] },
      { question: "Placera mattan i mitten.", answer: "carpet", swedish: "matta", index: [2] },
      { question: "Placera soffan längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
      { question: "Placera bordet mellan tv:n och mattan.", answer: "table", swedish: "bord", index: [1] },
      { question: "Placera lampan mellan mattan och soffan.", answer: "lamp", swedish: "lampa", index: [3] }
    ]
  ],

  bedroom: [
    // Set 1 (original)
    [
      { question: "Placera sängen längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
      { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Placera mattan mellan lampan och bokhyllan.", answer: "carpet", swedish: "matta", index: [3] },
      { question: "Placera kudden mellan sängen och lampan.", answer: "pillow", swedish: "kudde", index: [1] }
    ],
    // Set 2
    [
      { question: "Placera kudden längst till vänster.", answer: "pillow", swedish: "kudde", index: [0] },
      { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", index: [2] },
      { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Placera sängen mellan kudden och lampan.", answer: "bed", swedish: "säng", index: [1] },
      { question: "Placera mattan mellan lampan och bokhyllan.", answer: "carpet", swedish: "matta", index: [3] }
    ],
    // Set 3
    [
      { question: "Placera mattan längst till vänster.", answer: "carpet", swedish: "matta", index: [0] },
      { question: "Placera kudden i mitten.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Placera sängen längst till höger.", answer: "bed", swedish: "säng", index: [4] },
      { question: "Placera lampan mellan mattan och kudden.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Placera bokhyllan mellan kudden och sängen.", answer: "bookshelf", swedish: "bokhylla", index: [3] }
    ],
    // Set 4
    [
      { question: "Placera bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", index: [0] },
      { question: "Placera sängen i mitten.", answer: "bed", swedish: "säng", index: [2] },
      { question: "Placera mattan längst till höger.", answer: "carpet", swedish: "matta", index: [4] },
      { question: "Placera lampan mellan bokhyllan och sängen.", answer: "lamp", swedish: "lampa", index: [1] },
      { question: "Placera kudden mellan sängen och mattan.", answer: "pillow", swedish: "kudde", index: [3] }
    ],
    // Set 5
    [
      { question: "Placera lampan längst till vänster.", answer: "lamp", swedish: "lampa", index: [0] },
      { question: "Placera mattan i mitten.", answer: "carpet", swedish: "matta", index: [2] },
      { question: "Placera sängen längst till höger.", answer: "bed", swedish: "säng", index: [4] },
      { question: "Placera kudden mellan lampan och mattan.", answer: "pillow", swedish: "kudde", index: [1] },
      { question: "Placera bokhyllan mellan mattan och sängen.", answer: "bookshelf", swedish: "bokhylla", index: [3] }
    ],
    // Set 6
    [
      { question: "Placera sängen längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
      { question: "Placera kudden i mitten.", answer: "pillow", swedish: "kudde", index: [2] },
      { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
      { question: "Placera mattan mellan sängen och kudden.", answer: "carpet", swedish: "matta", index: [1] },
      { question: "Placera lampan mellan kudden och bokhyllan.", answer: "lamp", swedish: "lampa", index: [3] }
    ]
  ],

  kitchen: [
    // Set 1 (original)
    [
      { question: "Placera kylskåpet i mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
      { question: "Placera spisen mellan kylskåpet och bordet.", answer: "stove", swedish: "spis", index: [3] },
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Placera dörren mellan stolen och kylskåpet.", answer: "door", swedish: "dörr", index: [1] }
    ],
    // Set 2
    [
      { question: "Placera dörren längst till vänster.", answer: "door", swedish: "dörr", index: [0] },
      { question: "Placera kylskåpet i mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
      { question: "Placera stolen mellan dörren och kylskåpet.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Placera spisen mellan kylskåpet och bordet.", answer: "stove", swedish: "spis", index: [3] }
    ],
    // Set 3
    [
      { question: "Placera bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
      { question: "Placera spisen i mitten.", answer: "stove", swedish: "spis", index: [2] },
      { question: "Placera kylskåpet längst till höger.", answer: "refrigerator", swedish: "kylskåp", index: [4] },
      { question: "Placera stolen mellan bordet och spisen.", answer: "chair", swedish: "stol", index: [1] },
      { question: "Placera dörren mellan spisen och kylskåpet.", answer: "door", swedish: "dörr", index: [3] }
    ],
    // Set 4
    [
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
      { question: "Placera bordet i mitten.", answer: "table", swedish: "bord", index: [2] },
      { question: "Placera spisen längst till höger.", answer: "stove", swedish: "spis", index: [4] },
      { question: "Placera dörren mellan stolen och bordet.", answer: "door", swedish: "dörr", index: [1] },
      { question: "Placera kylskåpet mellan bordet och spisen.", answer: "refrigerator", swedish: "kylskåp", index: [3] }
    ],
    // Set 5
    [
      { question: "Placera spisen längst till vänster.", answer: "stove", swedish: "spis", index: [0] },
      { question: "Placera dörren i mitten.", answer: "door", swedish: "dörr", index: [2] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
      { question: "Placera kylskåpet mellan spisen och dörren.", answer: "refrigerator", swedish: "kylskåp", index: [1] },
      { question: "Placera stolen mellan dörren och bordet.", answer: "chair", swedish: "stol", index: [3] }
    ],
    // Set 6
    [
      { question: "Placera kylskåpet längst till vänster.", answer: "refrigerator", swedish: "kylskåp", index: [0] },
      { question: "Placera stolen i mitten.", answer: "chair", swedish: "stol", index: [2] },
      { question: "Placera dörren längst till höger.", answer: "door", swedish: "dörr", index: [4] },
      { question: "Placera spisen mellan kylskåpet och stolen.", answer: "stove", swedish: "spis", index: [1] },
      { question: "Placera bordet mellan stolen och dörren.", answer: "table", swedish: "bord", index: [3] }
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
    const lastSet = save.get("game03", "lastSet2");
    const order = window.shuffle(sets.map((_, i) => i));
    const setIndex = order.find(i => `${theme}:${i}` !== lastSet) ?? order[0];
    save.set("game03", "lastSet2", `${theme}:${setIndex}`);
    selectedGroup = sets[setIndex];

    console.log('Selected theme:', theme, 'set', setIndex);
  }
  return [...selectedGroup];
}

// Get 3 random furniture images not used in the current round, as distractors
function getRandomDistractorImages() {
  return new Promise(resolve => {
    window.vocabulary.when_ready(() => {
      const furnitureIds = window.vocabulary.get_category("furniture");
      const all = furnitureIds.map(id => window.vocabulary.get_vocab(id)).filter(v => v.img).map(v => v.img);
      const used = selectedGroup ? selectedGroup.map(q => q.answer) : [];
      const nameOf = path => path.split('/').pop().replace('.png', '');
      const available = all.filter(path => !used.includes(nameOf(path)));
      resolve(window.shuffle(available).slice(0, 3));
    });
  });
}

// Export the functions to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
window.getRandomDistractorImages = getRandomDistractorImages;
