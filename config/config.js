const path = require('path')
const rootPath = path.normalize(__dirname + '/..')
const env = process.env.NODE_ENV || 'development'
const scheduler_tick = process.env.OMO_WORK_TICK || 5000
const scheduler_interval = process.env.OMO_WORK_INTERVAL || 1

var port = process.env.PORT || 3000

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'omo'
    },
    port: port,
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
    db: 'mongodb://localhost/omo-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'omo'
    },
    port: port,
    db: 'mongodb://localhost/omo-production'
  }
}

module.exports = config[env]
