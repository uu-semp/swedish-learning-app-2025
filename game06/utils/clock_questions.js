/**
 * Question generator for "set the clock" mode
 *
 * File responsibilities:
 * - Generate Swedish phrases for five-minute intervals on a 12-hour clock.
 * - Provide stable target IDs for the existing progress store.
 * - Compare the independently positioned hour and minute hands.
 * - Select five distinct targets without filtering mastered questions.
 */

/** @typedef {import("./question_utils.js").ClockQuestion} ClockQuestion */

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

  return {
    id: `set-clock-${hour}-${minute}`,
    type: "clock",
    hour,
    minute,
    question: swedishTimePhrase(hour, minute),
    answer: `${hour || 12}:${String(minute).padStart(2, "0")}`,
  };
}
/**
 * Build all 144 distinct targets on a 12-hour clock.
 * Each target has a stable ID so replay preserves its saved progress.
 * @returns {ClockQuestion[]}
 */
export function createClockQuestions() {
  // 12 hours * 12 minutes (in intervals of 5)
  const possibleQuestions = 144;
  return Array.from({ length: possibleQuestions }, (_, index) => {
    const hour = Math.floor(index / 12);
    const minute = (index % 12) * 5;
    return createClockQuestion(hour, minute);
  });
}

//#endregion
/* =========================== Answer checking ========================= */
//#region

/**
 * Compare both snapped hands with the numeric target.
 * The hour hand points to the hour number, not between numbers for partial hours.
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
export function createClockRound() {
  const pool = createClockQuestions();
  const round = [];
  for (let index = 0; index < 5; index++) {
    const pick = Math.floor(Math.random() * pool.length);
    round.push(pool.splice(pick, 1)[0]);
  }
  return round;
}
//#endregion
