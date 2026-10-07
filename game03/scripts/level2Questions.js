// Room → scenario → question structure, matching level 1 behaviour
const instructionGroups = [
  // 🖥️ office
  [
    [
      { question: "Placera datorn i mitten.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [2] },
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Placera skrivbordet mellan datorn och lampan.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [3] },
      { question: "Placera bokhyllan mellan stolen och datorn.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [1] }
    ],
    [
      { question: "Placera datorn längst till höger.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [4] },
      { question: "Placera bokhyllan direkt till vänster om datorn.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Placera stolen i mitten.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [2] },
      { question: "Placera lampan direkt till vänster om stolen.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Placera skrivbordet längst till vänster.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [0] }
    ],
    [
      { question: "Placera skrivbordet i mitten.", answer: "desk", swedish: "skrivbord", hint: "You work or study at this.", index: [2] },
      { question: "Placera stolen direkt till höger om skrivbordet.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [3] },
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Placera datorn direkt till vänster om skrivbordet.", answer: "computer", swedish: "dator", hint: "You use this to browse the web and type.", index: [1] },
      { question: "Placera bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ]
  ],

  // 🛋️ livingroom
  [
    [
      { question: "Placera soffan längst till höger.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [4] },
      { question: "Placera tv:n i mitten.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [2] },
      { question: "Placera bordet längst till vänster.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [0] },
      { question: "Placera lampan mellan tv:n och soffan.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [3] },
      { question: "Placera mattan mellan bordet och tv:n.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [1] }
    ],
    [
      { question: "Placera mattan i mitten.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [2] },
      { question: "Placera tv:n direkt till höger om mattan.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [3] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Placera soffan direkt till vänster om mattan.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [1] },
      { question: "Placera lampan längst till vänster.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [0] }
    ],
    [
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Placera mattan direkt till vänster om lampan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Placera soffan direkt till vänster om mattan.", answer: "couch", swedish: "soffa", hint: "A comfortable seat for relaxing.", index: [2] },
      { question: "Placera bordet direkt till vänster om soffan.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Placera tv:n längst till vänster.", answer: "tv", swedish: "tv", hint: "This shows programs and movies.", index: [0] }
    ]
  ],

  // 🛏️ bedroom
  [
    [
      { question: "Placera sängen längst till vänster.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [0] },
      { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [4] },
      { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [2] },
      { question: "Placera mattan mellan lampan och bokhyllan.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Placera kudden mellan sängen och lampan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [1] }
    ],
    [
      { question: "Placera sängen i mitten.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [2] },
      { question: "Placera kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [3] },
      { question: "Placera mattan längst till höger.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [4] },
      { question: "Placera lampan direkt till vänster om sängen.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [1] },
      { question: "Placera bokhyllan längst till vänster.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [0] }
    ],
    [
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Placera bokhyllan direkt till vänster om lampan.", answer: "bookshelf", swedish: "bokhylla", hint: "This holds books and decorations.", index: [3] },
      { question: "Placera kudden direkt till vänster om bokhyllan.", answer: "pillow", swedish: "kudde", hint: "A soft cushion for your head.", index: [2] },
      { question: "Placera sängen direkt till vänster om kudden.", answer: "bed", swedish: "säng", hint: "You sleep on this.", index: [1] },
      { question: "Placera mattan längst till vänster.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [0] }
    ]
  ],

  // 🍳 kitchen
  [
    [
      { question: "Placera kylskåpet i mitten.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [2] },
      { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [4] },
      { question: "Placera spisen mellan kylskåpet och bordet.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [3] },
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] },
      { question: "Placera dörren mellan stolen och kylskåpet.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [1] }
    ],
    [
      { question: "Placera dörren i mitten.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [2] },
      { question: "Placera stolen längst till höger.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [4] },
      { question: "Placera bordet direkt till vänster om stolen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [3] },
      { question: "Placera spisen direkt till vänster om dörren.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [1] },
      { question: "Placera kylskåpet längst till vänster.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [0] }
    ],
    [
      { question: "Placera spisen i mitten.", answer: "stove", swedish: "spis", hint: "This cooks food with heat.", index: [2] },
      { question: "Placera kylskåpet direkt till höger om spisen.", answer: "refrigerator", swedish: "kylskåp", hint: "It keeps food cold.", index: [3] },
      { question: "Placera dörren längst till höger.", answer: "door", swedish: "dörr", hint: "It opens to let you enter a room.", index: [4] },
      { question: "Placera bordet direkt till vänster om spisen.", answer: "table", swedish: "bord", hint: "A flat surface for eating or working.", index: [1] },
      { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", hint: "You sit on this.", index: [0] }
    ]
  ],

  // bathroom
  [
    // Layout: [0 skåp, 1 spegel, 2 toalett, 3 handduk, 4 dusch]
    [
      { question: "Placera toaletten i mitten.", answer: "toilet", swedish: "toalett", hint: "You sit on this in the bathroom.", index: [2] },
      { question: "Placera skåpet längst till vänster.", answer: "cupboard", swedish: "skåp", hint: "It stores things behind a door.", index: [0] },
      { question: "Placera handduken direkt till höger om toaletten.", answer: "towel", swedish: "handduk", hint: "You dry yourself with this.", index: [3] },
      { question: "Placera duschen längst till höger.", answer: "shower", swedish: "dusch", hint: "You wash yourself under this.", index: [4] },
      { question: "Placera spegeln mellan skåpet och toaletten.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [1] }
    ],
    // Layout: [0 handduk, 1 dusch, 2 lampa, 3 matta, 4 toalett]
    [
      { question: "Placera toaletten längst till höger.", answer: "toilet", swedish: "toalett", hint: "You sit on this in the bathroom.", index: [4] },
      { question: "Placera mattan direkt till vänster om toaletten.", answer: "carpet", swedish: "matta", hint: "A soft floor covering.", index: [3] },
      { question: "Placera lampan direkt till vänster om mattan.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [2] },
      { question: "Placera duschen direkt till vänster om lampan.", answer: "shower", swedish: "dusch", hint: "You wash yourself under this.", index: [1] },
      { question: "Placera handduken längst till vänster.", answer: "towel", swedish: "handduk", hint: "You dry yourself with this.", index: [0] }
    ],
    // Layout: [0 toalett, 1 skåp, 2 dusch, 3 spegel, 4 lampa]
    [
      { question: "Placera duschen i mitten.", answer: "shower", swedish: "dusch", hint: "You wash yourself under this.", index: [2] },
      { question: "Placera skåpet direkt till vänster om duschen.", answer: "cupboard", swedish: "skåp", hint: "It stores things behind a door.", index: [1] },
      { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", hint: "It shines light in a room.", index: [4] },
      { question: "Placera spegeln mellan duschen och lampan.", answer: "mirror", swedish: "spegel", hint: "You look at yourself in this.", index: [3] },
      { question: "Placera toaletten längst till vänster.", answer: "toilet", swedish: "toalett", hint: "You sit on this in the bathroom.", index: [0] }
    ]
  ]
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

window.getRandomQuestions = getRandomQuestions;
window.getRandomDistractorImages = function getRandomDistractorImages() {
  return new Promise(resolve => {
    window.vocabulary.when_ready(() => {
      const furnitureIds = window.vocabulary.get_category("furniture");
      const furnitureVocabularies = furnitureIds.map(id => window.vocabulary.get_vocab(id));
      const allFurnitureImages = furnitureVocabularies.filter(v => v.img).map(v => v.img);
      const requiredImages = selectedGroup ? selectedGroup.map(q => q.answer) : [];
      const allImageNames = allFurnitureImages.map(path => path.split('/').pop().replace('.png', ''));
      const availableDistractors = allImageNames.filter(name => !requiredImages.includes(name));
      const shuffled = [...availableDistractors].sort(() => 0.5 - Math.random());
      const selectedDistractors = shuffled.slice(0, 3);
      const distractorPaths = selectedDistractors.map(name =>
        allFurnitureImages.find(path => path.split('/').pop().replace('.png', '') === name)
      ).filter(Boolean);
      resolve(distractorPaths);
    });
  });
};

// Function to get 3 additional random furniture images (excluding question images)
function getRandomDistractorImages() {
  return new Promise(resolve => {
    window.vocabulary.when_ready(() => {
      // Get all furniture category IDs
      const furnitureIds = window.vocabulary.get_category("furniture");
      const furnitureVocabularies = furnitureIds.map(id => window.vocabulary.get_vocab(id));
      const allFurnitureImages = furnitureVocabularies.filter(v => v.img).map(v => v.img);
      
      // Get the required images from current questions
      const requiredImages = selectedGroup ? selectedGroup.map(q => q.answer) : [];
      
      // Extract image names from paths and filter out required ones
      const allImageNames = allFurnitureImages.map(path => path.split('/').pop().replace('.png', ''));
      const availableDistractors = allImageNames.filter(name => !requiredImages.includes(name));
      
      // Randomly select 3 distractor images
      const shuffled = [...availableDistractors].sort(() => 0.5 - Math.random());
      const selectedDistractors = shuffled.slice(0, 3);
      
      console.log('Available distractor images:', availableDistractors);
      console.log('Selected 3 random distractors:', selectedDistractors);
      
      // Convert back to full image paths
      const distractorPaths = selectedDistractors.map(name => 
        allFurnitureImages.find(path => path.split('/').pop().replace('.png', '') === name)
      ).filter(Boolean);
      
      resolve(distractorPaths);
    });
  });
}

// Export the functions to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
window.getRandomDistractorImages = getRandomDistractorImages;
