// ==============================================
// Owned by Team 06
// ==============================================
"use strict";

$(function () {
	window.vocabulary.when_ready(function () {
		// These are only dummy functions and can be removed.
		$("#check-jquery").on("click", () => {
			alert("JavaScript and jQuery are working.");
		});

		$("#display-vocab").text(
			JSON.stringify(window.vocabulary.get_random())
		);

		$("#check-saving").on("click", () => {
			var data = window.save.get("team06");
			data.counter = data.counter ?? 0;
			data.counter += 1;
			$("#check-saving").text(
				`This button has been pressed ${data.counter} times`
			);
			window.save.set("team06", data);
		});

		const clockObj = document.getElementById("clock-frame");
		function withClockDoc(fn) {
			if (!clockObj) return;
			if (clockObj.contentDocument) {
				fn(clockObj.contentDocument, clockObj.contentWindow);
			} else {
				clockObj.addEventListener("load", () =>
					fn(clockObj.contentDocument, clockObj.contentWindow)
				);
			}
		}

		$("#test-fetch").on("click", () => {
			fetch("./questions.json")
				.then((r) => r.json())
				.then((data) => {
					const q = data.qs[0].questions[0];
					document.getElementById("question").textContent = q.en;

					withClockDoc((doc, win) => {
						if (typeof win.setAnalogTime === "function") {
							win.setAnalogTime(q.hour, q.minute);
						} else {
							console.warn("No setAnalogTime in clock.html");
						}
					});
				})
				.catch((err) => {
					console.error(err);
					document.getElementById("question").textContent =
						"Failed to load questions.";
				});
		});
	});
});
