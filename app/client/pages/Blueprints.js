import React          from "react"
import { Table }      from 'reactstrap'
import axios          from 'axios'
import BlueprintItem  from '../components/BlueprintItem'
import AlertStore     from '../stores/AlertStore'

export default class Blueprints extends React.Component {
  constructor(props) {
    super(props)
    this.state = {blueprints: []}
  }

  componentWillMount = async () => {
    try {
      this.setState({blueprints: (await axios.get(window.host + '/blueprint')).data})
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
        {this.state.blueprints.map((blueprint) => <BlueprintItem key={blueprint._id} {...blueprint}/>)}
       </tbody>
     </Table>
    )
  }
}
