import React  from 'react'
import { Link } from 'react-router-dom'

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true
    }

  }

  active = (path) => {
    if (path === this.props.location.pathname) {
      return 'active'
    }
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed
    this.setState({collapsed})
  }

  render() {
    const navClass = this.state.collapsed ? "collapse" : ""
    return (
      <nav class="navbar navbar-expand-sm navbar-dark bg-inverse bg-primary">
        <a class="navbar-brand" href="#">OMO</a>
          <button class="navbar-toggler" onClick={this.toggleCollapse.bind(this)} type="button" data-toggle="collapse" data-target="#navbarCollapse">
             <span class="navbar-toggler-icon"></span>
           </button>
           <div class={"navbar-collapse " + navClass} id="navbarCollapse">
              <div class="navbar-nav">
                 <Link to='/' class={"nav-item nav-link " + this.active('/')} onClick={this.toggleCollapse.bind(this)}>Home </Link>
                 <Link to='/triggers' class={"nav-item nav-link " + this.active('/triggers')} onClick={this.toggleCollapse.bind(this)}>Triggers</Link>
                 <Link to='/blueprints' class={"nav-item nav-link " + this.active('/blueprints')} onClick={this.toggleCollapse.bind(this)}>Blueprints</Link>
                 <Link to='/instances' class={"nav-item nav-link " + this.active('/instances')} onClick={this.toggleCollapse.bind(this)}>Instances</Link>
             </div>
          </div>
       </nav>
    )
  }
}
