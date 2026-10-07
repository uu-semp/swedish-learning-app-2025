// ==============================================
// Owned by Game 02 — timer
// ==============================================

"use strict";

let startTime = null;
let timerInterval = null;
let elapsedTime = 0;

export function startTimer(onTick) {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    onTick(elapsedTime);
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

export function resetTimer(onReset) {
  stopTimer();
  elapsedTime = 0;
  onReset();
}

export function getElapsedTime() {
  return elapsedTime;
}
