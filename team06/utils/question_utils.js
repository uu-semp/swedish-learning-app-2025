/**
 * Question Dataset & Loader model
 *
 * File responsibilities:
 * - Load a dataset file (JSON) with modules grouped by difficulty.
 * - Normalize questions into an in-memory cache with quick selectors.
 * - Provide helpers for clock questions and easy (MCQ) answer checking.
 *
 * Schema (on-disk / dataset):
 *   Root:   { name: string, modules: Module[] }
 *   Module: { difficulty: Difficulty, questions: Question[] }
 *   Question (discriminated union):
 *     - Regular: { type:"regular", id, question, answer, alternatives[], hint?, feedback? }
 *     - Clock:   { type:"clock",   id, question, hour:int, minute:int, answer, alternatives[], hint?, feedback? }
 *
 * Normalization (in-memory):
 * - Each question gets a `difficulty` copied from its module for simple filtering.
 * - `hour` and `minute` exist only for `type:"clock"`.
 */

/** @typedef {"easy"|"medium"|"hard"|"unspecified"} Difficulty */
/** @typedef {"regular"|"clock"} QuestionType */

/**
 * Common fields shared by all questions.
 * @typedef {Object} BaseQuestion
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} question
 * @property {string} answer
 * @property {string[]} [alternatives]
 * @property {string} [hint]
 * @property {string} [feedback]
 * @property {Difficulty} [difficulty]  // injected during load
 */

/** @typedef {BaseQuestion & { type: "regular" }} RegularQuestion */
/** @typedef {BaseQuestion & { type: "clock", hour: number, minute: number }} ClockQuestion */
/** @typedef {(RegularQuestion|ClockQuestion)} Question */

/**
 * Module as stored in the dataset file.
 * @typedef {Object} DatasetModule
 * @property {Difficulty} difficulty
 * @property {Question[]} questions
 */

/**
 * Root of the dataset file.
 * @typedef {Object} DatasetRoot
 * @property {string} name
 * @property {DatasetModule[]} modules
 */

/**
 * In-memory cache shape.
 * @typedef {Object} CacheState
 * @property {Record<string, Question>} byId
 * @property {string[]} order
 * @property {boolean} loaded
 * @property {{name: string}} meta
 */

/**
 * Local overrides (from localStorage) that can add/replace questions.
 * @typedef {Object} OverridesState
 * @property {Record<string, Question>} byId
 * @property {string[]} order
 */

/**
 * Result returned by MCQ checker.
 * @typedef {Object} EasyCheckResult
 * @property {boolean} correct
 * @property {string} expected
 * @property {string} given
 * @property {string} message
 */

/** Storage key for shipping dataset (if used elsewhere) */
const STORAGE_KEY = "team06_questions";

/** Storage key for local overrides (dev edits) */
const LS_KEY = "team06_questions_overrides_v1";


/** @type {CacheState} */
let CACHE = {
	byId: {},
	order: [],
	loaded: false,
	meta: { name: "" },
};

/* =========================== internal helpers =========================== */
//#region

/** @param {unknown} x @returns {x is string} */
function isStr(x) {
	return typeof x === "string";
}

/** @param {unknown} x @returns {x is number} */
function isInt(x) {
	return Number.isInteger(x);
}

/**
 * Create a unique-ish ID for a new question.
 * @param {string} [prefix="t06-q"]
 * @returns {string}
 */
function makeId(prefix = "t06-q") {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

/**
 * Validate basic dataset root shape (throws on error).
 * @param {DatasetRoot} json
 * @returns {void}
 * @throws {Error} if the root is malformed
 */
function validateAndNormalizeRoot(json) {
	if (!json || typeof json !== "object")
		throw new Error("Root must be an object");
	if (!isStr(json.name)) throw new Error("name must be a string");
	if (!Array.isArray(json.modules)) throw new Error("modules must be array");
}

/**
 * Validate and normalize a single question.
 * - Injects a generated `id` when missing.
 * - Ensures clock questions have valid `hour`/`minute`.
 * - Ensures text questions have non-empty `question`.
 *
 * @param {Partial<Question> & Record<string, any>} raw
 * @returns {Question}
 * @throws {Error} if invalid
 */
function validateQuestion(raw) {
	const type = raw.type == "clock" ? "clock" : "regular";
	const id = isStr(raw.id) ? raw.id : makeId(type);
	const base = {
		id,
		type,
		question: raw.question ?? (type === "clock" ? "Vad är klockan?" : ""),
		answer: raw.answer ?? "",
		alternatives: Array.isArray(raw.alternatives) ? raw.alternatives : [],
		hint: raw.hint ?? "",
		feedback: raw.feedback ?? "",
		difficulty: raw.difficulty ?? raw.module ?? "unspecified",
	};

	if (type === "clock") {
		if (!isInt(raw.hour) || raw.hour < 0 || raw.hour > 23)
			throw new Error(`Invalid hour for ${id}`);
		if (!isInt(raw.minute) || raw.minute < 0 || raw.minute > 59)
			throw new Error(`Invalid minutes for ${id}`);
		return { ...base, hour: raw.hour, minute: raw.minute };
	}

	if (!isStr(base.question) || !base.question.trim()) {
		throw new Error(`Question text required for ${id}`);
	}

	return base;
}

/**
 * Build the in-memory cache from the dataset file.
 * Copies module `difficulty` onto each question.
 *
 * @param {DatasetRoot} json
 * @returns {{ byId: Record<string, Question>, order: string[], meta: { name: string } }}
 */
function stateFromDataset(json) {
	const byId = {};
	const order = [];

	for (const mod of json.modules) {
		const diff = mod.difficulty || "unspecified";
		const arr = Array.isArray(mod.questions) ? mod.questions : [];
		for (const raw of arr) {
			const q = validateQuestion({ ...raw, difficulty: diff });
			if (!byId[q.id]) order.push(q.id);
			byId[q.id] = q;
		}
	}

	return { byId, order, meta: { name: json.name } };
}

/**
 * Load local overrides for questions (dev edits).
 * @returns {OverridesState}
 */
function loadOverrides() {
	try {
		const s = localStorage.getItem(LS_KEY);
		if (!s) return { byId: {}, order: [] };
		const parsed = JSON.parse(s);
		if (!parsed || typeof parsed !== "object")
			return { byId: {}, order: [] };
		return parsed;
	} catch {
		return { byId: {}, order: [] };
	}
}

/**
 * Persist local overrides.
 * @param {OverridesState} over
 * @returns {void}
 */
function saveOverrides(over) {
    localStorage.setItem(LS_KEY, JSON.stringify(over));
}
//#endregion
/* ============================= public API ============================ */
//#region

/**
 * Initialize questions from a dataset URL, merge with local overrides,
 * and populate the in-memory cache. Overrides win on conflicts.
 *
 * @param {string} [datasetUrl="./data/questions.json"]
 * @returns {Promise<Question[]>} All questions in normalized order.
 * @throws {Error} on fetch/parse/validation errors
 */
export async function initQuestions(datasetUrl = "../data/questions.json") {
    const res = await fetch(datasetUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${datasetUrl}`);
    const json = await res.json();

    validateAndNormalizeRoot(json);
    const base = stateFromDataset(json);

    // merge overrids (local edits win)
    const over = loadOverrides();
    const byId = { ...base.byId, ...over.byId };

    const order = [...base.order, ...over.order.filter(id => !base.byId[id])];

    CACHE = { byId, order, loaded: true, meta: base.meta };
    return getAll();
}

/**
 * Get all loaded questions in stable order.
 * @returns {Question[]}
 * @throws {Error} if `initQuestions()` has not run yet
 */
export function getAll() {
    if (!CACHE.loaded) throw new Error("initQuestions() not called");
    return CACHE.order.map(id => CACHE.byId[id]);
}

/**
 * Get a specific question by ID (or `null` if not found).
 * @param {string} id
 * @returns {Question|null}
 */
export function getById(id) {
    return CACHE.byId[id] || null;
}

/**
 * Filter questions by difficulty.
 * @param {Difficulty} diff
 * @returns {Question[]}
 */
export function byDifficulty(diff) {
    return getAll().filter(q => (q.difficulty || "unspecified") === diff);
}

/**
 * Filter questions by discriminated type ("regular" | "clock").
 * @param {QuestionType} type
 * @returns {Question[]}
 */
export function byType(type) {
    return getAll().filter(q => q.type === type);
}

/**
 * Pick a random question from the loaded set,
 * optionally constrained by `type` and/or `difficulty`.
 *
 * @param {{ type?: QuestionType|null, difficulty?: Difficulty|null }} [opts]
 * @returns {Question|null}
 */
export function getRandom ({ type=null, difficulty=null } = {})  {
    let list = getAll();
    if (type) list = list.filter(q => q.type === type);
    if (difficulty) list = list.filter(q => q.difficulty === difficulty);
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
}
//#endregion
/* =========================== Clock helpers =========================== */
//#region

/**
 * Type guard for clock questions.
 * @param {Question|undefined|null} q
 * @returns {q is ClockQuestion}
 */
export function isClock(q) { return q?.type === "clock"; }

/**
 * Normalize/clip time fields to valid ranges.
 * @param {ClockQuestion} q
 * @returns {{hour: number, minute: number}}
 */

export function clampTime(q) {
    if (!isClock(q)) return null;
    const hour = Math.max(0, Math.min(23, q.hour|0));
    const minute = Math.max(0, Math.min(59, q.minute|0));
    return { hour, minute };
}
//#endregion
/* ====================== Multiple Choice helpers ====================== */
//#region

/**
 * Build the choice list for easy/MCQ questions.
 * The first element is always the correct answer (before shuffling in UI).
 *
 * @param {Question} q
 * @returns {string[]}
 */
export function choicesForEasy(q) {
    const alt = Array.isArray(q.alternatives) ? q.alternatives : []; 
    return [q.answer, ...alt];
}

/** @param {unknown} s @returns {string} */
function norm(s) {
    return String(s ?? "").trim();
}

/**
 * Check an MCQ answer by value (whitespace-trimmed, case-sensitive).
 * @param {Question} q
 * @param {string} userValue
 * @returns {EasyCheckResult}
 */
export function checkAnswerEasy(q, userValue) {
    const correct = norm(userValue) === norm(q.answer);
    return {
        correct,
        expected: q.answer,
        given: userValue,
        message: correct ? "Correct!" : (q.feedback || "Incorrect.")
    };
}

/**
 * Check an MCQ answer when the UI supplies an index into a displayed list.
 * @param {Question} q
 * @param {string[]} displayedChoices
 * @param {number} selectedIndex
 * @returns {EasyCheckResult}
 */
export function checkAnswerEasyFromIndex(q, displayedChoices, selectedIndex) {
    const selected = displayedChoices?.[selectedIndex];
    return checkAnswerEasy(q, selected);
}
//#endregion
