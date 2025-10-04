// ==============================================
// Owned by Team 06
// ==============================================
import { setAnalogTime } from "./components/clock.js";
("use strict");

$(function () {
  window.vocabulary.when_ready(function () {
    // These are only dummy functions and can be removed.
    $("#check-jquery").on("click", () => {
      alert("JavaScript and jQuery are working.");
    });

    $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

    $("#check-saving").on("click", () => {
      var data = window.save.get("team06");
      data.counter = data.counter ?? 0;
      data.counter += 1;
      $("#check-saving").text(
        `This button has been pressed ${data.counter} times`
      );
      window.save.set("team06", data);
    });

    $("#test-fetch").on("click", () => {
      console.log("check");
      fetch("./questions.json")
        .then((response) => response.json())
        .then((data) => {
          q = data.qs[0].questions[0];
          document.getElementById("question").textContent = q.en;
          time = setAnalogTime(q.hour, q.minute);
        })
        .catch((err) => {
          console.error("Fetch failed:", err);
          document.getElementById("question").textContent =
            "Failed to load questions, see console.";
        });
    });
  });
});
