import dispatcher from "../dispatcher"

export function dispatch(type, name) {
  console.log(99)
  dispatcher.dispatch({
    type: type,
    name: name
  })
}
