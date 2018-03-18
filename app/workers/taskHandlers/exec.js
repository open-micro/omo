const execa         = require('execa')
const util          = require('util')
const {promisify}   = require('util');
const fs            = require('fs')
const config        = require('../../../config/config')
const error         = require('./error')
const logger        = require('../../utils/logger')('execHandler')

const detachedInstanceCheckDate = () => {
  return new Date(Date.now() + config.detachedInterval * config.schedulerTick)
}

const detachedFileNames = (instance) => {
  let root = instance._id + '_' + instance.currentStep
  let com = '> /tmp/' + root + '.log;echo $? > /tmp/' + root + '.exit'
  let log = '/tmp/' + root + '.log'
  let ex = '/tmp/' + root + '.exit'

  return {com, log, ex}
}

const processExec = async (instance) => {
  logger.debug('processExec ')
  let task = instance.blueprint.tasks[instance.currentStep]
  let command = task.config.command
  let detach = (task.config.detach === true || task.config.detach === 'true') || false
  let args = task.config.args || []
  args.unshift(task.config.path.main)


  let options = {}, relative, detach_proc_log
  if (task.config.path) {
    if ((typeof task.config.path.relative === 'undefined') || task.config.path.relative === true || task.config.path.relative === 'true')
      relative = process.cwd()
    else
      relative = task.config.path.relative
    options['cwd'] = relative
  }

  if (detach) {
    let {com, log} = detachedFileNames(instance)
    args.push(com)
    detach_proc_log = log
    instance.nextCheck = detachedInstanceCheckDate()
    options['detached'] = true
    options['shell'] = true
    options['cleanup'] = false
    options['stdio'] = ['ignore', 'ignore', 'ignore']
  }

  logger.debug('execing command: $' + command + ' args: ' + args)
  if (relative)
    logger.debug('...relative to cwd: ' + options.cwd)
  if (detach)
    logger.debug('...detached')

  if (detach) {
    logger.debug('starting detached command')
    let child_proc = execa(command, args, options)
    child_proc.unref()
    instance.status = 'detached'
    instance.taskResults[instance.currentStep] = {}
    instance.taskResults[instance.currentStep].status = 'detached'
    instance.taskResults[instance.currentStep].type = 'file'
    instance.taskResults[instance.currentStep].data = detach_proc_log
    instance.markModified('taskResults')
    return Promise.resolve()
  } else {
    logger.debug('starting attached command')
    return execa(command, args, options).then((result) => {
      logger.debug('command result: ' + util.inspect(result))
      instance.taskResults[instance.currentStep] = {}
      instance.taskResults[instance.currentStep].status = 'success'
      instance.taskResults[instance.currentStep].data = result
      instance.markModified('taskResults')
      instance.status = 'ready'
      logger.debug('setting instance status = ready')

      return Promise.resolve()
    }, (err) => {
      logger.debug('error processing command: ' + err)
      error.instanceError(instance, err)
      instance.taskResults[instance.currentStep].status = 'error'
      instance.taskResults[instance.currentStep].data = err
      instance.markModified('taskResults')
      logger.debug('setting instance status = error')

      return Promise.resolve()
    })
  }
}

const processDetached = async (instance) => {
  let {ex} = detachedFileNames(instance)
  try {
    let file = await promisify(fs.readFile)(ex)
    if (parseInt(file, 10) !== 0) {
      logger.debug('detached exec for step ' + instance.currentStep + ' returned exit code ' + file)
      instance.status = 'error'
      instance.taskResults[instance.currentStep].status = 'error'
      instance.markModified('taskResults')
      logger.debug('setting instance status = error')
    } else {
      logger.debug('detached exec for step ' + instance.currentStep + ' returned success code ' + file)
      instance.taskResults[instance.currentStep].status = 'success'
      instance.markModified('taskResults')
      instance.status = 'ready'
      logger.debug('setting instance status = ready')
    }
  } catch (err) {
    logger.debug('no such file: ' + ex)
    instance.nextCheck = detachedInstanceCheckDate()
  }
}

module.exports = {processExec, processDetached}
