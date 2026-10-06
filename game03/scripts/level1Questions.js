const instructionGroups = [
  // Group 1: Office setup (3 scenarios)
  [
    // Layout: [0 stol, 1 bokhylla, 2 dator, 3 lampa, 4 skrivbord]
    [
      { question: "Dra datorn till mitten.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [2] },
      { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Dra lampan direkt till höger om datorn.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Dra skrivbordet längst till höger.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [4] },
      { question: "Dra bokhyllan direkt till höger om stolen.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [1] }
    ],
    // Layout: [0 skrivbord, 1 lampa, 2 stol, 3 bokhylla, 4 dator]
    [
      { question: "Dra datorn längst till höger.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [4] },
      { question: "Dra bokhyllan direkt till vänster om datorn.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Dra stolen till mitten.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [2] },
      { question: "Dra lampan direkt till vänster om stolen.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Dra skrivbordet längst till vänster.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [0] }
    ],
    // Layout: [0 bokhylla, 1 dator, 2 skrivbord, 3 stol, 4 lampa]
    [
      { question: "Dra skrivbordet till mitten.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [2] },
      { question: "Dra stolen direkt till höger om skrivbordet.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [3] },
      { question: "Dra lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Dra datorn direkt till vänster om skrivbordet.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [1] },
      { question: "Dra bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ]
  ],

  // Group 2: Living room setup (3 scenarios)
  [
    // Layout: [0 bord, 1 matta, 2 tv, 3 lampa, 4 soffa]
    [
      { question: "Dra soffan längst till höger.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [4] },
      { question: "Dra tv:n till mitten.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [2] },
      { question: "Dra bordet längst till vänster.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [0] },
      { question: "Dra lampan direkt till höger om tv:n.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Dra mattan direkt till vänster om tv:n.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [1] }
    ],
    // Layout: [0 lampa, 1 soffa, 2 matta, 3 tv, 4 bord]
    [
      { question: "Dra mattan till mitten.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [2] },
      { question: "Dra tv:n direkt till höger om mattan.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [3] },
      { question: "Dra bordet längst till höger.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Dra soffan direkt till vänster om mattan.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [1] },
      { question: "Dra lampan längst till vänster.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [0] }
    ],
    // Layout: [0 tv, 1 bord, 2 soffa, 3 matta, 4 lampa]
    [
      { question: "Dra lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Dra mattan direkt till vänster om lampan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Dra soffan direkt till vänster om mattan.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [2] },
      { question: "Dra bordet direkt till vänster om soffan.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Dra tv:n längst till vänster.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [0] }
    ]
  ],

  // Group 3: Bedroom setup (3 scenarios)
  [
    // Layout: [0 säng, 1 kudde, 2 lampa, 3 matta, 4 bokhylla]
    [
      { question: "Dra sängen längst till vänster.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [0] },
      { question: "Dra bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [4] },
      { question: "Dra lampan till mitten.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [2] },
      { question: "Dra mattan direkt till höger om lampan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] }
    ],
    // Layout: [0 bokhylla, 1 lampa, 2 säng, 3 kudde, 4 matta]
    [
      { question: "Dra sängen till mitten.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [2] },
      { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [3] },
      { question: "Dra mattan längst till höger.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [4] },
      { question: "Dra lampan direkt till vänster om sängen.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Dra bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ],
    // Layout: [0 matta, 1 säng, 2 kudde, 3 bokhylla, 4 lampa]
    [
      { question: "Dra lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Dra bokhyllan direkt till vänster om lampan.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Dra kudden direkt till vänster om bokhyllan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [2] },
      { question: "Dra sängen direkt till vänster om kudden.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [1] },
      { question: "Dra mattan längst till vänster.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [0] }
    ]
  ],

  // Group 4: Kitchen setup (3 scenarios)
  [
    // Layout: [0 stol, 1 dörr, 2 kylskåp, 3 spis, 4 bord]
    [
      { question: "Dra kylskåpet till mitten.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [2] },
      { question: "Dra spisen direkt till höger om kylskåpet.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [3] },
      { question: "Dra bordet längst till höger.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Dra dörren direkt till vänster om kylskåpet.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [1] }
    ],
    // Layout: [0 kylskåp, 1 spis, 2 dörr, 3 bord, 4 stol]
    [
      { question: "Dra dörren till mitten.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [2] },
      { question: "Dra stolen längst till höger.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [4] },
      { question: "Dra bordet direkt till vänster om stolen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [3] },
      { question: "Dra spisen direkt till vänster om dörren.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [1] },
      { question: "Dra kylskåpet längst till vänster.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [0] }
    ],
    // Layout: [0 stol, 1 bord, 2 spis, 3 kylskåp, 4 dörr]
    [
      { question: "Dra spisen till mitten.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [2] },
      { question: "Dra kylskåpet direkt till höger om spisen.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [3] },
      { question: "Dra dörren längst till höger.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [4] },
      { question: "Dra bordet direkt till vänster om spisen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] }
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
