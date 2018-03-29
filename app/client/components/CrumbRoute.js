import React          from 'react'
import { Route }      from 'react-router-dom'
import { Breadcrumb } from 'react-breadcrumbs'

export default (props) => {
  let locals = {...props}
  locals._component = locals.component
  delete locals.component

  return (
    <Route { ...locals } render={ routeProps => {
      return (
        <Breadcrumb data={{
        	title: locals.title,
        	pathname: routeProps.match.url,
        	search: locals.includeSearch ? routeProps.location.search : null
        }}>
          { locals._component ? <locals._component { ...routeProps } /> : render(routeProps) }
        </Breadcrumb>
      )}}
    />
  )
}
