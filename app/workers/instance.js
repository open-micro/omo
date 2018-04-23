const Blueprint     = require('../dao/blueprint')
const Instance      = require('../dao/instance')
const util          = require('util')
const execHandler   = require('./taskHandlers/exec')
const moduleHandler = require('./taskHandlers/module')
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
          return instance._id
        }, (err) => {
          throw err
        })
    }))
  } else {
    logger.debug('no blueprints to fire for trigger ' + trigger_name)
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
    if (instance.status === 'ready' && instance.blueprint.tasks.length > instance.currentStep+1) {
      instance.currentStep++
      logger.debug('instance currentStep set to ' + instance.currentStep)
    } else if (instance.status === 'ready' && instance.blueprint.tasks.length === instance.currentStep+1) {
      logger.debug('setting instance status = done')
      instance.status = 'done'
    }
}

// instance processing
const processInstances = async () => {
  try {
    // ready instances
    let instances = await Instance.find({status: 'ready'}, 'blueprint')
    for (let i=0; i<instances.length; i++) {
      let instance = instances[i]
      while (instance.status === 'ready') {
        if (instance.blueprint.tasks[instance.currentStep]) { // task available to process
          logger.debug('processing instance of blueprint ' + instance.blueprint.name)

          // process exec step
          if (instance.blueprint.tasks[instance.currentStep].type === 'exec') {
            logger.debug('processing exec task for ' + instance.blueprint.name + ' task ' + instance.currentStep)
            console.log(instance._id)
            instance.status = 'processing'
            await instance.save()
            await execHandler.processExec(instance) // process exec task
            updateInstanceStatus(instance) // update instance for next processing
            await instance.save()
          }

          // process module step
          if (instance.blueprint.tasks[instance.currentStep].type === 'module') {
            logger.debug('processing module task for ' + instance.blueprint.name + ' task ' + instance.currentStep)
            instance.status = 'processing'
            await instance.save()
            await moduleHandler.processModule(instance) // process module task
            updateInstanceStatus(instance) // update instance for next processing
            await instance.save()
          }

        } else { // ready but not tasks to processing
          logger.debug('no tasks to process for instance ' + instance.id)
          instance.status = 'done'
          await instance.save()
        }
      }
    }

    // detached instances
    instances = await Instance.find({status: 'detached',
                                    nextCheck: {$lte: Date.now()}}, 'blueprint')
    for (let i=0; i<instances.length; i++) {
      let instance = instances[i]
      await execHandler.processDetached(instance) // process detached task
      updateInstanceStatus(instance) // update instance for next processing
      await instance.save()
    }
  } catch (err) {
    logger.error(err)
    throw(err)
  }
}

module.exports = {fireInstances, processInstances}
