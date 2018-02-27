const execa   = require('execa')
const path    = require('path')
const util    = require('util')
const error   = require('./error')
const logger  = require('../../utils/logger')('execHandler')

module.exports = async (instance) => {
  let task = instance.blueprint.tasks[instance.currentStep]
  let args = task.config.args || []
  let command = task.config.command
  if (task.config.path) {
    let p = task.config.path.main
    if (typeof task.config.path.relative === 'undefined')
      task.config.path['relative'] = true // default = relative to cwd
    if (task.config.path.relative)
      p = path.join(process.cwd(), p)
    args.unshift(p)
  }

  //command = 'echo'
  //args = ['foobar']
  logger.debug('execing command: $' + command + ' ' + args.toString())
  return execa(command, args).then((result) => {
    logger.debug('command result: ' + util.inspect(result))
    instance.taskResults[instance.currentStep] = result
    instance.status = 'ready'
    return Promise.resolve(instance)
  }, (err) => {
    logger.debug('error processing command: ' + err)
    error.instanceError(instance, err)
    return Promise.resolve(instance)
  })

}
