const path        = require('path')
const portfinder  = require('portfinder')
const db          = require('../app/utils/db')
const Trigger     = require('../app/models/trigger')
const Cron     = require('../app/models/cron')
const Blueprint   = require('../app/models/blueprint')
const Instance    = require('../app/models/instance')
const queue       = require('../app/utils/queue')

var db_con, server

var config = require('../config/config')

config.samplesDir = path.join('test', 'samples')
config.schedulerTick = 100

async function dbTrunc() {
  db_con = await db.connect()
  await Trigger.remove()
  await Cron.remove()
  await Blueprint.remove()
  await Instance.remove()
}

async function queueTrunc() {
  db_con = await db.connect()
  await queue.deleteAllMessages(db_con)
}

async function findPort() {
  config.port = await portfinder.getPortPromise()
}

before(function(done) {
  dbTrunc().then(done, done);
})

before(function(done) {
  queueTrunc().then(done, done);
})

before(function(done) {
  findPort().then(done, done);
})

before(function(done) {
  require("../app").then(function(s) {
    server = s
    done()
  }, done)
})

after(function(done) {
  server.close()
  done()
})

module.exports = config
