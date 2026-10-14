# Game 06 bug review

Reviewed on 2026-10-14 against commit `5145376`. The requested `game6/` directory is named `game06/` in this repository.

Scope: the game controllers, question generation and loading, progress/session handling, clock components, markup, styles, and the shared save API used by this game. This review documents issues; it does not change game behavior.

Validation: source inspection plus focused Node executions of the actual question/progress modules with the actual shared save API and an in-memory localStorage substitute. The deadline check executed the actual submission controller in a minimal DOM stub. These are not end-to-end browser tests; pointer behavior, visual layout, and browser event scheduling were not verified.

Priority: P2 = normal functional defect; P3 = lower-impact or exceptional-state defect.

## 1. P2 — Duplicate practice targets cause a round to end early

**Location:** `utils/progress_utils.js:195–214`, `utils/clock_questions.js:164`, `utils/progress_utils.js:388–438`, `index.js:315–324`.

The replacement selector compares queued question IDs against candidate IDs before converting the candidate into an Easy or Advanced question. Candidates have IDs such as `set-clock-0-0`; queued Easy replacements have IDs such as `mcq-clock-0-0`. Consequently, the existing-ID check does not exclude an already queued target. Multiple mistakes can enqueue the same final ID.

The practice session excludes questions by ID, but advertises a size equal to the array length. Duplicate entries therefore count toward the displayed total while only one can be served. The summary appears before the advertised number of questions is reached.

**Reproduction:** record incorrect Easy answers for 1:00 and 2:00 while controlling random selection to choose the first eligible replacement. Both enqueue `mcq-clock-0-0`. Create a practice session from that queue with size 2. Its first `next()` returns that question; its second returns `null`.

**Observed:** queue IDs `["mcq-clock-0-0", "mcq-clock-0-0"]`, session size `2`, only one question served. Reproduced using the real modules. Random selection was fixed to expose a collision deterministically; normal random selection can also collide.

**Suggested correction:** exclude candidates by a normalized time/difficulty identity or by the final converted ID, and deduplicate the practice pool before setting its size.

## 2. P2 — Intermediate mistakes have no failed-question practice route

**Location:** `clock_mode.js:43–54`, `clock_mode.js:147–155`, `clock_mode.js:175–195`, `utils/progress_utils.js:202–205`.

Intermediate records mistakes through the shared session API, which adds replacement questions to `replay_collection`. Its separate summary offers only **Play Again** and **Back to Levels**. The **Train on failed questions** control belongs to the Easy/Advanced summary and is never exposed here. Returning to levels clears the collection in `index.js:93–99`.

There is also a mode mismatch: generated Intermediate questions have no `difficulty`, so their failed-attempt replacements default to `easy` and become multiple-choice questions rather than draggable-clock questions.

**Reproduction:** finish an Intermediate round with at least one wrong answer. Inspect its summary: there is no failed-question practice action. Play Again starts a fresh full-pool round; returning to levels discards the pending replacements.

**Validation:** confirmed by following the markup, event handlers, and replacement-generation branches; not browser-tested.

**Suggested correction:** provide an Intermediate practice action backed by its controller and give its questions an explicit mode/difficulty so replacements preserve the exercise type.

## 3. P2 — Advanced accepts answers submitted after the time limit

**Location:** `index.js:128–143`, `index.js:723–749`.

Expiry is enforced only by the 250 ms interval callback. `submitAnswer()` checks `answerSubmitted`, but never checks `questionDeadline`. If a submission handler runs after the deadline and before the expiry callback, it cancels the timer and can award points for the late answer.

**Reproduction:** prepare a correct filled tile answer, set a deadline of 30,000 ms, and run submission at 31,000 ms before the expiry callback has executed.

**Observed:** the controller recorded `correct: true` and awarded 10 points. Reproduced with the actual controller in a DOM stub. This establishes the missing deadline guard; the size of the timing window in a real browser depends on event scheduling and timer delays.

**Suggested correction:** check `Date.now() >= questionDeadline` at submission and route an expired question through the timeout handler before grading.

## 4. P2 — Play Again retains failures from earlier rounds

**Location:** `index.js:304–306`, `index.js:629–659`, `index.js:275–285`, `clock_mode.js:124–136`.

Starting a new round resets the score and creates a new session, but does not reset `replay_collection`. Only returning to level selection clears it. The regular summary decides whether to display **Train on failed questions** solely from this shared collection.

**Reproduction:** finish an Easy round with a mistake, select Play Again, then finish the next round with all answers correct. Unless the second round happens to answer the queued replacement ID, the practice button remains visible and includes a target from the earlier round.

**Impact:** the failures offered by the summary can belong to previous rounds rather than the round whose score is shown. Repeated Play Again actions can accumulate pending targets, including duplicate entries from issue 1.

**Validation:** confirmed by source inspection of initialization, queue mutation, and summary display.

**Suggested correction:** define the intended lifetime of failed practice. For round-specific practice, clear the queue when a fresh round starts, while retaining saved attempt history. If cross-round practice is intentional, explicitly label it as accumulated practice and deduplicate it.

## 5. P3 — Two Advanced targets use different progress IDs in normal and practice pools

**Location:** `utils/clock_questions.js:123–139`, `utils/progress_utils.js:206–209`, `data/questions.json` hard module.

Normal Advanced rounds preserve the dataset IDs for 7:30 (`hard-blocks-001`) and 7:45 (`hard-blocks-002`). Failed-question replacements build the Advanced pool without passing the dataset questions, yielding `hard-blocks-7-30` and `hard-blocks-7-45` for those same targets.

**Reproduction:** compare `createAdvancedModeQuestions(datasetHardQuestions)` with `createAdvancedModeQuestions()` for 7:30 and 7:45. Then record results for the corresponding questions through the progress API.

**Observed:** the 7:30 normal ID is `hard-blocks-001`, while the replacement-pool ID is `hard-blocks-7-30`. The same mismatch exists for 7:45. Reproduced using the real generator and current dataset.

**Impact:** attempts/mastery for the same target are split across records. Practicing one identity does not update the normal pool's identity, and ID-based queue removal can leave the equivalent practice target pending. Current main rounds use practice mode, so this does not presently prevent a target from appearing in ordinary play.

**Suggested correction:** use the same canonical Advanced pool for normal and replacement selection, or normalize IDs consistently with a migration for existing progress.

## 6. P3 — Valid JSON with an invalid saved-data shape can prevent play

**Location:** `utils/progress_utils.js:92–100`, `utils/progress_utils.js:134–143`, `utils/progress_utils.js:178–184`.

`_load()` claims to handle malformed storage, but returns any truthy value from `window.save.get()` without checking its shape. The shared API catches JSON syntax errors, but valid JSON such as a string or a database containing invalid per-question records reaches the progress logic unchanged.

**Reproduction:** set localStorage key `game06` to the JSON string `"corrupt"`, then start a game or call `initProgress(['test'])`.

**Observed:** `Cannot create property 'test' on string 'corrupt'`. Reproduced with the actual progress module and shared save API. `initProgress()` runs before the game view is opened, so this failure blocks starting a round. Invalid per-question records can also fail during result recording.

**Suggested correction:** validate that the loaded database is a non-null, non-array object and normalize or discard invalid question-status records before using them.

## Recommended order

Fix replacement identity/deduplication first, because it affects the integrity and length of practice sessions. Then address Intermediate practice and the deadline guard. Decide the intended queue lifetime before changing restart behavior. Finally, unify Advanced IDs and harden saved-data validation.
