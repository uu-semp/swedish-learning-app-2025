/**
 * Game 06 - Draggable analog clock component
 *
 * File responsibilities:
 * - Render the clock face and independently positioned hands.
 * - Follow mouse or touch input and snap each hand on release.
 * - Expose the current time and interaction state to the mode controller.
 * - Notify the mode controller through clock-change events.
 */

/** @typedef {"hour"|"minute"} HandName */

/**
 * Snapped positions and interaction state returned to the mode controller.
 * @typedef {Object} ClockTime
 * @property {number} hour Hour number from 0 to 11; 0 represents 12.
 * @property {number} minute Minute from 0 to 55 in steps of five.
 * @property {boolean} moved True after a hand has moved since the last reset.
 * @property {boolean} dragging True while a pointer is captured for a hand.
 */

// ==============================================
// CLOCK ELEMENTS & INTERACTION STATE
// ==============================================

const clock = document.getElementById("setting-clock");
const hands = {
  hour: document.getElementById("setting-hour-hand"),
  minute: document.getElementById("setting-minute-hand"),
};
/** @type {Record<HandName, number>} Clockwise angles in degrees, starting at 12 */
const angles = { hour: 0, minute: 0 };
/** @type {boolean} Whether the player can drag a hand */
let interactive = false;
/** @type {{name: HandName, pointerId: number}|null} Captured hand and pointer */
let drag = null;
/** @type {boolean} Movement since the last question reset */
let moved = false;

// ==============================================
// HAND RENDERING & CLOCK API
// ==============================================

/**
 * Apply the stored angle around the centre of the clock.
 * @param {HandName} name
 * @returns {void}
 */
function renderHand(name) {
  hands[name].style.transform = `rotate(${angles[name] + 90}deg)`;
}

/**
 * Display a target time using independent hand positions.
 * The hour hand points directly to its number regardless of the minute value.
 * @param {number} hour Target hour, interpreted modulo 12.
 * @param {number} minute Target minute.
 * @returns {void}
 */
export function setAnalogTime(hour, minute) {
  angles.hour = (hour % 12) * 30;
  angles.minute = minute * 6;
  renderHand("hour");
  renderHand("minute");
}

/**
 * Announce movement and drag state through a clock-change event.
 * @returns {void}
 */
function notifyChange() {
  clock.dispatchEvent(new CustomEvent("clock-change", {
    detail: { moved, dragging: drag !== null },
  }));
}

/**
 * Snap the captured hand to the nearest 30-degree position and release it.
 * This corresponds to one hour number or one five-minute mark.
 * No-op when no hand is being dragged.
 * @returns {void}
 */
function finishDrag() {
  if (!drag) return;
  const { name, pointerId } = drag;
  angles[name] = (Math.round(angles[name] / 30) * 30) % 360;
  renderHand(name);
  drag = null;
  hands[name].classList.remove("dragging");
  if (hands[name].hasPointerCapture(pointerId)) hands[name].releasePointerCapture(pointerId);
  notifyChange();
}

/**
 * Enable or disable hand dragging, finishing any active drag first.
 * @param {boolean} enabled
 * @returns {void}
 */
export function setInteractive(enabled) {
  finishDrag();
  interactive = enabled;
  clock.classList.toggle("interactive", enabled);
}

/**
 * Reset both hands to 12:00 and enable dragging for a new question.
 * Clears the movement flag so an untouched clock cannot be submitted.
 * @returns {void}
 */
export function resetClock() {
  setInteractive(false);
  moved = false;
  setAnalogTime(0, 0);
  setInteractive(true);
}

/**
 * Read the rounded hand positions without changing their displayed angles.
 * @returns {ClockTime}
 */
export function getClockTime() {
  return {
    hour: Math.round(angles.hour / 30) % 12,
    minute: (Math.round(angles.minute / 30) % 12) * 5,
    moved,
    dragging: drag !== null,
  };
}

// ==============================================
// POINTER MOVEMENT & CAPTURE
// ==============================================

/**
 * Rotate the captured hand towards the pointer without snapping while held.
 * Captured events continue to work when the pointer leaves the clock face.
 * @param {PointerEvent} event
 * @returns {void}
 */
function moveHand(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const bounds = clock.querySelector(".clock-face").getBoundingClientRect();
  const x = event.clientX - (bounds.left + bounds.width / 2);
  const y = event.clientY - (bounds.top + bounds.height / 2);
  if (Math.hypot(x, y) < 5) return; // No useful direction at the pivot.
  const angle = (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360;
  if (Math.abs(angle - angles[drag.name]) > 0.01) {
    angles[drag.name] = angle;
    moved = true;
    renderHand(drag.name);
    notifyChange();
  }
}

// Only one primary pointer controls a hand at a time; cancellation also releases it.
for (const [name, hand] of Object.entries(hands)) {
  hand.addEventListener("pointerdown", (event) => {
    if (!interactive || drag || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    drag = { name, pointerId: event.pointerId };
    hand.setPointerCapture(event.pointerId);
    hand.classList.add("dragging");
    notifyChange();
  });
  hand.addEventListener("pointermove", moveHand);
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    hand.addEventListener(type, (event) => {
      if (drag && event.pointerId === drag.pointerId) finishDrag();
    });
  }
}
window.addEventListener("blur", finishDrag);

// ==============================================
// CLOCK FACE INITIALIZATION
// ==============================================

// Reuse the clock's existing number placement and appearance.
for (let hour = 1; hour <= 12; hour++) {
  const number = document.createElement("div");
  number.className = `number number${hour}`;
  number.textContent = hour;
  clock.querySelector(".clock-face").appendChild(number);
}
