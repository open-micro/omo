const path                = require('path')
const rootPath            = path.normalize(__dirname + '/..')
const env                 = process.env.NODE_ENV || 'development'
const log_level           = process.env.OMO_LOG_LEVEL
const scheduler_tick      = process.env.OMO_WORK_TICK || 5000
const scheduler_interval  = process.env.OMO_WORK_INTERVAL || 1

var port = process.env.PORT || 3000

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'omo'
    },
    port: port,
    logLevel: log_level || 'debug',
    db: 'mongodb://localhost/omo-development',
    schedulerTick: scheduler_tick,
    schedulerInterval: scheduler_interval
  },

  test: {
    root: rootPath,
    app: {
      name: 'omo'
    },
    port: port,
    logLevel: log_level || 'warn',
    db: 'mongodb://localhost/omo-test',
    schedulerTick: scheduler_tick,
    schedulerInterval: scheduler_interval
  },

  production: {
    root: rootPath,
    app: {
      name: 'omo'
    },
    port: port,
    logLevel: log_level || 'crit',
    db: 'mongodb://localhost/omo-production',
    schedulerTick: scheduler_tick,
    schedulerInterval: scheduler_interval
  }
}

module.exports = config[env]
