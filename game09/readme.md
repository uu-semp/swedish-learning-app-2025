# What Garment Am I? (Game 09)

A Swedish language vocabulary game developed for exchange students to practice clothing terms and grammatical articles (`en` / `ett`).

## Features
- **Level 1:** Multiple-choice image-to-noun recognition.
- **Level 2:** Article (`en` / `ett`) and noun pairing.
- **Level 3:** Free-text typing practice for both article and noun.
- **Dictionary:** Reference list of all clothing vocabulary.
- **Progress Tracking:** Saves completions, high scores, and attempts via shared `save.js`.

## Structure
- `index.html` — Main game launcher
- `level-select.html` — Level picker and local score reset
- `level-view.html` — Viewport for Levels 1 & 2
- `advanced-level-view.html` — Viewport for Level 3
- `dictionary.html` — Vocabulary list
- `information.html` — Educational objectives and course information

## Completed user requirements:
● REQ-STUDENT1 A student needs to choose en or ett during their exercise to learn
when each one is applicable.
● REQ-STUDENT2 A student has to see a picture of the garment and be presented
with different alternative choices in order to learn the Swedish word by associating it
to the picture.
● REQ-STUDENT3 In the third level the student needs to correctly spell the word and
potential prefix of the shown garment in order to learn proper spelling of the Swedish
language.
● REQ-STUDENT4 A student needs to be able to access the instructions for each level
in order to understand the game.
● REQ-STUDENT6 A student needs to be able to access a dictionary with relevant
words in order to practice.
● REQ-STUDENT13 As a student, when entering an incorrect spelling of a word in
level 3, I want to see the correct spelling of the word, so that I can correct my
spelling.
● REQ-DEVELOPER2 As a developer, we need to show the required license for the
pictures used in order to be allowed to use them.

## Incomplete user requirements: 
● REQ-STUDENT5 A student needs to be able to change the main language of the
game, including the game's instructions and menus, to better suit their preferences
and to make their understanding of the game easier.
● REQ-STUDENT7 As a student, I want to see a list of which words I got wrong after I
complete a level, so that I know what I need to rehearse.
● REQ-STUDENT8 As a student, I want to hear how the words I am learning are
pronounced, so that I can improve my verbal comprehension as well as reading.
● REQ-STUDENT9 As a student, I want a level dedicated to learning several Swedish
translations that correspond with a single English word in the course's vocabulary -
for example coat has two translations, rock and kappa - so that I can expand my
Swedish vocabulary further.
● REQ-STUDENT10 As a student, I want to report incorrect translations to the teacher,
so that I can help improve the accuracy of the game.
● REQ-STUDENT11 As a student, I want an explanation of Swedish grammar rules
relating to the level I am playing, so that I have something to base my understanding
on.
● REQ-STUDENT12 As a student, I want to learn how garments are pluralised, so that
I can get a deeper understanding of the words.
● REQ-DEVELOPER1 As a developer, I want to access resources - such as the en/ett
selection button or the clickable buttons - from previous levels, so that I can reuse
them in new levels.
● REQ-TEACHER1 As a teacher, I want to see the learning outcomes of the game, so
that I know how it can fit into my course material.