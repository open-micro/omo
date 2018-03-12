import { EventEmitter } from "events"

class AlertStore extends EventEmitter {
  constructor() {
    super()
  }

  createAlert(input) {
    if (typeof input !== 'string')
      input = input.toString()
    this.lastAlert = input
    this.emit("alert")
  }

  getLastAlert() {
    return this.lastAlert
  }

}

const Alerts = new AlertStore

export default Alerts
