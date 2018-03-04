const path        = require('path')
const portfinder  = require('portfinder')
const db          = require('../app/utils/db')
const Trigger     = require('../app/models/trigger')
const Cron        = require('../app/models/cron')
const Blueprint   = require('../app/models/blueprint')
const Instance    = require('../app/models/instance')
const queue       = require('../app/utils/queue')

var db_con, server

var config = require('../config/config')

config.samplesDir = path.join('test', 'samples')
config.schedulerTick = 200
config.detachedInterval = 10

config.dbTrunc = async () =>  {
  db_con = await db.connect()
  await Trigger.remove()
  await Cron.remove()
  await Blueprint.remove()
  await Instance.remove()
}

config.queueTrunc = async () => {
  db_con = await db.connect()
  await queue.deleteAllMessages(db_con)
}

async function findPort() {
  config.port = await portfinder.getPortPromise()
}

before(function(done) {
  findPort().then(done, done);
})

before(function(done) {
  var app = require("../app")
  console.log()
  app.then(function(s) {
    server = s
    done()
  }, done)
})

after(function(done) {
  server.close()
  done()
})

module.exports = config
