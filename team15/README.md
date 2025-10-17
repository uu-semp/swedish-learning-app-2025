# 🏷️ Swedish Learning App – Dressing Pelle

A web-based application that helps users learn basic Swedish words through interactive exercises.

## 💡 Overview / Introduction

This project is an interactive Swedish language-learning game designed to make vocabulary acquisition engaging and effective through playful, avatar-based activities. The main goal of the system is to help players progressively build their Swedish language skills in a structured, game-like environment. In the game, players assist the avatar Pelle by dressing him in different clothing items according to Swedish descriptions, reinforcing vocabulary through visual and interactive learning. The game features three progressive levels, each introducing more complex linguistic challenges. To enhance learning outcomes, the system provides structured feedback, including immediate error detection and end-of-level performance summaries, allowing players to monitor their progress and improve over time.

## ⚙️ Features

- Interactive dressing game with avatar Pelle for vocabulary reinforcement
- Three progressive levels with increasing linguistic complexity
- Immediate feedback on answers (correct/incorrect detection)
- End-of-level performance summaries for progress tracking
- Support for English and Swedish language
- Score counter and wardrobe popup interactions

## 🧰 Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Vue.js
- **Version Control**: Git, GitHub
- **Other Tools**: Figma, VS Code

## 🏗️ Installation / Setup Instructions

### Prerequisites
- **Python 3.9.x or above**
- **Git**

---

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uu-semp/swedish-learning-app-2025.git

2. **Navigate to the project folder:**
   ```bash
    cd swedish-learning-app-2025


3. **Start the server:**
    ```bash
    python3 -m http.server 8000

4. **Open your browser and go to:**
    ```bash
    http://localhost:8000



## 📂 Project Structure

```

team15/
├── components/                     # Reusable UI and functional modules
│   ├── elements/                   # Reusable UI components and logic units
│   │   ├── buttons.js              # Defines various button components used inside app
│   │   ├── correctAnswerFeedback.js# Displays feedback for correct answers
│   │   ├── dressPellePrompt.js     # Manages prompts instructions for dressing Pelle
│   │   ├── incorrectAnswerFeedback.js# Handles feedback for incorrect answers
│   │   ├── pelleContainer.js       # Container for Pelle character, related state, and event handlers
│   │   ├── scoreCounter.js         # Tracks and updates the player’s score
│   │   ├── statisticsPopUp.js      # Displays player statistics in a pop-up modal
│   │   └── wardrobeContainer.js    # Manages the wardrobe UI, event handlers, game logic
│   ├── styling/                    # CSS styles for views and components
│   │   ├── chooseLevelStyles.css   # Styles for the "Choose Level" screen
│   │   ├── pelle.css               # Styles related to the Pelle character visuals
│   │   ├── score.css               # Styles for score display
│   │   └── wardrobe.css            # Styles for wardrobe
│   └── views/                      # screens of the application
│       ├── chooseLevelView.js      # Screen where the user selects difficulty/level
│       ├── helpView.js             # Displays help and game instructions
│       ├── levelOneView.js         # Game logic and layout for Level 1
│       ├── levelTwoView.js         # Game logic and layout for Level 2
│       ├── levelThreeView.js       # Game logic and layout for Level 3
│       ├── startView.js            # Starting menu and navigation to levels
│       └── index.js                # Entry point for managing and exporting views
├── language/                       # Localization files for multi-language support
│   ├── english.json                # English text translations
│   └── swedish.json                # Swedish text translations
├── app.js                          # Main JavaScript file initializing the app logic
├── clothing-items-info.js          # Contains data about clothing items (local db)
├── index.css                       # Global styling for the entire application
├── index.html                      # Main HTML entry point of the app
├── index.js                        # Root JS file linking HTML, views, and app logic
└── README.md                       # Project documentation (this file)
```
## 👥 Team Members / Contributors
- Abdur Rehman Khalid  
- Anton Sördal  
- Maja Danielsson Kadestam  
- Olivia Lundbergh  
- Shuhan Liang  
- Stanislaw Kaminski  

---

## 🧭 Development Process
We followed the **Scrum** methodology, holding **bi-weekly sprint meetings** and **bi-weekly retrospective meetings**, and used **JIRA** to track issues and milestones.

---

## 🪲 Future Improvements
- Implement **Level 2** and **Level 3**.
