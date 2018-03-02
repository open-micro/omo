const config  = require('../../config.js')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var cron_blueprint

describe('cron triggered blueprints', function() {
  
  before(function(done) {
    config.dbTrunc().then(done, done);
  })

  before(function(done) {
    config.queueTrunc().then(done, done);
  })

  it ('read and parse cron blueprint', function(done) {
    cron_blueprint = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'blueprints', 'CronBlueprint.omo')))
    done()
  })

  it ('post cron blueprint', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/blueprint',
      body: cron_blueprint,
      json: true
    }
    request(options).then((body) => {
      done()
    }, done)
  })

  it ('get cron blueprint by name', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/blueprint/name/' + cron_blueprint.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, cron_blueprint.name)
      done()
    }, done)
  })
})
