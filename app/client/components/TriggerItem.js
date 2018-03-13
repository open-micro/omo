import React          from "react"
import { Table }      from 'reactstrap'
import dateformat     from 'dateformat'
import config         from '../config'
import JsModal        from './JsModal'

export default class TriggerItem extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {fetchUrl: window.host + '/trigger/name/' + props.name}
  }

  render() {
    let last, next
    if (this.props.lastFired)
      last = dateformat(this.props.lastFired)
    else
      last = 'n/a'

      console.log(dateformat("longTime"))
    if (this.props.cron && this.props.cron.nextFire)
      next = dateformat(this.props.cron.nextFire, config.dateFormat)
    else
      next = 'n/a'

    return (
     <tr>
       <th scope="row">{this.props.name}</th>
       <td>{dateformat(this.props.updated, config.dateFormat)}</td>
       <td>{'' + this.props.auto}</td>
       <td>{this.props.config}</td>
       <td>{'' + this.props.started}</td>
       <td>{last}</td>
       <td>{next}</td>
       <td><JsModal fetchUrl={this.state.fetchUrl} title={'Trigger'}/></td>
     </tr>
    )
  }
}
