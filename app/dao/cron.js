const Cron = require('../models/cron')
const logger    = require('../utils/logger')('cron dao')
const util      = require('util')

const copyFields = (updateMe, cron) => {
  updateMe.model = cron.model
  updateMe.version = cron.version
  updateMe.trigger = cron.trigger
  updateMe.nextFire = cron.nextFire
}

const create = async (input) => {
    return await Cron.create(input)
}

const update = async (cron) => {
  let updateMe = await Cron.findOne({name: cron.name})
  if (updateMe) {
    copyFields(updateMe, cron)
    cron = await updateMe.save()
    logger.debug('update updated cron: ' + util.inspect(cron))

    return cron
  } else {
    logger.warn('update could not find cron: ' + cron.name)
  }
}

const upsert = async (cron) => {
  let updateMe = await Cron.findOne({trigger: cron.trigger.id || cron.trigger})
  if (updateMe) {
    copyFields(updateMe, cron)
    cron = await updateMe.save()
    logger.debug('upsert updated cron: ' + util.inspect(cron))
  } else {
    cron = await Cron.create(cron)
    logger.debug('upsert created cron: ' + util.inspect(cron))
  }
  
  return cron
}

const find = async (query, populate) => {
  query = query || {}
  var q = Cron.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Cron.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const remove = async (query) => {
  return await Cron.findOneAndRemove(query)
}

module.exports = {create, update, upsert, find, findOne, remove}
