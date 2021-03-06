import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter,
        Route } from 'react-router-dom'
import App from './components/App'
import url from 'url'

const app = document.getElementById('app')
window.host = 'http://' + url.parse(window.location.href).host

ReactDOM.render(
  <HashRouter>
    <Route path='/' component={App} />
  </HashRouter>,
app)
