import React          from 'react'
import ReactDOM       from 'react-dom'

export default class Alert extends React.Component {
  render() {
    return(
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-danger" role="alert">
            This is a danger alert
          </div>
        </div>
      </div>
    )
  }
}
