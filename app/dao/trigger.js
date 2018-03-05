const Trigger     = require('../models/trigger')
const workClient  = require('../utils/work')
const util        = require('util')
const logger      = require('../utils/logger')('trigger DAO')

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
  trigger = await Trigger.findOneAndUpdate({name:trigger.name}, trigger)
  if (trigger.auto) {
    await workClient.addTrigger(trigger)
  }
}

const upsert = async (trigger) => {
  if (trigger.auto) {
    trigger.started = true
  }

  if (!await Trigger.findOneAndUpdate({name: trigger.name}, trigger, {new: true})) {
    logger.debug('upsert creating trigger: ' + trigger.name)
    trigger = create(trigger)
    logger.debug(util.inspect(trigger))
  }

  if (trigger.auto) {
    await workClient.addTrigger(trigger)
  }
}

const startByName = async (name) => {
  let trigger = await Trigger.findOneAndUpdate({name}, {started: true}, {new: true})
  await workClient.addTrigger(trigger)
  return trigger
}

const stopByName = async (name) => {
  let trigger = await Trigger.findOneAndUpdate({name}, {started: false}, {new: true})
  await workClient.addTrigger(trigger)
  return trigger
}

const find = async (query, populate) => {
  query = query || {}
  var q = Trigger.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Trigger.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

module.exports = {create, update, upsert, find, findOne, startByName, stopByName}
