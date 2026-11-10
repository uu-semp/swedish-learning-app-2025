# Game 03 – Decorate

A Swedish learning game where you furnish a room by dragging furniture to the
right spot. Each round shows a sentence in Swedish. You drag the named
furniture to the correct floor tile and learn the word and its en/ett article.

## How to play
1. From the main menu, press **Play** and pick a room (office, bedroom, living
   room, kitchen, bathroom).
2. Pick a level.
3. Read the Swedish sentence and drag the matching furniture image onto the
   tile it describes (e.g. "längst till vänster", "höger om 'dator'").
4. Use the **hint** button to see the English translation if you get stuck.
5. When all items are placed, a summary shows your score.

You get a point only if you place an item right on the **first try**. You pass
a level (and get a win) only if you get the **whole round right**.

## Levels
- **Level 1** – place 5 items on a 5-tile row.
- **Level 2** – like level 1, with extra distractor images in the tray.
- **Level 3** – 7 items on a 7-tile row.

Each level has a few question sets per room, picked at random, so the items,
spots and order change each round. The tray images are shuffled too.

### Colour practice
On the menu you can turn on **colour practice** (På/Av) to practise colour
words alongside the furniture.

## Running
From the repo root, serve the site and open the menu:
```
python3 -m http.server 8000
```
Then go to <http://localhost:8000/game03/index.html>.

## Progress
The statistics page (`userStatistics.html`) shows your wins, how many words you
have learned, and how much of the game you have finished (counted across all
rooms and levels). It also has a button to clear the saved stats.

## Vocabulary
The words and images come from the shared vocabulary (`scripts/vocabulary.js`,
`words.csv`), using the `furniture` category. Your learned words are saved with
the shared `save.js` API under the `game03` key.

## Team
Group 14.

## User stories

Based on the D2 requirements. Checked against the current game.

Implemented:
- [x] REQ-STUD1 – As a student I want the furniture in the tray to match the sentence, so I learn the correct word and can trust the game.
- [x] REQ-STUD2 – As a student I want to play a full round from start to end without the game getting stuck, so I can use it as practice.
- [x] REQ-STUD3 – As a beginner I want the rounds mostly in English with only the target noun in Swedish, so I can start before I know the vocabulary.
- [x] REQ-STUD4 – As a student I want to see immediately whether a placement was right or wrong, so I can correct my understanding straight away.
- [x] REQ-STUD5 – As a student I want to choose furniture in the colour named in the instruction, so I practise colour adjectives.
- [x] REQ-STUD7 – As a student I want to restart a round, so I can practise the same words again.
- [x] REQ-STUD8 – As a student I want the game to run in the browser without installing anything, so I can play it on a university computer.
- [x] REQ-STUD9 – As a student I want my progress shown (wins, words, completion), so I can see how I am doing.
- [x] REQ-STUD10 – As a student I want a hint for the target word when I get stuck.
- [x] REQ-STUD11 – As a student I want several levels where the difficulty increases, so I keep improving.

Open:
- [ ] REQ-STUD6 – As a student I want the colour to also be readable as text, so I can play the colour rounds even if I cannot tell the colours apart.
- [ ] REQ-STUD12 – As a student I want a review mode with images, definitions and pronunciation.
- [ ] REQ-STUD13 – As a student I want the game to recommend what to practise next after a session.
- [ ] REQ-TEACH1 – As a teacher I want the nouns to come from the course material, so the exercise matches what I teach.
- [ ] REQ-TEACH2 – As a teacher I want to see which nouns and colours a round covers, so I can recommend it at the right point.
