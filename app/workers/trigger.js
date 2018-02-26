const workClient    = require('../utils/work')
const db            = require('../utils/db')
const Cron          = require('../models/cron')
const cronParser    = require('cron-parser')
const util          = require('util')
const logger        = require('../utils/logger')('trigger worker')

const processQueue = async () => {

  await db.connect() // connection is cached

  let obj = await workClient.getNextTrigger()
  if (obj) {
    logger.debug('dequeued trigger')
    logger.debug(util.inspect(obj))
    logger.debug('acking message')
    let trigger = obj.payload
    if (!trigger.started) { // if not started it should be started
      logger.debug('starting trigger: ' + trigger.name)

      // create cron entry if trigger is not already running
        let cron = await Cron.findOne({trigger: trigger._id})
        if (cron) {
          logger.error('Trigger ' + trigger.name + ' already has a cron job')
        } else {
          logger.debug('creating cron for: ' + trigger.config)
          let next_fire
          if (trigger.type === 'cron')
            next_fire = cronParser.parseExpression(trigger.config).next()
          else
            next_fire = trigger.config
          let new_cron = {
            nextFire: next_fire,
            trigger: trigger
          }
          await Cron.create(new_cron)
        }
    } else {
      logger.debug('stopping trigger: ' + trigger.name)
      await Cron.remove({trigger: trigger._id})
    }

    await (obj.ack)()
  }
}

module.exports = {
  processQueue: processQueue
}
