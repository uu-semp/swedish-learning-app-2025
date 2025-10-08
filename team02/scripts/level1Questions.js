// 4 groups of connected instructions for a row layout
const instructionGroups = [
  // Group 1: Office setup
  [
    { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator" },
    { question: "Dra 'stol' vänster om 'dator'.", answer: "chair", swedish: "stol" },
    { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa" },
    { question: "Dra 'skrivbord' under 'dator'.", answer: "desk", swedish: "skrivbord" },
    { question: "Dra 'bokhylla' vänster om 'stol'.", answer: "bookshelf", swedish: "bokhylla" }
  ],
  
  // Group 2: Living room setup
  [
    { question: "Dra 'soffa' mitten.", answer: "couch", swedish: "soffa" },
    { question: "Dra 'tv' höger om 'soffa'.", answer: "tv", swedish: "tv" },
    { question: "Dra 'bord' vänster om 'soffa'.", answer: "table", swedish: "bord" },
    { question: "Dra 'lampa' höger om 'tv'.", answer: "lamp", swedish: "lampa" },
    { question: "Dra 'matta' under 'soffa'.", answer: "carpet", swedish: "matta" }
  ],
  
  // Group 3: Bedroom setup
  [
    { question: "Dra 'säng' mitten.", answer: "bed", swedish: "säng" },
    { question: "Dra 'kudde' på 'säng'.", answer: "pillow", swedish: "kudde" },
    { question: "Dra 'bokhylla' vänster om 'säng'.", answer: "bookshelf", swedish: "bokhylla" },
    { question: "Dra 'lampa' höger om 'säng'.", answer: "lamp", swedish: "lampa" },
    { question: "Dra 'matta' under 'säng'.", answer: "carpet", swedish: "matta" }
  ],
  
  // Group 4: Kitchen setup
  [
    { question: "Dra 'kylskåp' vänster.", answer: "refrigerator", swedish: "kylskåp" },
    { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis" },
    { question: "Dra 'bord' mitten.", answer: "table", swedish: "bord" },
    { question: "Dra 'stol' vänster om 'bord'.", answer: "chair", swedish: "stol" },
    { question: "Dra 'dörr' höger om 'spis'.", answer: "door", swedish: "dörr" }
  ]
];

// Store the selected group globally so both scripts use the same group
let selectedGroup = null;

// Function to get 1 random group (5 connected questions) - returns a copy
function getRandomQuestions() {
  if (!selectedGroup) {
    const randomGroupIndex = Math.floor(Math.random() * instructionGroups.length);
    selectedGroup = instructionGroups[randomGroupIndex];
    console.log('Selected group index:', randomGroupIndex);
    console.log('Selected group questions:', selectedGroup);
  }
  // Return a copy of the group so modifications don't affect other scripts
  return [...selectedGroup];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;