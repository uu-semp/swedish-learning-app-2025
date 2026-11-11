/**
 * Game 06 - Draggable analog clock component
 *
 * File responsibilities:
 * - Render clock hands with the hour position adjusted for the selected minutes.
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
/** Last snapped time, separate from the pointer's temporary hand angle. */
const time = { hour: 0, minute: 0 };
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
  const value = name === "hour" ? time.hour || 12 : time.minute;
  hands[name].setAttribute("aria-valuenow", String(value));
  hands[name].setAttribute("aria-valuetext", name === "hour"
    ? `${time.hour || 12}:${String(time.minute).padStart(2, "0")}`
    : `${value} minutes`);
}

/**
 * Display a target time with the hour hand between numbers for partial hours.
 * @param {number} hour Target hour, interpreted modulo 12.
 * @param {number} minute Target minute.
 * @returns {void}
 */
export function setAnalogTime(hour, minute) {
  time.hour = ((hour % 12) + 12) % 12;
  time.minute = minute;
  angles.hour = (time.hour * 30 + minute / 2) % 360;
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
 * Snap minutes to a five-minute mark, or hours to the nearest position adjusted
 * for the selected minutes. Changing minutes also updates the hour position.
 * No-op when no hand is being dragged.
 * @returns {void}
 */
function finishDrag() {
  if (!drag) return;
  const { name, pointerId } = drag;
  if (name === "hour") {
    const hour = Math.round((angles.hour - time.minute / 2) / 30);
    setAnalogTime(hour, time.minute);
  } else {
    const minute = (Math.round(angles.minute / 30) % 12) * 5;
    setAnalogTime(time.hour, minute);
  }
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
  for (const hand of Object.values(hands)) {
    hand.tabIndex = enabled ? 0 : -1;
    hand.setAttribute("aria-disabled", String(!enabled));
  }
}

/**
 * Reset both hands to 12:00 and enable dragging for a new question.
 * Clears the movement flag for the new question.
 * @returns {void}
 */
export function resetClock() {
  setInteractive(false);
  moved = false;
  setAnalogTime(0, 0);
  setInteractive(true);
}

/**
 * Read the last snapped time without rounding a fractional hour to the next hour.
 * @returns {ClockTime}
 */
export function getClockTime() {
  return {
    hour: time.hour,
    minute: time.minute,
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
  hand.addEventListener("keydown", (event) => {
    if (!interactive || drag) return;
    const changes = { ArrowRight: 30, ArrowUp: 30, ArrowLeft: -30, ArrowDown: -30 };
    let { hour, minute } = time;
    if (Object.hasOwn(changes, event.key)) {
      if (name === "hour") hour = (hour + changes[event.key] / 30 + 12) % 12;
      else minute = (minute + changes[event.key] / 6 + 60) % 60;
    } else if (event.key === "Home") {
      if (name === "hour") hour = 1;
      else minute = 0;
    } else if (event.key === "End") {
      if (name === "hour") hour = 0;
      else minute = 55;
    } else {
      return;
    }
    event.preventDefault();
    moved = true;
    setAnalogTime(hour, minute);
    notifyChange();
  });
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
