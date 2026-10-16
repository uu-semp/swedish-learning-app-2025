# 🏷️ Swedish Learning App – Pelle from head to toe

A web-based application that helps users learn basic Swedish words through interactive exercises.

## 💡 Overview / Introduction

This project is an interactive Swedish language-learning game designed to make vocabulary acquisition engaging and effective through playful, avatar-based activities. The main goal of the system is to help players progressively build their Swedish language skills in a structured, game-like environment. In the game, players point at different body parts of the character "Pelle", reinforcing vocabulary through visual and interactive learning. The game features two progressive levels (a third is planned), each introducing more complex linguistic challenges. To enhance learning outcomes, the system provides structured feedback, including immediate error detection and end-of-level performance summaries, allowing players to monitor their progress and improve over time.

## ⚙️ Features

- Interactive game where the player clicks on Pelle's body parts to learn the Swedish words
- Two progressive levels with increasing linguistic complexity (a third is planned)
- Swedish pronunciation audio for every word
- Immediate feedback on answers (correct/incorrect detection)
- Score and result summary at the end of Level 2
- Support for English and Swedish language

## 🧩 How the Game Works

- Pelle is an SVG image (`components/assets/pictures/pellecharacterbody.svg`) that is loaded into the page as code, which makes every body part clickable.
- Each body part in the SVG is a group (`<g>`) with an `id` that matches the English word in the shared vocabulary database, for example `id="nose"`. To add a new body part, add it both in the SVG and in the database (category `body-part`). OBS! See the text editor for the svg file. 
- The Pelle SVG and the words, articles and audio files from the shared vocabulary database are loaded once in `components/elements/gameData.js` when the game starts, so everything is ready before a level opens.
- All texts are in `language/english.json` and `language/swedish.json`.

## 📋 User Stories

All user stories from D2 and whether they are completed or still open.

### Student

| ID | User story | Status | Comment |
|---|---|---|---|
| REQ-STUDENT1 | As a student, I want to access the game on different devices so that I can practice Swedish in different settings. | Partly completed | Runs in any browser, but it is slower and has bugs in Safari. The layout is not adapted or tested for phones and tablets, and the structure is limited for touch screens. |
| REQ-STUDENT2 | As a student, I want to choose between different levels so that I can practice at a level that fits my learning. | Completed | Level 1 and 2 are playable. Level 3 is locked and still needs to be implemented. |
| REQ-STUDENT3 | As a student, I want to choose between English and Swedish for instructions and buttons so that I can understand the game from the start and gradually practise Swedish. | Completed | |
| REQ-STUDENT4 | As a student, I want clear instructions before playing so that I understand what I am expected to do. | Completed | Help page and instructions in each level. |
| REQ-STUDENT5 | As a student, I want to be introduced to the vocabulary before being asked to identify it so that I can learn new words before having to recall them. | Completed | Level 1 (Explore). |
| REQ-STUDENT6 | As a student, I want to practise connecting Swedish words for body parts to the corresponding body parts so that I can understand and remember the vocabulary. | Completed | Level 1 and 2. |
| REQ-STUDENT7 | As a student, I want to see the article en or ett for each relevant noun so that I can learn the grammatically correct form. | Completed | |
| REQ-STUDENT8 | As a student, I want to hear the Swedish pronunciation of the vocabulary so that I can practise understanding and saying the words. | Completed | Level 1 and 2. |
| REQ-STUDENT9 | As a student, I want to know whether my answer is correct and see the correct answer when it is wrong so that I can learn from my mistakes. | Completed | Level 2. The feedback could be developed further in future levels. |
| REQ-STUDENT10 | As a student, I want an alternative way to enter the Swedish letters å, ä, and ö so that I can complete writing activities even if these letters are not available on my keyboard. | Open | Planned for Level 3, not implemented yet. |

### Teacher

| ID | User story | Status | Comment |
|---|---|---|---|
| REQ-TEACHER1 | As a teacher, I want the game to include the relevant vocabulary from Section 7.3 Hur ser du ut? so that the game corresponds to the Basic Swedish 1 teaching material. | Partly completed | Only the body part vocabulary is included. Adjectives, eye colours and phrases for describing yourself are not implemented yet. |
| REQ-TEACHER2 | As a teacher, I want the Swedish words and grammatical forms used in the game to correspond to the teaching material so that students practise correct Swedish. | Completed | |

### Developer

| ID | User story | Status | Comment |
|---|---|---|---|
| REQ-DEVELOPER1 | As a future developer, I want the project to contain a README file explaining the game and how to work with it so that I can continue development without help from the previous developers. | Completed | |
| REQ-DEVELOPER2 | As a future developer, I want copyright, licence, source, and attribution information for external resources to be documented so that I know how project resources may be reused or modified. | Completed | The audio files are recorded by the team and the images are AI generated. |
| REQ-DEVELOPER3 | As a future developer, I want the source code to use a clear and consistent structure so that I can understand and maintain the module efficiently. | Completed | |

## 🪲 Future Improvements

- Implement **Level 3**, where the player writes the Swedish word for each body part themselves. This level should also include a way to enter å, ä and ö (REQ-STUDENT10). For example, the game marks a body part and the player writes the Swedish word for it.
- Add more vocabulary from Section 7.3, such as adjectives, eye colours and phrases for describing yourself (REQ-TEACHER1). This could be done as a new type of level.
- Adapt the layout for phones, tablets and touch screens, and fix the performance issues in Safari (REQ-STUDENT1). The game has mainly been tested in Chrome, where it works ok. In Safari on Mac some bugs have been found, so the game should be tested and improved for other browsers. 
- Change the main page so it has the correct new name
- Split `index.css` into smaller files in `components/styling/`, one per view or component (for example sky background, buttons, language flags and help view), in the same way as `chooseLevelStyles.css` and `pelleLevels.css` (REQ-DEVELOPER3).
- The language is currently chosen separately in the main menu and in the game. The game could instead use the language selected in the main menu, so the player only has to choose once.


## 🧰 Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Vue.js
- **Version Control**: Git, GitHub
- **Other Tools**: VS Code

## 🏗️ Installation / Setup Instructions

### Prerequisites

- **Python 3.9.x or above**
- **Git**

### Steps

1. **Clone the repository:**
```bash
   git clone https://github.com/uu-semp/swedish-learning-app-2025.git
```

2. **Navigate to the project folder:**
```bash
   cd swedish-learning-app-2025
```

3. **Start the server:**
```bash
   python3 -m http.server 8000
```

4. **Open your browser and go to:**
```
   http://localhost:8000
```

## 👥 Team Members / Contributors

- Beddra Ikriem
- Bartlomiej Sienko
- Sofia Barbaranelli
- Daniel Alariksson
- Gabriella Birkenfalk
- Régis Martins Xavier

## 🧭 Development Process

We followed the **Scrum** methodology, holding **weekly sprint meetings** and **bi-weekly retrospective meetings**, and used **JIRA** to track issues and milestones.