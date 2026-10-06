const instructionGroups = [
  // Group 1: Office setup (3 scenarios)
  [
    // Layout: [0 stol, 1 bokhylla, 2 dator, 3 lampa, 4 skrivbord]
    [
      { question: "Drag the 'dator' to the middle.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [2] },
      { question: "Drag the 'stol' all the way to the left.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Drag the 'lampa' directly to the right of the 'dator'.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Drag the 'skrivbord' all the way to the right.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [4] },
      { question: "Drag the 'bokhylla' directly to the right of the 'stol'.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [1] }
    ],
    // Layout: [0 skrivbord, 1 lampa, 2 stol, 3 bokhylla, 4 dator]
    [
      { question: "Drag the 'dator' all the way to the right.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [4] },
      { question: "Drag the 'bokhylla' directly to the left of the 'dator'.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Drag the 'stol' to the middle.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [2] },
      { question: "Drag the 'lampa' directly to the left of the 'stol'.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Drag the 'skrivbord' all the way to the left.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [0] }
    ],
    // Layout: [0 bokhylla, 1 dator, 2 skrivbord, 3 stol, 4 lampa]
    [
      { question: "Drag the 'skrivbord' to the middle.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [2] },
      { question: "Drag the 'stol' directly to the right of the 'skrivbord'.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [3] },
      { question: "Drag the 'lampa' all the way to the right.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Drag the 'dator' directly to the left of the 'skrivbord'.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [1] },
      { question: "Drag the 'bokhylla' all the way to the left.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ]
  ],

  // Group 2: Living room setup (3 scenarios)
  [
    // Layout: [0 bord, 1 matta, 2 tv, 3 lampa, 4 soffa]
    [
      { question: "Drag the 'soffa' all the way to the right.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [4] },
      { question: "Drag the 'tv' to the middle.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [2] },
      { question: "Drag the 'bord' all the way to the left.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [0] },
      { question: "Drag the 'lampa' directly to the right of the 'tv'.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Drag the 'matta' directly to the left of the 'tv'.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [1] }
    ],
    // Layout: [0 lampa, 1 soffa, 2 matta, 3 tv, 4 bord]
    [
      { question: "Drag the 'matta' to the middle.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [2] },
      { question: "Drag the 'tv' directly to the right of the 'matta'.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [3] },
      { question: "Drag the 'bord' all the way to the right.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Drag the 'soffa' directly to the left of the 'matta'.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [1] },
      { question: "Drag the 'lampa' all the way to the left.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [0] }
    ],
    // Layout: [0 tv, 1 bord, 2 soffa, 3 matta, 4 lampa]
    [
      { question: "Drag the 'lampa' all the way to the right.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Drag the 'matta' directly to the left of the 'lampa'.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Drag the 'soffa' directly to the left of the 'matta'.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [2] },
      { question: "Drag the 'bord' directly to the left of the 'soffa'.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Drag the 'tv' all the way to the left.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [0] }
    ]
  ],

  // Group 3: Bedroom setup (3 scenarios)
  [
    // Layout: [0 säng, 1 kudde, 2 lampa, 3 matta, 4 bokhylla]
    [
      { question: "Drag the 'säng' all the way to the left.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [0] },
      { question: "Drag the 'bokhylla' all the way to the right.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [4] },
      { question: "Drag the 'lampa' to the middle.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [2] },
      { question: "Drag the 'matta' directly to the right of the 'lampa'.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Drag the 'kudde' directly to the right of the 'säng'.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] }
    ],
    // Layout: [0 bokhylla, 1 lampa, 2 säng, 3 kudde, 4 matta]
    [
      { question: "Drag the 'säng' to the middle.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [2] },
      { question: "Drag the 'kudde' directly to the right of the 'säng'.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [3] },
      { question: "Drag the 'matta' all the way to the right.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [4] },
      { question: "Drag the 'lampa' directly to the left of the 'säng'.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Drag the 'bokhylla' all the way to the left.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ],
    // Layout: [0 matta, 1 säng, 2 kudde, 3 bokhylla, 4 lampa]
    [
      { question: "Drag the 'lampa' all the way to the right.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Drag the 'bokhylla' directly to the left of the 'lampa'.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Drag the 'kudde' directly to the left of the 'bokhylla'.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [2] },
      { question: "Drag the 'säng' directly to the left of the 'kudde'.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [1] },
      { question: "Drag the 'matta' all the way to the left.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [0] }
    ]
  ],

  // Group 4: Kitchen setup (3 scenarios)
  [
    // Layout: [0 stol, 1 dörr, 2 kylskåp, 3 spis, 4 bord]
    [
      { question: "Drag the 'kylskåp' to the middle.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [2] },
      { question: "Drag the 'spis' directly to the right of the 'kylskåp'.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [3] },
      { question: "Drag the 'bord' all the way to the right.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Drag the 'stol' all the way to the left.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Drag the 'dörr' directly to the left of the 'kylskåp'.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [1] }
    ],
    // Layout: [0 kylskåp, 1 spis, 2 dörr, 3 bord, 4 stol]
    [
      { question: "Drag the 'dörr' to the middle.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [2] },
      { question: "Drag the 'stol' all the way to the right.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [4] },
      { question: "Drag the 'bord' directly to the left of the 'stol'.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [3] },
      { question: "Drag the 'spis' directly to the left of the 'dörr'.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [1] },
      { question: "Drag the 'kylskåp' all the way to the left.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [0] }
    ],
    // Layout: [0 stol, 1 bord, 2 spis, 3 kylskåp, 4 dörr]
    [
      { question: "Drag the 'spis' to the middle.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [2] },
      { question: "Drag the 'kylskåp' directly to the right of the 'spis'.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [3] },
      { question: "Drag the 'dörr' all the way to the right.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [4] },
      { question: "Drag the 'bord' directly to the left of the 'spis'.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Drag the 'stol' all the way to the left.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] }
    ]
  ],

  // Group 5: Bathroom setup (ignored for now, no scenarios)
  []
];

// Room picked in the main menu (level.html?level=N&room=…) selects its scenarios,
// and one of them is chosen at random
const ROOM_GROUP_INDEX = { office: 0, livingroom: 1, bedroom: 2, kitchen: 3, bathroom: 4 };
function getRoomGroup() {
  const roomParam = new URLSearchParams(window.location.search).get("room");
  const storedRoom = localStorage.getItem('gameRoom');
  const room = roomParam || storedRoom || 'office';

  if (!(room in ROOM_GROUP_INDEX)) return null;
  const scenarios = instructionGroups[ROOM_GROUP_INDEX[room]];
  if (!Array.isArray(scenarios) || scenarios.length === 0) return null;
  const scenarioIndex = Math.floor(Math.random() * scenarios.length);
  return Array.isArray(scenarios[scenarioIndex]) ? scenarios[scenarioIndex] : [];
}

// Store the selected group globally so both scripts use the same group
let selectedGroup = null;
window.resetSelectedGroup = function () {
  selectedGroup = null;
};

// Function to get 1 random scenario with least learned words (5 connected questions) - returns a copy
function getRandomQuestions() {
  const roomGroup = getRoomGroup();
  if (Array.isArray(roomGroup) && roomGroup.length > 0 && roomGroup[0] && typeof roomGroup[0] === 'object' && 'question' in roomGroup[0]) {
    selectedGroup = roomGroup;
    return [...selectedGroup];
  }

  const learnedWords = (window.save && window.save.get ? window.save.get("game03", "learnedWords") : []) || [];

  const allScenarios = instructionGroups
    .filter(Array.isArray)
    .flatMap(group => group.filter(Array.isArray));

  if (allScenarios.length === 0) {
    return [];
  }

  const learnedCounts = allScenarios.map(scenario =>
    scenario.filter(item => learnedWords.includes(item.swedish)).length
  );

  const minLearnedCount = Math.min(...learnedCounts);
  const leastLearnedScenarios = allScenarios.filter((_, i) => learnedCounts[i] === minLearnedCount);

  const randomIndex = Math.floor(Math.random() * leastLearnedScenarios.length);
  selectedGroup = leastLearnedScenarios[randomIndex] || allScenarios[0];

  console.log('Selected group:', selectedGroup, ". Learned word count: ", minLearnedCount);

  return Array.isArray(selectedGroup) ? [...selectedGroup] : [];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
