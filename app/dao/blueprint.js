const Blueprint = require('../models/blueprint')
const logger    = require('../utils/logger')('blueprint dao')
const util      = require('util')

const copyFields = (updateMe, blueprint) => {
  updateMe.model = blueprint.model
  updateMe.version = blueprint.version
  updateMe.triggerName = blueprint.triggerName
  updateMe.tasks = blueprint.tasks
}

const create = async (input) => {
  return await Blueprint.create(input)
}

const update = async (blueprint) => {
  let updateMe = await Blueprint.findOne({name: blueprint.name})
  if (updateMe) {
    copyFields(updateMe, blueprint)
    updateMe.markModified('tasks')
    blueprint = await updateMe.save()
    logger.debug('update updated blueprint: ' + util.inspect(blueprint))

    return blueprint
  } else {
    logger.warn('update could not find blueprint: ' + blueprint.name)
  }
}

const upsert = async (blueprint) => {
  if (blueprint.auto) {
    blueprint.started = true
  }

  let updateMe = await Blueprint.findOne({name: blueprint.name})
  if (updateMe) {
    copyFields(updateMe, blueprint)
    updateMe.markModified('tasks')
    blueprint = await updateMe.save()
    logger.debug('upsert updated blueprint: ' + util.inspect(blueprint))
  } else {
    blueprint = await Blueprint.create(blueprint)
    logger.debug('upsert created blueprint: ' + util.inspect(blueprint))
  }

  if (blueprint.auto) {
    await workClient.addBlueprint(blueprint)
  }

  return blueprint
}

const find = async (query, populate) => {
  query = query || {}
  var q = Blueprint.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Blueprint.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

module.exports = {create, update, upsert, find, findOne}
