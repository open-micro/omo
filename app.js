const express       = require('express')
const aa            = require('express-async-await')
const config        = require('./config/config')
const glob          = require('glob')
const db            = require('./app/utils/db')
const winston       = require('winston')

require('trace-and-clarify-if-possible')

// end if top-level error in promise
process.on('unhandledRejection', err => {
  console.error(err)
  process.exit(1)
})

const env = process.env.NODE_ENV || 'development'

var queue

module.exports = db.connect().then((db) =>
  {
    winston.info('db connection established')

    // models
    const models = glob.sync(config.root + '/app/models/*.js')
    models.forEach(function (model) {
      require(model)
    })

    // worker management management (dev only)
    if (env === 'development') {
      require('./app/utils/queue').createQueue(db)
      const scheduler = require('./app/utils/scheduler')
      scheduler.start(config.schedulerTick)
      scheduler.schedule(config.schedulerInterval, (count, last) => {
        winston.info('Work queue update');
      })
    }

    // express
    const app = aa(express())
    require('./config/express')(app, config)

    return new Promise((resolve, reject) => {
      var server = app.listen(config.port, () => {
        winston.info('Express server listening on port ' + config.port)
          resolve(server)
        })
    })

  }, err => {
    winston.error('unable to connect to database at ' + config.db)
  })
