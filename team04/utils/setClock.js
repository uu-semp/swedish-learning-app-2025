export default function setClock(hour, minute) {
    const hourHandElem = document.querySelector('#hour-hand');
    const minuteHandElem = document.querySelector('#minute-hand');
    const calcHourDegree = (hour % 12) * 30 + minute * 0.5 - 90;
    const calcMinuteDegree = minute * 6 - 90;
    hourHandElem.style.transform = `rotate(${calcHourDegree}deg)`;
    minuteHandElem.style.transform = `rotate(${calcMinuteDegree}deg)`;
    console.log('Time set!');
};