import React          from "react"
import { Table }      from 'reactstrap'
import axios          from 'axios'
import InstanceItem   from '../components/InstanceItem'
import AlertStore     from '../stores/AlertStore'
import Instance       from './Instance'

export default class Instances extends React.Component {
  constructor(props) {
    super(props)
    this.state = {instances: []}
  }

  componentWillMount = async () => {
    try {
      this.setState({instances: (await axios.get(window.host + '/instance')).data})
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
           <th>Blueprint</th>
           <th>Started</th>
           <th>Updated</th>
           <th>Current Step</th>
           <th>Manage</th>
         </tr>
       </thead>
       <tbody>
        {this.state.instances.map((instance) => <InstanceItem key={instance._id} {...instance}/>)}
       </tbody>
     </Table>
    )
  }
}
