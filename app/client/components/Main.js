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
import { Breadcrumbs }  from 'react-breadcrumbs'
import CrumbRoute       from './CrumbRoute'

export default class Main extends React.Component {
  constructor() {
    super()

    console.log(Breadcrumbs)
  }
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
                <CrumbRoute title='triggers' path='/triggers' component={Triggers}/>
                <CrumbRoute title='blueprints' path='/blueprints' component={Blueprints}/>
                <CrumbRoute title='instances' exact path='/instances' component={Instances}/>
                <CrumbRoute path='/instances/:id' component={Instance}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
