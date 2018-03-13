const mongoose    = require('./mongoose')
const config      = require('../../config/config')
const Trigger     = require('../../app/models/trigger')
const Cron        = require('../../app/models/cron')
const Blueprint   = require('../../app/models/blueprint')
const Instance    = require('../../app/models/instance')
const logger      = require('./logger')('db')

let db

const connect = () => {
  if (!db) {
    return mongoose.connect(config.db).then(() => {
      return Promise.resolve(db = mongoose.connection)
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(db)
    })
  }
}

const trunc = async () => {
  logger.warn('removing all collection documents')
  let db_con = await connect()
  await Trigger.remove({})
  await Cron.remove({})
  await Blueprint.remove({})
  await Instance.remove({})
  logger.warn('done removing all collection documents')

  return db_con
}

module.exports = { connect,
                    trunc }
