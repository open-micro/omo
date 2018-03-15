const Instance = require('../models/instance')
const logger   = require('../utils/logger')('instance dao')
const util     = require('util')

const copyFields = (updateMe, cron) => {
  updateMe.model = cron.model
  updateMe.currentStep = cron.currentStep
  updateMe.status = cron.status
  updateMe.blueprint = cron.blueprint
  updateMe.initialContext = cron.initialContext
  updateMe.taskResults = cron.taskResults
  updateMe.global = cron.global
  updateMe.error = cron.error
  updateMe.nextCheck = cron.nextcheck
}

const create = async (input) => {
    return await Instance.create(input)
}

const update = async (instance) => {
  let updateMe = await Instance.findOne({name: instance.name})
  if (updateMe) {
    copyFields(updateMe, instance)
    updateMe.markModified('initialContext')
    updateMe.markModified('taskResults')
    updateMe.markModified('global')

    instance = await updateMe.save()
    logger.debug('update updated instance: ' + util.inspect(instance))

    return instance
  } else {
    logger.warn('update could not find instance: ' + instance.name)
  }
}

const find = async (query, populate) => {
  query = query || {}
  var q = Instance.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Instance.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const remove = async (params) => {
    return await Instance.remove(params)
}

module.exports = {create, update, remove, find, findOne}
