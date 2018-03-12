import React          from "react"
import { Table }      from 'reactstrap'
import axios          from 'axios'
import TriggerItem    from '../components/TriggerItem'

export default class Triggers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {triggers: []}
  }

  componentWillMount = async () => {
    try {
      this.setState({triggers: (await axios.get(window.host + '/trigger')).data})
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
           <th>Version</th>
           <th>Updated</th>
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
