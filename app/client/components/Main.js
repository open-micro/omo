import React            from 'react'
import ReactDOM         from 'react-dom'
import { Route,
        Switch }        from 'react-router-dom'
import Home             from '../pages/Home'
import Triggers         from '../pages/Triggers'
import Blueprints       from '../pages/Blueprints'
import Instances        from '../pages/Instances'
import Instance         from '../pages/Instance'
import Alert            from './Alert'
import Breadcrumbs      from './Breadcrumbs'

export default class Main extends React.Component {
  render() {
    const containerStyle = {
      marginTop: "10px"
    }

    const crumbStyle = {
      marginLeft: "30px"
    }

    return(
      <div>
        <div style={crumbStyle}>
          <Breadcrumbs/>
        </div>
        <div class="container" style={containerStyle}>
          <Alert/>
          <div class="row">
            <div class="col-lg-12">
              <Switch>
                <Route exact path='/' component={Home} />
                <Route title='triggers' path='/triggers' component={Triggers}/>
                <Route title='blueprints' path='/blueprints' component={Blueprints}/>
                <Route title='instances' exact path='/instances' component={Instances}/>
                <Route path='/instances/:instanceId' component={Instance}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
