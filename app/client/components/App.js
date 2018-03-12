import React  from 'react'
import Nav    from './layout/Nav'
import Main   from './Main'

export default class App extends React.Component {
  render() {
    return(
      <div>
        <Nav {...this.props}/>
        <Main/>
      </div>
    )
  }

}
