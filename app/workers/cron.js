const db            = require('../utils/db')
const Cron          = require('../models/cron')
const cronParser    = require('cron-parser')
const util          = require('util')
const logger        = require('../utils/logger')('cron worker')

const removeCron = (cron) => {
  Cron.remove(cron).then((status) => {
    logger.debug('removed Cron: ' + util.inspect(cron))
  }, (err) => {
    throw err
  })
}

// process cron entries and return triggers to be fired
module.exports = async () => {

  await db.connect() // connection is cached

  try {
    let crons = await Cron.find({nextFire: {$lte: Date.now()}}).populate('trigger')
    if (!crons)
      logger.error('Cron query error - returned null')
    else if (crons.length > 0) {
      logger.debug('found crons to process')
      return Promise.resolve(crons.map((cron) => {
        if (cron.trigger.type === 'cron') {
          cron.nextFire = cronParser.parseExpression(cron.trigger.config).next()
          Cron.update(cron).then((cron) => {
            logger.debug('updated cron for trigger, nextFire: ' + util.inspect(cron))
          }, (err) => {
            throw err
          })
        } else {
          removeCron(cron)
        }
        return cron.trigger
      }))
    }
  } catch (err) {
    logger.error(err)
    throw(err)
  }
}
