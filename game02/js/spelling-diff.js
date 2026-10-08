// ==============================================
// Owned by Game 02 — letter-level spelling feedback
// ==============================================

"use strict";

/**
 * Aligns the typed word with the answer (Levenshtein with backtrace) and
 * labels every position. Never exposes the correct letter for a mistake:
 * "wrong"/"extra" carry the typed char, "missing" carries "_".
 *
 * @param {string} typed
 * @param {string} answer
 * @returns {{correct: boolean, parts: Array<{ch: string, status: "ok"|"wrong"|"extra"|"missing"}>}}
 */
export function diffWord(typed, answer) {
  const shown = Array.from(typed.trim());
  const a = shown.map((c) => c.toLowerCase());
  const b = Array.from(answer.trim().toLowerCase());

  // d[i][j] = edit distance between a[0..i) and b[0..j)
  const d = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= b.length; j++) d[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const sub = d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      d[i][j] = Math.min(sub, d[i][j - 1] + 1, d[i - 1][j] + 1);
    }
  }

  // Backtrace from the end. Tie-break: match/substitution, then missing, then extra.
  const parts = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && d[i][j] === d[i - 1][j - 1]) {
      parts.push({ ch: shown[i - 1], status: "ok" });
      i--;
      j--;
    } else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) {
      parts.push({ ch: shown[i - 1], status: "wrong" });
      i--;
      j--;
    } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
      parts.push({ ch: "_", status: "missing" });
      j--;
    } else {
      parts.push({ ch: shown[i - 1], status: "extra" });
      i--;
    }
  }
  parts.reverse();

  return { correct: d[a.length][b.length] === 0, parts };
}

/**
 * Returns the typed text with the first mistake fixed: a missing letter is
 * inserted, a wrong letter is replaced and stray extra letters are dropped.
 * Everything else the player typed is kept. Spaces in the answer are carried
 * along with the letter after them.
 *
 * @param {string} typed
 * @param {string} answer
 * @returns {string}
 */
export function hintWord(typed, answer) {
  const want = Array.from(answer.trim());
  const { parts } = diffWord(typed, answer);
  const out = [];
  let j = 0; // position in the answer
  let done = false; // a real letter has been revealed
  for (const part of parts) {
    if (part.status === "extra") {
      if (done) out.push(part.ch);
      continue;
    }
    if (part.status === "ok") {
      out.push(part.ch);
    } else if (!done) {
      out.push(want[j]);
      done = want[j] !== " ";
    } else if (part.status === "wrong") {
      out.push(part.ch);
    }
    j++;
  }
  return out.join("");
}
