import React          from 'react'
import ReactDOM       from 'react-dom'
import AlertStore     from '../stores/AlertStore'

export default class Alert extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    AlertStore.on("alert", this.newAlert);
  }

  componentWillUnmount() {
    TodoStore.removeListener("alert", this.newAlert);
  }

  newAlert = () => {
    this.setState({alert: AlertStore.getLastAlert()})
    setTimeout(() => {
      this.setState({alert: null})
    }, 5000)
  }

  render() {
    if (this.state.alert)
      return(
        <div class="row">
          <div class="col-md-12">
            <div class="alert alert-danger" role="alert">
              {this.state.alert}
            </div>
          </div>
        </div>
      )
    else
      return null
  }
}
