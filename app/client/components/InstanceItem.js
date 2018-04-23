import React          from "react"
import { Table,
         Button }     from 'reactstrap'
import dateformat     from 'dateformat'
import timeAgo        from 'epoch-timeago'
import JsModal        from './JsModal'
import { Badge }      from 'reactstrap'
import config         from '../config'
import { Link }       from 'react-router-dom'

export default class InstanceItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props}
    this.state.fetchUrl= window.host + '/instance/' + props._id
  }

  update = (instance) => {
      this.setState({...instance})
  }

  render() {
    let badgeColor = 'primary'
    if (this.state.status === 'done')
      badgeColor = 'secondary'
    if (this.state.status === 'error')
      badgeColor = 'danger'

    let task = this.state.blueprint.tasks[this.state.currentStep]

    let link = { pathname: '/instances/' + this.props._id }

    return (
         <tr>
           <th scope="row"><Badge color={badgeColor}>{this.state.status}</Badge> {this.state.blueprint.name}</th>
           <td>{dateformat(this.state.created, config.dateFormat)}</td>
           <td>{timeAgo(new Date(this.state.updated))}</td>
           <td>{this.state.currentStep} ({(task) ? task.name : 'foobar'})</td>
           <td><Button outline={true} tag={Link} to={link} color="primary">view</Button></td>
         </tr>
    )
  }
}
