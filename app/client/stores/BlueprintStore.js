import { EventEmitter } from "events"
import dispatcher       from "../dispatcher"
import axios            from "axios"

class BlueprintStore extends EventEmitter {
  constructor() {
    super()
  }

  getBlueprints = async () => {
    return (await axios.get(window.host + '/blueprint')).data
  }

  startBlueprint = async (id) => {
    console.log('startBlueprint(' + name + ')')
    return await axios.post(window.host + '/blueprint/start/id/' + id).data
  }

  handleActions = async (action) => {
    switch(action.type) {
      case "START_BLUEPRINT": {
        await this.startBlueprint(action.name)
        break;
      }
    }
  }
}

const Blueprints = new BlueprintStore
dispatcher.register(Blueprints.handleActions)

export default Blueprints
