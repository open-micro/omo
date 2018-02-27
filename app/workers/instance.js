const Blueprint     = require('../models/blueprint')
const Instance      = require('../models/instance')
const util          = require('util')
const execHandler   = require('./taskHandlers/exec')
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

const updateInstanceStatus = (instance) => {
    if (instance.status === 'ready' && instance.blueprint.tasks.length > instance.currentStep+1)
      instance.currentStep++
    else if (instance.status === 'ready' && instance.blueprint.tasks.length === instance.currentStep+1)
      instance.status = 'done'

    return instance
}

// instance processing
const processInstances = async () => {
  try {
    let instances = await Instance.find({status: 'ready'}).populate('blueprint')
    if (instances.length > 0) {
      instances.forEach(async (instance) => {
        while (instance.status === 'ready' && instance.blueprint.tasks[instance.currentStep]) {
          logger.debug('processing instance of blueprint ' + instance.blueprint.name)
          if (instance.blueprint.tasks[instance.currentStep].type === 'exec') {
            logger.debug('processing exec task for ' + instance.blueprint.name + ' task ' + instance.currentStep)
            instance.status = 'processing'
            await instance.save()
            instance = await execHandler(instance) // process exec task
            instance = updateInstanceStatus(instance) // update instance for next processing
            await instance.save()
          }
        }
      })
    }
  } catch (err) {
    logger.error(err)
    throw(err)
  }
}

module.exports = {
  fireInstances: fireInstances,
  processInstances: processInstances
}
