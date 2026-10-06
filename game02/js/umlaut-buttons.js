// ==============================================
// Owned by Game 02 — å/ä/ö buttons for keyboards without them
// ==============================================

"use strict";

// Buttons with a data-char attribute insert that character at the caret of inputEl
export function initUmlautButtons(inputEl, buttonSelector = ".umlaut-button") {
  // mousedown + preventDefault keeps the input focused while clicking a button
  $(buttonSelector).on("mousedown", (e) => e.preventDefault());

  $(buttonSelector).on("click", function () {
    const ch = $(this).data("char");
    const start = inputEl.selectionStart ?? inputEl.value.length;
    const end = inputEl.selectionEnd ?? start;

    inputEl.value =
      inputEl.value.slice(0, start) + ch + inputEl.value.slice(end);
    inputEl.focus();
    inputEl.setSelectionRange(start + ch.length, start + ch.length);
  });
}
