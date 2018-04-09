import React            from 'react'
import { NavLink }      from 'react-router-dom'
import withBreadcrumbs  from 'react-router-breadcrumbs-hoc'

// breadcrumbs can be any type of component or string
const InstanceBreadcrumb = ({ match }) =>
  <span>Instance {match.params.instanceId}</span> // use match param userId to fetch/display user name

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/instances/:instanceId', breadcrumb: InstanceBreadcrumb },
  { path: '/example', breadcrumb: 'Custom Example' },
]

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
// NOTE: key is not set - hence the use of match.path as the key
const BreadcrumbsComponent = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map((breadcrumb, index) => (
      <span key={breadcrumb.props.match.path}>
        <NavLink to={breadcrumb.props.match.url}>
          {breadcrumb}
        </NavLink>
        {(index < breadcrumbs.length - 1) && <i> / </i>}
      </span>
    ))}
  </div>
)

export default withBreadcrumbs(routes)(BreadcrumbsComponent)
