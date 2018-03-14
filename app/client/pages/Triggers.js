import React          from "react"
import { Table }      from 'reactstrap'
import axios          from 'axios'
import TriggerItem    from '../components/TriggerItem'
import AlertStore     from '../stores/AlertStore'
import TriggerStore   from '../stores/TriggerStore'

export default class Triggers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {triggers: []}
  }

  componentWillUnmount() {
    TriggerStore.removeListener("triggers", this.getTriggers);
  }

  componentWillMount = async () => {
    this.getTriggers()
    TriggerStore.on("triggers", this.getTriggers)
  }

  getTriggers = async () => {
    try {
      let triggers = await TriggerStore.getTriggers()
      this.setState({triggers: triggers || []})
    } catch (err) {
      console.log(err)
      AlertStore.createAlert(err)
    }
  }

  render() {
    return (
      <Table>
       <thead>
         <tr>
           <th>Name</th>
           <th>Updated</th>
           <th>Auto</th>
           <th>Config</th>
           <th>Started</th>
           <th>Last Fired</th>
           <th>Next Fire</th>
           <th>Manage</th>
         </tr>
       </thead>
       <tbody>
        {this.state.triggers.map((trigger) => <TriggerItem key={trigger._id} {...trigger}/>)}
       </tbody>
     </Table>
    )
  }
}
