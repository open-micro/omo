import React from "react"
import ReactDOM from "react-dom"
import {HashRouter, Route, Switch} from "react-router-dom"

import Favorites from "./pages/Favorites"
import Todos from "./pages/Todos"
import Layout from "./pages/Layout"
import Settings from "./pages/Settings"

const app = document.getElementById('app')

ReactDOM.render(
  <HashRouter>
    <div>
      <Route exact path="/" component={Layout} />
      <Route component={Todos}></Route>
      <Route path="/favorites" component={Favorites}></Route>
      <Route path="/settings" component={Settings}></Route>
    </div>
  </HashRouter>,
app)
