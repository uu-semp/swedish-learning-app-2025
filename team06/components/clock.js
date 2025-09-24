export function setAnalogTime(hour, minute) {
	const hour_degree = ((hour + minute / 60) / 12) * 360 + 90;
	const minute_degree = (minute / 60) * 360 + 90;

	document.getElementById(
		"minute-hand"
	).style.transform = `rotate(${minute_degree}deg)`;

	document.getElementById(
		"hour-hand"
	).style.transform = `rotate(${hour_degree}deg)`;
}
