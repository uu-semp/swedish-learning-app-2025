/**
 * Question generator for "set the clock" mode
 *
 * File responsibilities:
 * - Generate Swedish phrases for five-minute intervals on a 12-hour clock.
 * - Provide stable target IDs for the existing progress store.
 * - Compare the snapped clock time with the numeric target.
 * - Select five distinct targets without filtering mastered questions.
 */

/** @typedef {import("./question_utils.js").ClockQuestion} ClockQuestion */

const TAG_MINUTES = new Map([
  ["quarter_hour", [15, 45]],
  ["half_hour", [30]],
  ["whole_hour", [0]],
  ["all_times", Array.from({ length: 12 }, (_, index) => index * 5)],
]);

/** Swedish hour names indexed by hour modulo 12. */
const HOURS = ["tolv", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva"];

/**
 * Generate a Swedish phrase for a time at a five-minute interval.
 * @param {number} hour Integer hour from 0 to 23, interpreted modulo 12.
 * @param {number} minute Integer minute from 0 to 60 (exclusive) in steps of five.
 * @returns {string} Complete phrase beginning with "Klockan är".
 * @throws {RangeError} If the time is invalid or not a five-minute interval.
 */
export function swedishTimePhrase(hour, minute) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23 ||
      !Number.isInteger(minute) || minute < 0 || minute > 55 || minute % 5 !== 0) {
    throw new RangeError("Time must use a valid hour and a five-minute interval.");
  }
  const current = HOURS[hour % 12];
  const next = HOURS[(hour + 1) % 12];
  const expressions = {
    0: current,
    5: `fem över ${current}`,
    10: `tio över ${current}`,
    15: `kvart över ${current}`,
    20: `tjugo över ${current}`,
    25: `fem i halv ${next}`,
    30: `halv ${next}`,
    35: `fem över halv ${next}`,
    40: `tjugo i ${next}`,
    45: `kvart i ${next}`,
    50: `tio i ${next}`,
    55: `fem i ${next}`,
  };
  return `Klockan är ${expressions[minute]}.`;
}

//#endregion
/* ========================= Question generation ======================= */
//#region

/**
 * Build one target on a 12-hour clock
 * @param hour
 * @param minute
 * @returns {ClockQuestion}
 */
export function createClockQuestion(hour, minute) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 12 ||
      !Number.isInteger(minute) || minute < 0 || minute > 55 || minute % 5 !== 0) {
    throw new RangeError("Time must use a valid hour [0-12] and a five-minute interval [0-55].");
  }

  const tags = new Set();
  for (const [tag, minutes] of TAG_MINUTES) {
    if (minutes.includes(minute)) tags.add(tag);
  }

  return {
    id: `set-clock-${hour}-${minute}`,
    type: "clock",
    hour,
    minute,
    tags,
    question: swedishTimePhrase(hour, minute),
    answer: `${hour || 12}:${String(minute).padStart(2, "0")}`,
  };
}
/**
 * Build distinct targets on a 12-hour clock, optionally filtered by tags.
 * Each target has a stable ID so replay preserves its saved progress.
 * @returns {ClockQuestion[]}
 */
export function createClockQuestions(tags = new Set()) {
  if (!(tags instanceof Set)) {
    throw new TypeError("Clock question tags must be a Set.");
  }
  const minutes = new Set();
  for (const tag of tags) {
    if (!TAG_MINUTES.has(tag)) {
      throw new RangeError(`Unknown clock question tag: ${String(tag)}`);
    }
    for (const minute of TAG_MINUTES.get(tag)) minutes.add(minute);
  }
  if (tags.size === 0) {
    for (const minute of TAG_MINUTES.get("all_times")) minutes.add(minute);
  }

  // 12 hours * 12 minutes (in intervals of 5)
  const possibleQuestions = 144;
  return Array.from({ length: possibleQuestions }, (_, index) => {
    const hour = Math.floor(index / 12);
    const minute = (index % 12) * 5;
    return createClockQuestion(hour, minute);
  }).filter((question) => minutes.has(question.minute));
}

/** The narrowest supported time class containing this question's minute. */
export function clockQuestionClass(question) {
  for (const [tag, minutes] of TAG_MINUTES) {
    if (minutes.includes(question.minute)) return tag;
  }
  throw new RangeError("Clock questions must use a five-minute interval.");
}

/** Build the Advanced tile pool, preserving IDs and tiles of existing questions. */
export function createAdvancedModeQuestions(existingQuestions = []) {
  const existing = new Map(existingQuestions.map((q) => [`${q.hour % 12}-${q.minute}`, q]));
  return createClockQuestions().map((target) => {
    const previous = existing.get(`${target.hour}-${target.minute}`);
    if (previous) return { ...previous, tags: target.tags };

    const answer = target.question.slice(0, -1);
    const answerTiles = ["Klockan är", ...answer.slice("Klockan är ".length).split(" ")];
    const tiles = [...answerTiles];
    const distractors = ["i", "över", "kvart", "halv", "fem", "tio", "tjugo",
      HOURS[target.hour], HOURS[(target.hour + 1) % 12]];
    for (const word of distractors) {
      if (!tiles.includes(word)) tiles.push(word);
    }
    return {
      ...target,
      id: `hard-blocks-${target.hour}-${target.minute}`,
      difficulty: "hard",
      question: "Vad är klockan?",
      answer,
      tiles,
      answerTiles,
    };
  });
}

/**
 * Generates an MCQ clock question with 3 distractors.
 */
export function createMcqClockQuestion(hour, minute, difficulty) {
  const answer = swedishTimePhrase(hour, minute);

  // Wrong choices use the same most-specific time class as the target.
  const tag = clockQuestionClass({ minute });
  const pool = createClockQuestions(new Set([tag])).filter((q) => q.question !== answer);
  const alternatives = [];
  for (let index = 0; index < 3; index++) {
    const pick = Math.floor(Math.random() * pool.length);
    alternatives.push(pool.splice(pick, 1)[0].question);
  }
  return {
    id: `mcq-clock-${hour}-${minute}`,
    type: "clock",
    difficulty,
    question: "Hur mycket är klockan?",
    hour,
    minute,
    answer,
    tags: new Set([tag, "all_times"]),
    alternatives,
    feedback: "Good try, mistakes are how you learn!"
  };
}
/**
 * Generates distinct MCQ questions covering all five-minute times.
 */
export function createStandardModeQuestions(difficulty, count = 5) {
  const pool = createClockQuestions();
  const questions = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const pick = Math.floor(Math.random() * pool.length);
    const target = pool.splice(pick, 1)[0];
    questions.push(createMcqClockQuestion(target.hour, target.minute, difficulty));
  }
  return questions;
}

//#endregion
/* =========================== Answer checking ========================= */
//#region

/**
 * Compare the snapped time with the numeric target.
 * The clock component adjusts the hour-hand position for the selected minutes.
 * @param {ClockQuestion} question
 * @param {Pick<ClockQuestion, "hour"|"minute">} time
 * @returns {boolean} True only when both hand positions match.
 */
export function checkClockAnswer(question, time) {
  return time.hour === question.hour % 12 && time.minute === question.minute;
}

//#endregion
/* =========================== Round selection ========================= */
//#region

/**
 * Select five distinct random targets for a fresh round.
 * Pure with respect to progress: mastered targets remain eligible.
 * @returns {ClockQuestion[]} Five questions with no repeated IDs.
 */
export function createClockRound(tags = new Set()) {
  const pool = createClockQuestions(tags);
  const round = [];
  for (let index = 0; index < 5; index++) {
    const pick = Math.floor(Math.random() * pool.length);
    round.push(pool.splice(pick, 1)[0]);
  }
  return round;
}
//#endregion
