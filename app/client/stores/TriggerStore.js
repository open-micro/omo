import { EventEmitter } from "events"
import dispatcher       from "../dispatcher"
import axios            from "axios"

class TriggerStore extends EventEmitter {
  constructor() {
    super()
  }

  getTriggers = async () => {
    return (await axios.get(window.host + '/trigger')).data
  }

  getTrigger = async (name) => {
    return (await axios.get(window.host + '/trigger/name/' + name)).data
  }

  startTrigger = async (name) => {
    console.log('startTrigger(' + name + ')')
    return await axios.post(window.host + '/trigger/name/' + name + '/start').data
  }

  stopTrigger = async (name) => {
    console.log('stopTrigger(' + name + ')')
    return await axios.post(window.host + '/trigger/name/' + name + '/stop').data
  }

  handleActions = async (action) => {
    switch(action.type) {
      case "START_TRIGGER": {
        await this.startTrigger(action.name)
        setTimeout(async () => {
          let trigger = await this.getTrigger(action.name)
          this.emit("trigger", trigger)
        }, 2000)
        break;
      }
      case "STOP_TRIGGER": {
        await this.stopTrigger(action.name)
        setTimeout(async () => {
          let trigger = await this.getTrigger(action.name)
          this.emit("trigger", trigger)
        }, 2000)
        break;
      }
    }
  }
}

const Triggers = new TriggerStore
dispatcher.register(Triggers.handleActions)

export default Triggers
