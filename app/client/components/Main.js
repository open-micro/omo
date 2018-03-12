import React          from 'react'
import ReactDOM       from 'react-dom'
import {Route,
        Switch}       from 'react-router-dom'
import Home           from '../pages/Home'
import Triggers       from '../pages/Triggers'
import Blueprints     from '../pages/Blueprints'
import Instances      from '../pages/Instances'
import Alert          from './Alert'

export default class Main extends React.Component {
  render() {
    const containerStyle = {
      marginTop: "10px"
    };
    return(
      <div class="container" style={containerStyle}>
        <Alert/>
        <div class="row">
          <div class="col-lg-12">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/triggers' component={Triggers}/>
              <Route path='/blueprints' component={Blueprints}/>
              <Route path='/instances' component={Instances}/>
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
