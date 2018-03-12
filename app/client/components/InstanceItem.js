import React          from "react"
import { Table }      from 'reactstrap'
import dateformat     from 'dateformat'
import timeAgo        from 'epoch-timeago'
import JsModal        from './JsModal'

export default class InstanceItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {fetchUrl: window.host + '/instance/' + props._id}
  }

  render() {
    return (
     <tr>
       <th scope="row">{this.props.blueprint.name}</th>
       <td>{dateformat(this.props.created)}</td>
       <td>{timeAgo(new Date(this.props.updated))}</td>
       <td>{this.props.status}</td>
       <td>{this.props.currentStep}</td>
       <td><JsModal fetchUrl={this.state.fetchUrl} title={'Instance'}/></td>
     </tr>
    )
  }
}
