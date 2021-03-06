const express       = require('express')
const aa            = require('express-async-await')
const config        = require('./config/config')
const glob          = require('glob')
const db            = require('./app/utils/db')
const supervisor    = require('./app/workers/supervisor')
const logger        = require('./app/utils/logger')('app')
const glogger       = require('./app/utils/logger')('global')

require('trace-and-clarify-if-possible')

// end if top-level error in promise
process.on('unhandledRejection', err => {
  glogger.error(err)
})

const env = process.env.NODE_ENV || 'development'
const AUTO = process.env.AUTO

var queue

module.exports = () => {
  return db.connect().then(db => {
    logger.info('db connection established')

    // models
    const models = glob.sync(config.root + '/app/models/*.js')
    models.forEach(function (model) {
      require(model)
    })

    // worker management management (dev only)
    if (env === 'development' || AUTO) {
      logger.info('Setting up development support')
      require('./app/utils/queue').createAllQueues(db)

      // local work scheduler in dev
      const scheduler = require('./app/utils/scheduler')
      scheduler.start(config.schedulerTick)
      scheduler.schedule(config.schedulerInterval, (count, last) => {
        supervisor.run()
      })
    }

    // express (note async/await decorator)
    const app = aa(express())
    require('./config/express')(app, config)

    return new Promise((resolve, reject) => {
      var server = app.listen(config.port, () => {
        logger.info('Express server listening on port ' + config.port)
          resolve(server)
        })
    })

  }, err => {
    logger.error('unable to connect to database at ' + config.db)
    return Promise.reject(err)
  })
}
