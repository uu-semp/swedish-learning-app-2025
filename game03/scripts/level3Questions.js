// Room → scenario → question structure, matching level 1 behaviour
const instructionGroups = [
  // office
  [
    // Layout: [0 stol, 1 bokhylla, 2 spegel, 3 dator, 4 lampa, 5 skrivbord, 6 kudde]
    [
      { question: "Dra datorn till mitten.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [3] },
      { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Dra lampan direkt till höger om datorn.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Dra skrivbordet direkt till höger om lampan.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [5] },
      { question: "Dra bokhyllan direkt till höger om stolen.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [1] },
      { question: "Dra kudden längst till höger.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [6] },
      { question: "Dra spegeln direkt till vänster om datorn.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [2] }
    ],
    // Layout: [0 spegel, 1 skrivbord, 2 lampa, 3 stol, 4 dator, 5 bokhylla, 6 kudde]
    [
      { question: "Dra stolen till mitten.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [3] },
      { question: "Dra datorn direkt till höger om stolen.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [4] },
      { question: "Dra bokhyllan direkt till höger om datorn.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [5] },
      { question: "Dra kudden längst till höger.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [6] },
      { question: "Dra lampan direkt till vänster om stolen.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [2] },
      { question: "Dra skrivbordet direkt till vänster om lampan.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [1] },
      { question: "Dra spegeln längst till vänster.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [0] }
    ],
    // Layout: [0 bokhylla, 1 kudde, 2 dator, 3 skrivbord, 4 spegel, 5 stol, 6 lampa]
    [
      { question: "Dra lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [6] },
      { question: "Dra stolen direkt till vänster om lampan.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [5] },
      { question: "Dra spegeln direkt till vänster om stolen.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [4] },
      { question: "Dra skrivbordet till mitten.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [3] },
      { question: "Dra datorn direkt till vänster om skrivbordet.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [2] },
      { question: "Dra bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] },
      { question: "Dra kudden direkt till höger om bokhyllan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] }
    ]
  ],

  // livingroom
  [
    // Layout: [0 bord, 1 matta, 2 blomma, 3 tv, 4 lampa, 5 kudde, 6 soffa]
    [
      { question: "Dra soffan längst till höger.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [6] },
      { question: "Dra tv:n till mitten.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [3] },
      { question: "Dra bordet längst till vänster.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [0] },
      { question: "Dra lampan direkt till höger om tv:n.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Dra mattan direkt till höger om bordet.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [1] },
      { question: "Dra kudden direkt till höger om lampan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [5] },
      { question: "Dra blomman direkt till vänster om tv:n.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [2] }
    ],
    // Layout: [0 blomma, 1 lampa, 2 soffa, 3 matta, 4 bord, 5 tv, 6 kudde]
    [
      { question: "Dra mattan till mitten.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Dra bordet direkt till höger om mattan.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Dra tv:n direkt till höger om bordet.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [5] },
      { question: "Dra kudden längst till höger.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [6] },
      { question: "Dra soffan direkt till vänster om mattan.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [2] },
      { question: "Dra lampan direkt till vänster om soffan.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Dra blomman längst till vänster.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [0] }
    ],
    // Layout: [0 tv, 1 kudde, 2 bord, 3 soffa, 4 blomma, 5 matta, 6 lampa]
    [
      { question: "Dra tv:n längst till vänster.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [0] },
      { question: "Dra kudden direkt till höger om tv:n.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] },
      { question: "Dra soffan till mitten.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [3] },
      { question: "Dra bordet direkt till vänster om soffan.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [2] },
      { question: "Dra lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [6] },
      { question: "Dra mattan direkt till vänster om lampan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [5] },
      { question: "Dra blomman direkt till höger om soffan.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [4] }
    ]
  ],

  // bedroom
  [
    // Layout: [0 säng, 1 kudde, 2 garderob, 3 lampa, 4 matta, 5 spegel, 6 bokhylla]
    [
      { question: "Dra sängen längst till vänster.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [0] },
      { question: "Dra bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [6] },
      { question: "Dra lampan till mitten.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Dra mattan direkt till höger om lampan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [4] },
      { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] },
      { question: "Dra spegeln direkt till höger om mattan.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [5] },
      { question: "Dra garderoben direkt till vänster om lampan.", answer: "wardrobe", swedish: "garderob", hint: "You hang clothes in this.", index: [2] }
    ],
    // Layout: [0 garderob, 1 spegel, 2 matta, 3 säng, 4 kudde, 5 lampa, 6 bokhylla]
    [
      { question: "Dra sängen till mitten.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [3] },
      { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [4] },
      { question: "Dra lampan direkt till höger om kudden.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [5] },
      { question: "Dra bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [6] },
      { question: "Dra mattan direkt till vänster om sängen.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [2] },
      { question: "Dra spegeln direkt till vänster om mattan.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [1] },
      { question: "Dra garderoben längst till vänster.", answer: "wardrobe", swedish: "garderob", hint: "You hang clothes in this.", index: [0] }
    ],
    // Layout: [0 bokhylla, 1 lampa, 2 säng, 3 spegel, 4 garderob, 5 kudde, 6 matta]
    [
      { question: "Dra bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] },
      { question: "Dra lampan direkt till höger om bokhyllan.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Dra sängen direkt till höger om lampan.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [2] },
      { question: "Dra mattan längst till höger.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [6] },
      { question: "Dra kudden direkt till vänster om mattan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [5] },
      { question: "Dra garderoben direkt till vänster om kudden.", answer: "wardrobe", swedish: "garderob", hint: "You hang clothes in this.", index: [4] },
      { question: "Dra spegeln till mitten.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [3] }
    ]
  ],

  // kitchen
  [
    // Layout: [0 stol, 1 dörr, 2 blomma, 3 kylskåp, 4 spis, 5 bord, 6 skåp]
    [
      { question: "Dra kylskåpet till mitten.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [3] },
      { question: "Dra spisen direkt till höger om kylskåpet.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [4] },
      { question: "Dra bordet direkt till höger om spisen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [5] },
      { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Dra dörren direkt till höger om stolen.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [1] },
      { question: "Dra skåpet längst till höger.", answer: "cupboard", swedish: "skåp", hint: "It stores dishes or food.", index: [6] },
      { question: "Dra blomman direkt till vänster om kylskåpet.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [2] }
    ],
    // Layout: [0 skåp, 1 stol, 2 spis, 3 dörr, 4 kylskåp, 5 blomma, 6 bord]
    [
      { question: "Dra dörren till mitten.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [3] },
      { question: "Dra kylskåpet direkt till höger om dörren.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [4] },
      { question: "Dra blomman direkt till höger om kylskåpet.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [5] },
      { question: "Dra bordet längst till höger.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [6] },
      { question: "Dra spisen direkt till vänster om dörren.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [2] },
      { question: "Dra stolen direkt till vänster om spisen.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [1] },
      { question: "Dra skåpet längst till vänster.", answer: "cupboard", swedish: "skåp", hint: "It stores dishes or food.", index: [0] }
    ],
    // Layout: [0 blomma, 1 bord, 2 spis, 3 stol, 4 skåp, 5 dörr, 6 kylskåp]
    [
      { question: "Dra kylskåpet längst till höger.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [6] },
      { question: "Dra dörren direkt till vänster om kylskåpet.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [5] },
      { question: "Dra skåpet direkt till vänster om dörren.", answer: "cupboard", swedish: "skåp", hint: "It stores dishes or food.", index: [4] },
      { question: "Dra stolen till mitten.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [3] },
      { question: "Dra spisen direkt till vänster om stolen.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [2] },
      { question: "Dra bordet direkt till vänster om spisen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Dra blomman längst till vänster.", answer: "flower", swedish: "blomma", hint: "A living plant with petals.", index: [0] }
    ]
  ],

  // bathroom
  []
];

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

let selectedGroup = null;
window.resetSelectedGroup = function () {
  selectedGroup = null;
};

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

  console.log('Selected scenario:', selectedGroup, '. Learned word count:', minLearnedCount);

  return Array.isArray(selectedGroup) ? [...selectedGroup] : [];
}

window.getRandomQuestions = getRandomQuestions;
