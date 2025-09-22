// ==============================================
// Owned by Team 11
// ==============================================

"use strict";

// Returns an array with all ids for this teams items.
function getItemsIds() {
  const Ids = [];
  const foods = window.vocabulary.get_category("food");
  const fruits = window.vocabulary.get_category("fruit");
  foods.map(id => {
    Ids.push(id);
  })
  fruits.map(id => {
    Ids.push(id);
  })
  return Ids;
}

// Returns an array of Items.
function getItems() {
  const items = []
  const ids = getItemsIds();
  ids.map(id => {
    items.push(window.vocabulary.get_vocab(id))
  })
  return items;

}

$(function() {window.vocabulary.when_ready(function () {
  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team11");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team11", data);
  });

  // Load all team specific data
  const items = getItems();
  if (items != null) {
    console.log("Fetch all items")
  }

});});
