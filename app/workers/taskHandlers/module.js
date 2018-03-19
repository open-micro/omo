const execa         = require('execa')
const util          = require('util')
const { promisify } = require('util')
const fs            = require('fs')
const config        = require('../../../config/config')
const error         = require('./error')
const logger        = require('../../utils/logger')('moduleHandler')

const handleResult = (instance, result, status) => {
  logger.debug('command result: ' + util.inspect(result))
  if (!result)
    result = {}
  instance.taskResults[instance.currentStep] = {}
  instance.taskResults[instance.currentStep].status = result.status || 'success'
  instance.taskResults[instance.currentStep].data = result.data
  if (result.global && typeof result.global === 'object') {
    Object.keys(result.global).forEach((key) => {
      instance.global[key] = result.global[key]
    })
  }
  instance.markModified('taskResults')
  instance.markModified('global')
  instance.status = result.status === 'error' ? 'error' : 'ready'
  logger.debug('setting instance status = ready')
}

const processModule = async (instance) => {
  logger.debug('processModule ')
  let task = instance.blueprint.tasks[instance.currentStep]
  let module = task.config.path.file
  let relative = task.config.path.relative === true || task.config.path.relative === 'true'

  logger.debug('running module: ' + module)
  if (relative) {
    logger.debug('...relative to cwd: ' + process.cwd())
    module = process.cwd() + '/' + module
  }

  let context = {}
  context.global = instance.global

  try {
    let result = await require(module)(context)
    handleResult(instance, result, 'success')
  } catch(err) {
    logger.debug('error processing module: ' + err)
    error.instanceError(instance, err)
    instance.taskResults[instance.currentStep].status = 'error'
    instance.taskResults[instance.currentStep].data = err
    instance.markModified('taskResults')
    logger.debug('setting instance status = error')
  }
}

module.exports = { processModule }
