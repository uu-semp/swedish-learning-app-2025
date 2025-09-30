/**
 * Sets the rotation of the clock component's hour and minute hands based on the time arguments.
 *
 * @param {int} hour - The hour value (0-23)
 * @param {int} minute - The minute value (0-59)
 * @throws {Error} Throws an error if hour is not in [0, 24) or minute is not in [0, 60)
 */
export default function setClock(hour, minute) {
    if (hour < 0 || hour >= 24) {
        throw new Error('Wrong hour argument. Hour should be within [0, 24)');
    }
    if (minute < 0  || minute >= 60) {
        throw new Error('Wrong minute argument. Minute should be within [0, 60)');
    }
    const hourHandElem = document.querySelector('#hour-hand');
    const minuteHandElem = document.querySelector('#minute-hand');
    const calcHourDegree = (hour % 12) * 30 + minute * 0.5 - 90;
    const calcMinuteDegree = minute * 6 - 90;
    hourHandElem.style.transform = `rotate(${calcHourDegree}deg)`;
    minuteHandElem.style.transform = `rotate(${calcMinuteDegree}deg)`;
};