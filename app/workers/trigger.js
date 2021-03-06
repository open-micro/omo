const workClient        = require('../utils/work')
const db                = require('../utils/db')
const { update }        = require('../dao/trigger')
const cronUpsert        = require('../dao/cron').upsert
const cronRemove        = require('../dao/cron').remove
const cronParser        = require('cron-parser')
const util              = require('util')
const logger            = require('../utils/logger')('trigger worker')

const processQueue = async () => {

  await db.connect() // connection is cached

  let obj = await workClient.getNextTrigger()
  if (obj) {
    logger.debug('dequeued trigger')
    logger.debug(util.inspect(obj))
    let trigger = obj.payload
    if (trigger.started) { // started field true means start the trigger
      logger.debug('starting trigger: ' + trigger.name)

      // create cron entry if trigger and update if already running
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
      let cron = await cronUpsert(new_cron) // update next_fire for cron
      trigger.cron = cron._id
      await update(trigger)
      logger.debug('cron added: ' + util.inspect(cron))
    } else {
      logger.debug('stopping trigger: ' + trigger.name)
      await cronRemove({trigger: trigger._id})
    }

    logger.debug('acking message')
    await (obj.ack)()
  }
}

module.exports = {processQueue}
