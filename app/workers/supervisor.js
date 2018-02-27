const triggerWorker   = require('./trigger')
const cronWorker      = require('./cron')
const instanceWorker  = require('./instance')
const logger          = require('../utils/logger')('sup')

const run = async () => {

  try {
    await triggerWorker.processQueue() // process triggers on trigger queue
    let triggers = await cronWorker() // check cron expirations (returns triggers to fire)
    if (triggers)
      await instanceWorker.fireInstances(triggers.map((trigger) => { // fire instances for triggers
                                          return trigger.name
                                        }))
    await instanceWorker.processInstances() // run instances 
  } catch(err) {
    logger.error(err)
  }

}

module.exports = {
  run: run
}
