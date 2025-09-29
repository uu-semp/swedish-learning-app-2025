// ==============================================
// Owned by Team 13
// ==============================================

"use strict";

$(function() {
  window.vocabulary.when_ready(function () {

  const numbers = window.vocabulary.get_category("number");

  //const number = window.vocabulary.get_vocab(ids[0]);

  //const english = vocab.en;

  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });
  function irandom_range(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max);  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $("#display-number").text(JSON.stringify(window.vocabulary.get_vocab(ids[irandom_range(0,numbers.length)]).en));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team13");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team13", data);
  });

})});



