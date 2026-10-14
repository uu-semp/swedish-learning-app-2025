# Game 12 – Hitta rätt hus

## Running the project
This game is a static website and part of the main app in the repository root. To run it locally, serve the repository root and open the game:

```bash
# from the repository root
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.

## Game description
Hitta rätt hus is game 12 of the Swedish Learning App. The game is divided into three difficulties:
- Difficulty 1: choose the correct house on a street given a street name and a number between 1-99. For example: "Jag bor på Svartbäcksgatan 54".
- Difficulty 2: choose the correct house on a street given directions from a landmark. For example: "Jag bor i huset till höger om Domkyrkan"
- Difficulty 3: expanding upon difficulty 2, also choose the correct mode of transportaion. For example: "Jag tar cykeln till huset till vänster om Domkyrkan".

## Architecture
The architecture of the game follows a **Model–View–Controller (MVC)** structure and is built with plain HTML/CSS/JavaScript, using Vue 3.

### View
The following views exist:
- Main menu: displays the main menu, allowing the player to select game difficulty
- Game: displays everything related to the game

### Controller
The following controllers exist:
- Game controller: handles the communication between the game view and the game manager (which resides inside model)

### Model
The following components reside within the Model:
- Game manager: is responsible for keeping track and orchestrating the current game
- Board generator: creates a board given some parameters
- Question generator: creates a question given a board
- Save.js: a shared library for interacting with the browsers local storage
- Graphics: a local folder with images used for graphics
- Vocabulary: both a Google sheets, along with a library for interacting with it


## User stories
**REQ-STUDENT1:** The user needs to be able to choose a difficulty level from the main menu, as seen in Figure 1, so that they can practice at a level appropriate to their current knowledge. :white_check_mark:

**REQ-STUDENT2:** In difficulty 1 (Figure 2), the user needs to be presented with a graphic of streets with names and houses with numbers. Along with this, the user needs to be prompted with a question and click the correct house on the graphic. This is so that they can learn how to read and understand addresses. :white_check_mark:

**REQ-STUDENT3:** In difficulty 2 (Figure 3), the student needs to be presented with a graphic and questions similar to difficulty 1, but expanded with directions (such as “right,” “in front,” etc.) and recognizable landmarks and buildings from Uppsala. This is so that they can learn basic directions in Swedish. :white_check_mark:

**REQ-STUDENT4:** In difficulty 3 (Figure 4), the student needs to be presented with a graphic and questions similar to difficulty 2, but expanded with modes of transportation. This is so that they can learn words related to travelling to places. :white_check_mark:

**REQ-STUDENT5:** In difficulty 2 (Figure 3), the user needs to be able to hover over a famous Uppsala building to see its Swedish name. :white_check_mark:

**REQ-STUDENT6:** The user needs to see their current progress through a level so that they know how far they have come and how many questions are left. :white_check_mark:

**REQ-STUDENT7:** The user needs to be able to return to the main menu during a level so that they can change difficulty or leave the current exercise. :white_check_mark:

**REQ-STUDENT8:** The user needs immediate feedback after selecting an answer so they know whether their answer is correct. :white_check_mark:

**REQ-STUDENT9:** The user needs to be able to continue the game after selecting the right house without having to click a pop-up box. :white_check_mark:

**REQ-STUDENT10:** The user needs incorrectly answered questions to be randomly repeated at the end (until everything is answered correctly) so they can practice the things they failed on. :white_check_mark:

**REQ-STUDENT11:** The user needs to be able to display the complete question in English by requesting a hint so that they can continue when they cannot understand the Swedish question. :white_check_mark:

**REQ-STUDENT12:** The user needs to be able to see which difficulties they have completed in the main menu, as seen in figure 1. :white_check_mark:

**REQ-STUDENT13:** The user needs to know their orientation inside the game for difficulty 2 so that they can answer questions that use directional words like “left,” “right,” and so on. :exclamation: (scrapped)

**REQ-STUDENT14:** The house numbers need to be even on one side and odd on the other side to represent how houses are numbered in Sweden. :white_check_mark:

**REQ-STUDENT15:** The student needs to be able to select a house reliably on a mobile device so that they do not accidentally select a neighboring house. :x: (not implemented)

**REQ-STUDENT16:** The student needs correct and incorrect answers to be communicated using more than color alone so that the feedback is understandable for people who are color blind and cannot distinguish some colors as well. :white_check_mark:

**REQ-STUDENT17:** The student needs to see different expressions using variations of the same word related to transportation so that they can understand different ways of expressing the same thing. For example: “jag cyklar” and “jag tar cykeln.” :white_check_mark:

**REQ-DEVELOPER1:** The developer needs a README file containing setup, local execution, structure, dependencies, and instructions for adding or changing game content so that future developers can maintain and extend the game. :white_check_mark:

**REQ-DEVELOPER2:** The developer needs images, words, and game content to be loaded from a structured content repository. :white_check_mark:

**REQ-DEVELOPER3:** The developer needs images that can be used in the game. The developer also needs copyright and licensing information so that future developers know how each image may be used. :white_check_mark:

**REQ-DEVELOPER4:** The developer needs access to resources and vocabulary that should be used in the game. :white_check_mark:

**REQ-DEVELOPER5:** The developer needs assets to be integrated into the game. :white_check_mark:

**REQ-DEVELOPER6:** The developer needs the game to work both locally and hosted on a remote server. :white_check_mark:

**REQ-TEACHER1:** The teacher needs the words in the game to be from the textbooks and nowhere else. :white_check_mark:

**REQ-TEACHER2:** The teacher needs the game to be intuitive so that her students use it. :exclamation: (not measurable)

**REQ-TEACHER3:** The teacher needs the game to not stress her students and instead make them feel good about their learning. :exclamation: (not measureable)

**REQ-TEACHER4:** The teacher needs the game to be hosted on an accessible server for the students. :white_check_mark:
