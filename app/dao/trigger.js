const Trigger     = require('../models/trigger')
const workClient  = require('../utils/work')
const util        = require('util')
const logger      = require('../utils/logger')('trigger DAO')

const copyFields = (updateMe, trigger) => {
  updateMe.model = trigger.model
  updateMe.version = trigger.version
  updateMe.type = trigger.type
  updateMe.auto = trigger.auto
  updateMe.started = trigger.started
  updateMe.config = trigger.config
  updateMe.lastFired = trigger.lastFired
  updateMe.cron = trigger.cron
}

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
  let updateMe = await Trigger.findOne({name: trigger.name})
  if (updateMe) {
    copyFields(updateMe, trigger)
    trigger = await updateMe.save()
    logger.debug('update updated trigger: ' + util.inspect(trigger))

    return trigger
  } else {
    logger.warn('update could not find trigger: ' + trigger.name)
  }
}

const upsert = async (trigger) => {
  if (trigger.auto) {
    trigger.started = true
  }

  let updateMe = await Trigger.findOne({name: trigger.name})
  if (updateMe) {
    copyFields(updateMe, trigger)
    trigger = await updateMe.save()
    logger.debug('upsert updated trigger: ' + util.inspect(trigger))
  } else {
    trigger = await Trigger.create(trigger)
    logger.debug('upsert created trigger: ' + util.inspect(trigger))
  }

  if (trigger.auto) {
    await workClient.addTrigger(trigger)
  }

  return trigger
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
