const path        = require('path')
const portfinder  = require('portfinder')
const db          = require('../app/utils/db')
const queue       = require('../app/utils/queue')

const mockery     = require('mockery')

var db_con, server

var config = require('../config/config')

config.samplesDir = path.join('test', 'samples')
config.schedulerTick = 200
config.detachedInterval = 10
config.mock = true

config.dbTrunc = async () =>  {
  await db.trunc()
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

before(function() {
  mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
  })
  mockery.registerMock('./config/config', config);
})

after(function() {
  mockery.disable()
})

module.exports = config
