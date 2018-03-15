import { EventEmitter } from "events"
import dispatcher       from "../dispatcher"
import axios            from "axios"

class InstanceStore extends EventEmitter {
  constructor() {
    super()
  }

  getInstances = async () => {
    return (await axios.get(window.host + '/instance')).data
  }

  getInstance = async (name) => {
    return (await axios.get(window.host + '/instance/name/' + name)).data
  }

  startInstance = async (name) => {
    console.log('startInstance(' + name + ')')
    return await axios.post(window.host + '/instance/name/' + name + '/start').data
  }

  stopInstance = async (name) => {
    console.log('stopInstance(' + name + ')')
    return await axios.post(window.host + '/instance/name/' + name + '/stop').data
  }

  deleteInstance = async (id) => {
    console.log('deleteInstance(' + id + ')')
    return await axios.delete(window.host + '/instance/' + id).data
  }

  deleteDoneInstances = async () => {
    console.log('deleteDoneInstances')
    return await axios.delete(window.host + '/instance/all/done').data
  }

  handleActions = async (action) => {
    console.log(action)
    switch(action.type) {
      case "START_INSTANCE": {
        await this.startInstance(action.name)
        setTimeout(async () => {
          let instance = await this.getInstance(action.name)
          this.emit("instance", instance)
        }, 2000)
        break;
      }
      case "STOP_INSTANCE": {
        await this.stopInstance(action.name)
        setTimeout(async () => {
          let instance = await this.getInstance(action.name)
          this.emit("instance", instance)
        }, 2000)
        break;
      }
      case "DELETE_INSTANCE": {
        console.log('DELETE_INSTANCE ' + action.name)
        await this.deleteInstance(action.name)
        setTimeout(async () => {
          this.emit("instances")
        }, 200)
        break;
      }
      case "DELETE_DONE_INSTANCES": {
        console.log('DELETE_DONE_INSTANCES ')
        await this.deleteDoneInstances()
        this.emit("instances")
        break;
      }
    }
  }
}

const Instances = new InstanceStore
dispatcher.register(Instances.handleActions)

export default Instances
