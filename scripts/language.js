// language.js

"use strict";

window.language = {
    current: "sv",

    get() {
        return this.current;
    },

    set(lang) {
        this.current = lang;
    },

    is_swedish() {
        return this.current === "sv";
    },

    is_english() {
        return this.current === "en";
    }
};