"use strict";

document.addEventListener("DOMContentLoaded", function() {
  window.vocabulary.when_ready(function () {
    console.log("Vocabulary initialized")

    // example code, can be removed
    const chair_vocab = window.vocabulary.get_vocab("031e117b") // I know this id is for chair
    console.log(chair_vocab) // will give Object { en: "chair", sv: "stol", sv_pl: "stolar", article: "en", img: "assets/images/furniture/chair.png", img_copyright: 'Image: Papunets bildbank, <a href="papunet.net">papunet.net</a>, Elina Vanninen, Sergio Palao / ARASAAC och Sclera licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/deed">CC BY-NC-SA 3.0</a>', audio: "assets/audio/furniture/chair.mp3" }
  });
});
