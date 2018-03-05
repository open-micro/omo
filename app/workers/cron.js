const db              = require('../utils/db')
const {find, remove}  = require('../dao/cron')
const cronParser      = require('cron-parser')
const util            = require('util')
const logger          = require('../utils/logger')('cron worker')

const processCron = async (cron) => {
  if (cron.trigger.type === 'cron') { // cron type
    cron.nextFire = cronParser.parseExpression(cron.trigger.config).next()
    let saved = await cron.save()
    logger.debug('updated cron for trigger, nextFire: ' + util.inspect(cron))
    return cron.trigger.name
  } else { // date type
    let removed = await remove({_id: cron._id})
    logger.debug('removed cron for trigger ' + util.inspect(removed))
    return cron.trigger.name
  }
}

// process cron entries and return triggers to be fired
module.exports = async () => {

  await db.connect() // connection is cached

  try {
    let crons = await find({nextFire: {$lte: Date.now()}},'trigger')
    if (!crons)
      logger.error('Cron query error - returned null')
    else if (crons.length > 0) {
      logger.debug('found ' + crons.length + ' crons to process')
      return await Promise.all(crons.map((cron) => processCron(cron)))
    }
  } catch (err) {
    logger.error(err)
    throw(err)
  }
}
