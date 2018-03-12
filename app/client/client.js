import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter,
        Route} from 'react-router-dom'
import App from './components/App'

const app = document.getElementById('app')

ReactDOM.render(
  <HashRouter>
    <Route path='/' component={App} />
  </HashRouter>,
app)
