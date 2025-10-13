// 4 groups of connected instructions for a row layout
const instructionGroups = [
  // Group 1: Office setup
  [
    { question: "Dra 'dator' mitten.", answer: "computer", swedish: "dator" , index: [2] },
    { question: "Dra 'stol' längst till vänster", answer: "chair", swedish: "stol" , index: [0] },
    { question: "Dra 'lampa' höger om 'dator'.", answer: "lamp", swedish: "lampa", index: [3, 4] },
    { question: "Dra 'skrivbord' höger om 'dator'.", answer: "desk", swedish: "skrivbord", index: [3, 4] },
    { question: "Dra 'bokhylla' höger om 'stol'.", answer: "bookshelf", swedish: "bokhylla", index: [1] }
  ],
  
  // Group 2: Living room setup
  [
    { question: "Dra 'soffa' längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
    { question: "Dra 'tv' mitten.", answer: "tv", swedish: "tv", index: [2]},
    { question: "Dra 'bord' vänster om 'tv'.", answer: "table", swedish: "bord", index: [0, 1] },
    { question: "Dra 'lampa' höger om 'tv'.", answer: "lamp", swedish: "lampa", index: [3] },
    { question: "Dra 'matta' vänster om 'tv'.", answer: "carpet", swedish: "matta", index: [0, 1] }
  ],
  
  // Group 3: Bedroom setup
  [
    { question: "Dra 'säng' längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
    { question: "Dra 'bokhylla' längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
    { question: "Dra 'lampa' mitten.", answer: "lamp", swedish: "lampa", index: [2] },
    { question: "Dra 'matta' höger om 'lampa'.", answer: "carpet", swedish: "matta", index: [3] },
    { question: "Dra 'kudde' höger om 'säng'.", answer: "pillow", swedish: "kudde", index: [1] }
  ],
  
  // Group 4: Kitchen setup
  [
    { question: "Dra 'kylskåp' mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
    { question: "Dra 'spis' höger om 'kylskåp'.", answer: "stove", swedish: "spis", index: [3, 4] },
    { question: "Dra 'bord' höger om 'kylskåp'.", answer: "table", swedish: "bord", index: [3, 4] },
    { question: "Dra 'stol' vänster om 'bord'.", answer: "chair", swedish: "stol", index: [0, 1] },
    { question: "Dra 'dörr' vänster om 'kylskåp'.", answer: "door", swedish: "dörr", index: [0, 1] }
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
