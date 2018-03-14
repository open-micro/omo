import React          from "react"
import { Table }      from 'reactstrap'
import dateformat     from 'dateformat'
import config         from '../config'
import JsModal        from './JsModal'
import DropButton     from './DropButton'
import TriggerStore   from '../stores/TriggerStore'

export default class TriggerItem extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {name: props.name}
    this.updateLineItems(props)
    this.state.status = this.updateButtonStatus(props)
    this.state.fetchUrl = window.host + '/trigger/name/' + props.name
  }

  updateButtonStatus = (trigger) => {
    let status = {actions: []}
    if (trigger.started) {
      status.title = 'started'
      status.color = 'success'
      status.actions.push({triggerName: trigger.name,
                          apiAction: 'STOP_TRIGGER',
                          buttonName: 'Stop Trigger'})
    } else {
      status.color = 'danger'
      status.title = 'stopped'
      status.actions.push({triggerName: trigger.name,
                          apiAction: 'START_TRIGGER',
                          buttonName: 'Start Trigger'})
    }

    return status
  }

  componentWillUnmount() {
    TriggerStore.removeListener("trigger", this.updateTrigger);
  }

  componentWillMount = async () => {
    TriggerStore.on("trigger", this.updateTrigger)
  }

  updateLineItems = (trigger) => {
    this.state.auto = trigger.auto
    this.state.config = trigger.config
    this.state.update = trigger.updated
    this.state.cron = trigger.cron
    this.state.lastFired = trigger.lastFired
  }

  updateTrigger = (trigger) => {
    if (this.state.name === trigger.name) {
      this.updateLineItems(trigger)
      let status = this.updateButtonStatus(trigger)
      this.setState({status: status})
      this.refs.dropButton.updateStatus(status)
    }
  }

  render() {
    let last, next
    if (this.state.lastFired)
      last = dateformat(this.state.lastFired)
    else
      last = 'n/a'

    if (this.state.cron && this.state.cron.nextFire)
      next = dateformat(this.state.cron.nextFire, config.dateFormat)
    else
      next = 'n/a'

    return (
     <tr>
       <th scope="row">{this.state.name}</th>
       <td>{dateformat(this.state.updated, config.dateFormat)}</td>
       <td>{'' + this.state.auto}</td>
       <td>{this.state.config}</td>
       <td><DropButton ref="dropButton" {...this.state.status}/></td>
       <td>{last}</td>
       <td>{next}</td>
       <td><JsModal fetchUrl={this.state.fetchUrl} title={'Trigger'}/></td>
     </tr>
    )
  }
}
