import dispatcher from "../dispatcher"

export function dispatch(type, name) {
  dispatcher.dispatch({
    type: type,
    name: name
  })
}
