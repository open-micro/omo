const Trigger     = require('../models/trigger')
const workClient  = require('../utils/work')

const create = async (trigger) => {
  if (trigger.auto) {
    trigger.started = true
  }
  trigger = await Trigger.create(trigger)
  if (trigger.auto) {
    await workClient.addTrigger(trigger)
  }

  return trigger
}

const update = async (trigger) => {
  if (trigger.auto) {
    trigger.started = true
  }
  trigger = await Trigger.findOneAndUpdate({name: trigger.name}, trigger)
  if (trigger.auto) {
    await workClient.addTrigger(trigger)
  }
}

const startByName = async (name) => {
  let trigger = await Trigger.findOneAndUpdate({name: name}, {started: true}, {new: true})
  await workClient.addTrigger(trigger)
  return trigger
}

const stopByName = async (name) => {
  let trigger = await Trigger.findOneAndUpdate({name: name}, {started: false}, {new: true})
  await workClient.addTrigger(trigger)
  return trigger
}

const find = async (query) => {
  query = query || {}
  return await Trigger.find(query)
}

const findOne = async (query) => {
  query = query || {}
  return await Trigger.findOne(query)
}

module.exports = {
  create: create,
  update: update,
  startByName: startByName,
  stopByName: stopByName,
  find: find,
  findOne: findOne
}
