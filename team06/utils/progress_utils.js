/**
 * Progress & Session model
 *
 * Rules:
 * - A question becomes **mastered** after the first correct answer.
 * - Regular sessions exclude mastered questions.
 * - Review modes:
 *    • "review-current": wrong > 0 AND correct == 0 (unsolved mistakes)
 *    • "review-all":     wrong > 0 (historical mistakes, even if later mastered)
 */

/** @typedef {"regular"|"clock"} QuestionType */
/** @typedef {"regular"|"review-current"|"review-all"} SessionMode */

/**
 * Common fields for all questions.
 * @typedef {Object} BaseQuestion
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} question
 * @property {"easy"|"medium"|"hard"|"unspecified"} [difficulty]
 * @property {string} answer
 * @property {string[]} [alternatives]
 * @property {string} [hint]
 * @property {string} [feedback]
 */

/** @typedef {BaseQuestion & { type: "regular" }} RegularQuestion */
/** @typedef {BaseQuestion & { type: "clock", hour: number, minute: number }} ClockQuestion */
/** @typedef {(RegularQuestion|ClockQuestion)} Question */

/**
 * Per-question progress record (stored in localStorage).
 * @typedef {Object} QuestionStatus
 * @property {number} correct   // number of correct attempts
 * @property {number} wrong     // number of wrong attempts
 * @property {number} lastAt    // epoch ms of last attempt
 * @property {boolean} mastered // true after first correct attempt
 */

/**
 * Progress database keyed by question ID.
 * NOTE: this is the in-storage shape (localStorage JSON).
 * @typedef {Object.<string, QuestionStatus>} Database
 */

/**
 * Options for next-question pickers (exclusion set is per-session).
 * @typedef {Object} PickerOptions
 * @property {Set<string>} [excludeIds=null] // questions already seen in the current session
 */

/**
 * Session object returned by createSession.
 * @typedef {Object} SessionObject
 * @property {SessionMode} mode
 * @property {number} size
 * @property {string[]} seenIds      // read-only list of IDs shown this session
 * @property {number} asked          // read-only count of questions served
 * @property {number} remaining      // read-only count (size - asked, floor at 0)
 * @property {function(): (Question|null)} next        // get next eligible question or null
 * @property {function(Question, boolean): QuestionStatus} record // persist result to progress store
 */

/**
 * Key to access data from localStorage.
 * @constant {string}
 */
const LS_KEY = "team06_progress_v1";

/* ========================== Internal helpers ========================== */
//#region

/**
 * Load the progress database from localStorage.
 * Safe: returns an empty object if missing or malformed.
 * @returns {Database}
 */
function _load() {
	try {
		const s = localStorage.getItem(LS_KEY);
		return s ? JSON.parse(s) : {};
	} catch {
		return {};
	}
}

/**
 * Persist the progress database to localStorage.
 * @param {Database} db
 * @returns {void}
 */
function _save(db) {
	localStorage.setItem(LS_KEY, JSON.stringify(db));
}

/**
 * Return a copy of `ids` excluding any that appear in `exclude`.
 * @param {string[]} ids
 * @param {Set<string>|null} exclude
 * @returns {string[]}
 */
function _filterExclude(ids, exclude) {
	if (!exclude || !exclude.size) return ids;
	return ids.filter((id) => !exclude.has(id));
}
//#endregion
/* ========================= Progress recording ========================= */
//#region

/**
 * Initialize progress buckets for the given question IDs (idempotent).
 * Creates `{correct:0, wrong:0, lastAt:0, mastered:false}` for missing IDs.
 * Side effect: may write to localStorage.
 * @param {string[]} questionIds
 * @returns {Database} The updated database snapshot.
 */
export function initProgress(questionIds = []) {
	const db = _load();
	let changed = false;
	for (const id of questionIds) {
		if (!db[id]) {
			db[id] = { correct: 0, wrong: 0, lastAt: 0, mastered: false };
			changed = true;
		}
	}
	if (changed) _save(db);
	return db;
}

/**
 * Get the stored status for one question.
 * Returns a zeroed status if the question has no record yet.
 * @param {string} id
 * @returns {QuestionStatus}
 */
export function getStatus(id) {
	const db = _load();
	return db[id] || { correct: 0, wrong: 0, lastAt: 0, mastered: false };
}

/**
 * Record the outcome of an attempt.
 * - When `wasCorrect === true`, increments `correct` and sets `mastered = true`.
 * - When `wasCorrect === false`, increments `wrong` (mastered remains unchanged).
 * - Always updates `lastAt` to `Date.now()`.
 * Side effect: writes to localStorage.
 * @param {string} id
 * @param {boolean} wasCorrect
 * @returns {QuestionStatus} The updated status for this question.
 */
export function recordResult(id, wasCorrect) {
	const db = _load();
	if (!db[id]) db[id] = { correct: 0, wrong: 0, lastAt: 0, mastered: false };
	if (wasCorrect) {
		db[id].correct += 1;
		db[id].mastered = true;
	} else {
		db[id].wrong += 1;
	}
	db[id].lastAt = Date.now();
	_save(db);
	return db[id];
}

/**
 * Reset a single question's progress back to zeroed state.
 * No-op if the ID does not exist.
 * Side effect: writes to localStorage.
 * @param {string} id
 * @returns {void}
 */
export function resetQuestion(id) {
	const db = _load();
	if (db[id]) {
		db[id] = { correct: 0, wrong: 0, lastAt: 0, mastered: false };
		_save(db);
	}
}

/**
 * Clear all stored progress.
 * Side effect: removes the localStorage entry for the progress DB.
 * @returns {void}
 */
export function resetAll() {
	localStorage.removeItem(LS_KEY);
}
//#endregion
/* ========================= Question selectors ========================= */
//#region

/**
 * IDs that are NOT mastered (i.e., never answered correctly).
 * @param {string[]} questionIds
 * @returns {string[]}
 */
export function unmasteredIds(questionIds) {
	const db = _load();
	return questionIds.filter((id) => !db[id]?.mastered);
}

/**
 * IDs with at least one wrong and zero correct (unsolved mistakes).
 * @param {string[]} questionIds
 * @returns {string[]}
 */
export function currentMistakeIds(questionIds) {
	const db = _load();
	return questionIds.filter(
		(id) => db[id]?.wrong > 0 && db[id]?.correct === 0
	);
}

/**
 * IDs with at least one wrong (historical mistakes), regardless of later success.
 * @param {string[]} questionIds
 * @returns {string[]}
 */
export function allMistakeIds(questionIds) {
	const db = _load();
	return questionIds.filter((id) => db[id]?.wrong > 0);
}

/**
 * Pick a random element or `null` if empty.
 * @template T
 * @param {T[]} arr
 * @returns {T|null}
 */
function randPick(arr) {
	if (!arr.length) return null;
	return arr[Math.floor(Math.random() * arr.length)];
}
//#endregion
/* ======================== Next-question pickers======================== */
//#region

/**
 * Pick the next question for a **regular** session.
 * Chooses uniformly at random from questions that are:
 *   (1) not mastered, and
 *   (2) not present in `excludeIds` (already seen this session).
 * Pure w.r.t. progress: reads mastery state, does not mutate it.
 *
 * @param {Question[]} questions - Pre-filtered pool (e.g., only "easy").
 * @param {PickerOptions} [options]
 * @returns {Question|null} A question or `null` if no eligible items remain.
 *
 * @example
 * const seen = new Set();
 * let q = nextRegular(easyQs, { excludeIds: seen });
 * while (q) {
 *   seen.add(q.id);
 *   // ...ask & grade...
 *   q = nextRegular(easyQs, { excludeIds: seen });
 * }
 */
export function nextRegular(questions, { excludeIds = null } = {}) {
	const ids = questions.map((q) => q.id);
	const poolIds = _filterExclude(unmasteredIds(ids), excludeIds);
	const id = randPick(poolIds);
	if (!id) return null;
	const map = new Map(questions.map((q) => [q.id, q]));
	return map.get(id) || null;
}

/**
 * Pick the next question for **review-current** mode
 * (unsolved mistakes only: wrong > 0 && correct == 0),
 * excluding any in `excludeIds`.
 *
 * @param {Question[]} questions
 * @param {PickerOptions} [options]
 * @returns {Question|null}
 */
export function nextReviewCurrent(questions, { excludeIds = null } = {}) {
	const ids = questions.map((q) => q.id);
	const poolIds = _filterExclude(currentMistakeIds(ids), excludeIds);
	const id = randPick(poolIds);
	if (!id) return null;
	const map = new Map(questions.map((q) => [q.id, q]));
	return map.get(id) || null;
}

/**
 * Pick the next question for **review-all** mode
 * (any historical mistake: wrong > 0), excluding any in `excludeIds`.
 *
 * @param {Question[]} questions
 * @param {PickerOptions} [options]
 * @returns {Question|null}
 */
export function nextReviewAll(questions, { excludeIds = null } = {}) {
	const ids = questions.map((q) => q.id);
	const poolIds = _filterExclude(allMistakeIds(ids), excludeIds);
	const id = randPick(poolIds);
	if (!id) return null;
	const map = new Map(questions.map((q) => [q.id, q]));
	return map.get(id) || null;
}
//#endregion
/* =========================== Session manager ========================== */
//#region

/**
 * Create a session that serves up to `size` **distinct** questions with NO repeats.
 * Eligibility per `mode`:
 *  - "regular":        not mastered
 *  - "review-current": wrong > 0 && correct == 0
 *  - "review-all":     wrong > 0
 *
 * Selection is uniform random among eligible items, minus those already seen in
 * this session. Each call to `next()` marks the returned question as seen.
 * The session is exhausted when either `size` items have been served or there
 * are no more eligible questions.
 *
 * @param {Question[]} questions - The working pool (e.g., only "easy" items).
 * @param {{ mode?: SessionMode, size?: number }} [options]
 * @returns {SessionObject}
 *
 * @example
 * const session = createSession(easyQs, { mode: "regular", size: 5 });
 * let q = session.next();
 * while (q) {
 *   // ...render q, collect answer...
 *   session.record(q, /* wasCorrect *-/ true);
 *   q = session.next();
 * }
 * console.log(session.seenIds); // IDs served in this run
 */
export function createSession(questions, { mode = "regular", size = 5 } = {}) {
	const seen = new Set();
	let asked = 0;

	function pickNext() {
		const opts = { excludeIds: seen };
		if (mode === "review-current")
			return nextReviewCurrent(questions, opts);
		if (mode === "review-all") return nextReviewAll(questions, opts);
		return nextRegular(questions, opts);
	}

	return {
		mode,
		size,
		get seenIds() {
			return Array.from(seen);
		},
		get asked() {
			return asked;
		},
		get remaining() {
			return Math.max(0, size - asked);
		},

		/** Returns a question or null if session is exhausted (no eligible left or reached size) */
		next() {
			if (asked >= size) return null;
            const q = pickNext();
            if (!q) return null; // no eligible left
            seen.add(q.id); // mark as seen immediately, never repeat in this session
            asked += 1;
            return q;
		},

        /** Record the result into progress store */
        record(q, wasCorrect) {
            return recordResult(q.id, wasCorrect);
        }
	};
}

//#endregion
