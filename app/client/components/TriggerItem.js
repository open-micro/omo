import React          from "react"
import { Table }      from 'reactstrap'
import dateformat     from 'dateformat'
import JsModal        from './JsModal'

export default class TriggerItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {fetchUrl: window.host + '/trigger/name/' + props.name}
  }

  render() {
    return (
     <tr>
       <th scope="row">{this.props.name}</th>
       <td>{this.props.version}</td>
       <td>{dateformat(this.props.updated)}</td>
       <td><JsModal fetchUrl={this.state.fetchUrl} title={'Trigger'}/></td>
     </tr>
    )
  }
}
