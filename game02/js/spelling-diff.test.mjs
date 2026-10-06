// Run with: node --test game02/js/spelling-diff.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { diffWord } from "./spelling-diff.js";

const render = (r) => r.parts.map((p) => `${p.status}:${p.ch}`).join(" ");

test("exact match is correct", () => {
  const r = diffWord("stol", "stol");
  assert.equal(r.correct, true);
  assert.deepEqual(
    r.parts.map((p) => p.status),
    ["ok", "ok", "ok", "ok"]
  );
});

test("extra letter at start is marked extra, rest ok", () => {
  const r = diffWord("sstol", "stol");
  assert.equal(r.correct, false);
  assert.equal(r.parts.filter((p) => p.status === "extra").length, 1);
  assert.equal(r.parts.filter((p) => p.status === "ok").length, 4);
  assert.equal(r.parts.length, 5);
});

test("missing letter at end gives a gap marker", () => {
  const r = diffWord("sto", "stol");
  assert.equal(r.correct, false);
  assert.deepEqual(r.parts.map((p) => p.status), ["ok", "ok", "ok", "missing"]);
  assert.equal(r.parts[3].ch, "_");
});

test("missing letter in the middle gives a gap marker in place", () => {
  const r = diffWord("stl", "stol");
  assert.deepEqual(r.parts.map((p) => p.status), ["ok", "ok", "missing", "ok"]);
  assert.equal(r.parts[2].ch, "_");
  assert.equal(r.parts[3].ch, "l");
});

test("substitution is marked wrong and keeps the typed letter", () => {
  const r = diffWord("stal", "stol");
  assert.deepEqual(r.parts.map((p) => p.status), ["ok", "ok", "wrong", "ok"]);
  assert.equal(r.parts[2].ch, "a");
});

test("empty input is all missing", () => {
  const r = diffWord("", "stol");
  assert.equal(r.correct, false);
  assert.deepEqual(r.parts.map((p) => p.status), [
    "missing",
    "missing",
    "missing",
    "missing",
  ]);
});

test("ignores case and surrounding whitespace", () => {
  assert.equal(diffWord("  StOl ", "stol").correct, true);
});

test("å/ä/ö are strict", () => {
  assert.equal(diffWord("fatolj", "fåtölj").correct, false);
  const r = diffWord("fatölj", "fåtölj");
  assert.deepEqual(r.parts.map((p) => p.status), [
    "ok",
    "wrong",
    "ok",
    "ok",
    "ok",
    "ok",
  ]);
  assert.equal(diffWord("fåtölj", "fåtölj").correct, true);
});

test("two errors in a longer word", () => {
  const r = diffWord("soffbrd", "soffbord");
  assert.equal(r.parts.filter((p) => p.status === "missing").length, 1);
  assert.equal(r.correct, false);
  const r2 = diffWord("sofbbord", "soffbord");
  assert.equal(r2.parts.filter((p) => p.status === "wrong").length, 1, render(r2));
});

test("never reveals correct letters for wrong/extra marks", () => {
  const r = diffWord("stal", "stol");
  assert.ok(!r.parts.some((p) => p.ch === "o"));
});
