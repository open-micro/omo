import React from "react"
import {Link} from 'react-router-dom'
import '../css/a-card.css'
import '../css/panel-border.css'

export default class Home extends React.Component {
  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-sm-3">
            <Link to="triggers" class="card card-outline-primary text-center">
               <div class="card-block">
                 <h1 class="card-title">Triggers</h1>
                 <p class="card-text">Set conditions which will cause blueprint instances to be started</p>
                 <button class="btn btn-primary">Manage ></button>
               </div>
             </Link>
          </div>
          <div class="col-sm-3">
            <Link to="blueprints" class="card card-outline-primary text-center">
               <div class="card-block">
                 <h1 class="card-title">Blueprints</h1>
                 <p class="card-text">Define the steps which orchestrations take</p>
                 <button class="btn btn-primary">Manage ></button>
               </div>
             </Link>
          </div>
          <div class="col-sm-3">
            <Link to="instances" class="card card-outline-primary text-center">
               <div class="card-block">
                 <h1 class="card-title">Instances</h1>
                 <p class="card-text">Monitor the progress of orchestration instances</p>
                 <button class="btn btn-primary">Manage ></button>
               </div>
             </Link>
          </div>
        </div>
      </div>
    )
  }
}
