export default {
  name: "Clock",
  props: {
    hour: {
      type: Number,
      default: 12
    },
    minute: {
      type: Number,
      default: 0
    }
  },
  template: `
  <div class='clock-group'>
    <div class='clock-hand' id='hour-hand' :style="rotateHourHand"></div>
    <div class='clock-hand' id='minute-hand' :style="rotateMinuteHand"></div>
  </div>
  `,
  computed: {
    rotateHourHand() {
      const calcHourDegree = (this.hour % 12) * 30 + this.minute * 0.5 - 90;
      return { transform: `rotate(${calcHourDegree}deg)` }
    },
    rotateMinuteHand() {
      const calcMinuteDegree = this.minute * 6 - 90;
      return { transform: `rotate(${calcMinuteDegree}deg)` }
    }
  }
};