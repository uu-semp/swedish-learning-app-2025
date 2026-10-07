Complete the functionality and code for the existing “Öva” practice mode in the current “Ett år i Uppsala” game.

IMPORTANT:
Do not redesign the existing practice menu.

Keep the current screen and visual design:
- “Vad vill du öva på?”
- Veckodagar
- Månader & datum
- Årstider
- Väder

Keep the current typography, colours, card layout and overall visual style.

The task is to make all four practice cards fully clickable and implement complete playable practice exercises behind each category.

Do not leave placeholders or unfinished routes.

The practice mode should reuse the same visual language, buttons, feedback components and interaction patterns as the main game.

--------------------------------------------------
GENERAL PRACTICE MODE BEHAVIOUR
--------------------------------------------------

When the user clicks one of the four practice cards, open a dedicated practice session for that topic.

Each practice session should:

- contain approximately 5 questions
- randomly mix several question types within that topic
- show progress, for example “2 / 5”
- show a small score
- give immediate feedback
- allow the user to try again after an incorrect answer
- show a “Nästa” button after a correct answer
- end with a small results screen

Results screen example:

“Bra jobbat!”

“4 av 5 rätt”

Buttons:

“Öva igen”
“Välj annat område”
“Till startsidan”

Always include a clear back button.

Do not require the student to complete the main game before using practice mode.

All Swedish language should remain suitable for Basic Swedish 1.

--------------------------------------------------
1. VECKODAGAR
--------------------------------------------------

Clicking “Veckodagar” should open a practice session focused on:

måndag
tisdag
onsdag
torsdag
fredag
lördag
söndag

Use several different exercise types.

EXERCISE A — BEFORE / AFTER

Example:

“Vilken dag kommer efter onsdag?”

Options:
tisdag
torsdag
fredag

Correct:
torsdag

Example:

“Vilken dag kommer före lördag?”

Options:
fredag
söndag
torsdag

Correct:
fredag


EXERCISE B — ORDER THE WEEK

Show all seven days in shuffled order.

Instruction:

“Placera dagarna i rätt ordning.”

The user should be able to click or drag them into:

måndag
tisdag
onsdag
torsdag
fredag
lördag
söndag


EXERCISE C — WEEKLY SCHEDULE

Show a simple weekly planner.

Example sentence:

“Jag studerar svenska på tisdagar och torsdagar.”

Instruction:

“Klicka på rätt dagar.”

The user must select:
tisdag
torsdag

Another example:

“Jag går på nation på fredagar.”

Correct:
fredag


Use the Swedish construction:
“på + weekday”

where appropriate.

--------------------------------------------------
2. MÅNADER & DATUM
--------------------------------------------------

Clicking “Månader & datum” should practise:

januari
februari
mars
april
maj
juni
juli
augusti
september
oktober
november
december

Always write the full month names.

Never use:
JAN
FEB
MAR
etc.

EXERCISE A — BEFORE / AFTER

Example:

“Vilken månad kommer efter april?”

Options:
mars
maj
juni
augusti

Correct:
maj

Example:

“Vilken månad kommer före september?”

Correct:
augusti


EXERCISE B — ORDER MONTHS

Show a smaller group of shuffled months.

Example:

mars
januari
april
februari

Instruction:

“Placera månaderna i rätt ordning.”

Correct:

januari
februari
mars
april


EXERCISE C — CALENDAR DATE

Display a real monthly calendar grid.

Instruction:

“Klicka på den andra februari.”

The user clicks February 2.

Other examples:

“Klicka på den sextonde april.”

“Klicka på den tjugofemte maj.”

Use Swedish ordinal numbers.


EXERCISE D — RECOGNISE A WRITTEN DATE

Show:

“16 april”

Question:

“Hur säger man datumet?”

Options:

“den sextonde april”
“den sexton april”
“sextonde i april”

Correct:

“den sextonde april”


Use beginner-level date structures from Basic Swedish 1.

--------------------------------------------------
3. ÅRSTIDER
--------------------------------------------------

Clicking “Årstider” should practise:

vår
sommar
höst
vinter

It is acceptable to connect seasons to months, especially when using examples that clearly represent the Swedish year.

Use both visual and month-based exercises.

EXERCISE A — MONTH AND SEASON

Use simple course-style questions.

Example:

“I Sverige är det ______ i januari.”

Options:

vår
sommar
höst
vinter

Correct:
vinter

Use these clear examples:

januari → vinter
maj → vår
juli → sommar
oktober → höst


EXERCISE B — VISUAL SEASON

Use a large coloured image placeholder.

For now do NOT require real photographs.

Example:

Blue placeholder:
“Future winter photo of Uppsala”

Question:

“Vilken årstid?”

Options:

vår
sommar
höst
vinter

Correct:
vinter


Create equivalent versions for:
vår
sommar
höst


EXERCISE C — SIMPLE DESCRIPTION

Use only very simple Swedish.

Example:

“Det är kallt och det snöar.”

Question:

“Vilken årstid passar bäst?”

Correct:
vinter

Example:

“Det är varmt och soligt.”

Correct:
sommar

Do not use advanced nature or climate vocabulary.

--------------------------------------------------
4. VÄDER
--------------------------------------------------

Clicking “Väder” should practise these phrases:

“Det regnar.”
“Det snöar.”
“Det blåser.”
“Det åskar och det blixtrar.”
“Det är mulet.”
“Det är soligt.”
“Det är molnigt.”
“Det är varmt.”
“Det är kallt.”
“Solen skiner.”

EXERCISE A — VISUAL WEATHER

Show a large coloured placeholder with a simple weather icon.

Example:

snow icon + blue-grey background

Question:

“Vad är det för väder?”

Options:

“Det snöar.”
“Det regnar.”
“Det är varmt.”
“Det blåser.”

Correct:
“Det snöar.”


EXERCISE B — GRAMMAR

Question:

“Vilken mening är rätt?”

Options:

“Det regnar.”
“Det är regnar.”

Correct:
“Det regnar.”


Another example:

“Det är soligt.”
“Det soligt.”

Correct:
“Det är soligt.”


Use the distinction:

DET + VERB
“Det regnar.”
“Det snöar.”
“Det blåser.”

DET ÄR + ADJECTIVE
“Det är soligt.”
“Det är molnigt.”
“Det är kallt.”
“Det är varmt.”


EXERCISE C — MATCHING

Show 3–4 simple weather icons and 3–4 Swedish weather phrases.

Let the player match each phrase with the corresponding visual.

--------------------------------------------------
FEEDBACK
--------------------------------------------------

Use the existing feedback style consistently.

Correct:

✓
“Rätt!”
“Bra jobbat!”

Button:
“Nästa”

Incorrect:

“Försök igen.”

Highlight the incorrect choice but let the user try again.

Do not reveal the correct answer immediately unless the user has made multiple incorrect attempts.

--------------------------------------------------
DESIGN
--------------------------------------------------

Keep the current practice menu exactly as the visual starting point.

When entering an exercise:

- retain the warm neutral background
- use the existing Outfit / Inter typography
- retain the seasonal colour system
- keep generous spacing
- use large desktop-friendly interaction areas
- maintain the same rounded cards and buttons
- keep the design suitable for university students rather than children

Use the colour of the selected practice card as a subtle accent in that practice session.

For example:

Veckodagar → blue
Månader & datum → green
Årstider → warm yellow
Väder → orange

Do not make major changes to the existing design system.

--------------------------------------------------
TECHNICAL REQUIREMENTS
--------------------------------------------------

Implement all four practice categories as working functionality.

Do not only create visual mockups.

Create the necessary:
- state management
- question data
- answer validation
- scoring
- retry behaviour
- question progression
- results screens
- navigation between practice menu and exercises

Reuse components where possible rather than duplicating code.

Create reusable components for:
- question header
- multiple choice answers
- feedback
- progress indicator
- results screen

Make sure all buttons work.

Make sure users can complete a full practice session in all four categories.

Do not modify or break the existing main “Starta spelet” mode while implementing practice mode.