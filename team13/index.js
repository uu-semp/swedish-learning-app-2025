// ==============================================
// Owned by Team 13
// ==============================================

"use strict";
function irandom_range(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max);  
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
$(function() {
  window.vocabulary.when_ready(function () {
    // Get all vocabulary belonging to the category numbers
  const numbers = window.vocabulary.get_category("number");

  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });
  
  const randomNo =  irandom_range(0,numbers.length)
  console.log(randomNo)
  // Load the metadata for the first ID
  $("#zero").text(window.vocabulary.get_vocab(numbers[0]).en);
  $("#randomNo").text(JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).en));
  $("#display-number").text(JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).en));
  // Get all vocabulary belonging to the category `furniture`


  $("#check-saving").on("click", () => {
    var data = window.save.get("team13");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team13", data);
  });

})});
 


