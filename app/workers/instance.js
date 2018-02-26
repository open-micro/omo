const db            = require('../utils/db')
const Blueprint     = require('../models/blueprint')
const Instance      = require('../models/instance')
const util          = require('util')
const logger        = require('../utils/logger')('instance worker')

const fireInstancesforTrigger = async (trigger_name) => {
  logger.debug('processing ' + trigger_name + ' trigger')
  let blueprints = await Blueprint.find({triggerName: trigger_name})
  if (!blueprints)
    logger.error('Blueprints query error - returned null')
  else if (blueprints.length > 0) {
    logger.debug('found blueprints to process')
    return Promise.resolve(blueprints.map((blueprint) => {
        let instance = {blueprint: blueprint._id}
        Instance.create(instance).then((inst) => {
          instance = inst
          logger.debug('created instance ' + util.inspect(instance))
        }, (err) => {
          throw err
        })
        return instance._id
    }))
  }
}

// process cron entries and return triggers to be fired
const fireInstances = async (trigger_names) => {
  try {
    if (trigger_names && trigger_names.length) {
      logger.debug('processing ' + trigger_names.length + ' triggers')
      trigger_names.forEach((trigger_name) => {
          fireInstancesforTrigger(trigger_name)
        })
      }
  } catch (err) {
    logger.error(err)
    throw(err)
  }
}

module.exports = {
  fireInstances: fireInstances
}
