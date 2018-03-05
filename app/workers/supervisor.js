const triggerWorker   = require('./trigger')
const cronWorker      = require('./cron')
const instanceWorker  = require('./instance')
const semaphore       = require('semaphore')
const logger          = require('../utils/logger')('supervisor')

var sem = semaphore(1)

const process = async () => {
  try {
    await triggerWorker.processQueue() // process triggers on trigger queue
    let triggerNames = await cronWorker() // check cron expirations (returns names of triggers to fire)
    if (triggerNames)
      await instanceWorker.fireInstances(triggerNames)
    await instanceWorker.processInstances() // run instances
  } catch(err) {
    logger.error(err)
  }
  sem.leave()
}

const run = async () => {
  if (sem.available)
    sem.take(process)
}

module.exports = {run}
