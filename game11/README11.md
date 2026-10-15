# Important information for the next developer, from Game 11.


# Finished 

REQ_STUDENT1: As a student, I want the game to have a clear beginner's guide and English support so that I can understand how to play the game. 

REQ_STUDENT2: As a student, I want to be able to play the game multiple times so that I can practice more with the vocabulary.

REQ_STUDENT3: As a student, I want the game to include words that are relevant to the shopping activity so that I can learn vocabulary that is useful in that context.

REQ_STUDENT4: As a student, I want the game to have a menu so that I can navigate through the game more easily.

REQ_STUDENT5: As a student, I want to be able to listen to the audio pronunciation so that I can learn the correct pronunciation of the vocabulary.

REQ_STUDENT6: As a student, I want the game to work without major bugs so that I can play the game without interruptions.

REQ_STUDENT7: As a student, I want the game to have less repetition between attempts so that I can learn more words from the vocabulary set. 

REQ_STUDENT8: As a student, I want the game to have some sound effects so that the game is more enjoyable and engaging.

REQ_STUDENT9: As a student, I want to receive immediate feedback when I make a mistake or answer correctly so that I can clearly understand whether my answer is correct.

REQ_STUDENT11: As a student, I want to be able to see words, pictures, or audio on the shelf and the shopping list so that I can understand the vocabulary and navigate through the game more easily.

REQ_STUDENT12: As a student, I want to be able to see whether I have put the selected word in the shopping cart so that I can understand the game status.

REQ_STUDENT13: As a student, I want to be able to choose between different game modes so that I can practise the vocabulary in different ways to learn it best.

REQ_TEACHER1: As a teacher, I want the Swedish words used in the game to come only from the course material so that I can make sure that students are learning the right vocabulary.

REQ_TEACHER2: As a teacher, I want the game to be suitable for beginner-level students so that it matches the students' language level.

REQ_TEACHER3: As a teacher, I want the Swedish words and translations in the game to be correct so that students are not learning incorrect vocabulary.

REQ_DEV1: As a developer, I want to display the copyright information for each displayed image to respect the creator and fulfil the legal requirements

REQ_DEV2: As a developer, I want to make sure that the code comments are well written, so that future developers can understand my work and continue working on the project.

REQ_DEV3: As a developer, I want the code to follow a consistent structure and style so that future developers can easily understand and modify it



# Unfinished

REQ_STUDENT10: As a student, I want the game to have clear and appealing visuals so that I can understand the game more easily and enjoy playing it.

REQ_DEV4: As a developer, I want to make sure that commit messages follow a consistent structure so that the development history is easy for future developers to understand and maintain.



# Improvements
The beginner guide and info button could be improved with clearer instructions and visuals. For example, the info text could be shown somewhere else outside the menu modal.

The game already has sound effects, but there could be more, for example, when clicking a button and such.

The majority of functions have code comments, but several functions still lack code comments, and some complicated logic may also require more code comments.

The style and structure could be improved with refactoring; now some functions with similar functionality are created multiple times, and the structure is changed at first glance.

The menu can be improved, as right now it is crowded with too many functionalities.

Make it more visually clear what mode the user is in.

The initialization is a bit slow; it could take more than 3 seconds.



# Language translation
The game currently translates language by directly changing the HTML of every element that needs to be translated, which is stored in `game11/assets/translations.json`. It also checks what the current language is by checking the textContent of the button that changes the language. Ideally, the current language should be stored and retrieved from the game state or from the language API. This would most likely solve the current issues with the translation.
The current issues with the translation:
- The current language is independent of the website's language.
- The current language is now saved between reloads.
- When the game state changes, the status bar language reverts back to Swedish.
- The end game popup is not translated.
