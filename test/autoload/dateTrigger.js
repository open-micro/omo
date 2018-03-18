const config  = require('../config.js')
const Cron    = require('../../app/models/cron')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert
const Instance = require('../../app/dao/instance')

var date_trigger, trigger_id, blueprint

describe('date triggers autoload', function() {

  before(function(done) {
    config.dbTrunc().then(done, done);
  })

  before(function(done) {
    config.queueTrunc().then(done, done);
  })

  before(function(done) {
    process.env.AUTOLOAD = true
    process.env.AUTOLOAD_DIR = './test/samples'
    require("../../index").run().then((s) => {
      server = s
      done()
    }, done)
  })

  after(function(done) {
    delete process.env.AUTOLOAD
    delete process.env.AUTOLOAD_DIR
    server.close()
    done()
  })

  it ('read and parse date trigger', function(done) {
    date_trigger = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test', 'samples', 'triggers', 'DateTrigger.omo')))
    done()
  })

  it ('read blueprint to be triggered', function(done) {
    blueprint = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test', 'samples', 'blueprints', 'DateBlueprint.omo')))
    done()
  })

  it ('get date trigger by name', function(done) {
    let options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, date_trigger.name)
      done()
    }, done)
  })

  it ('get blueprint by name', function(done) {
    let options = {
      uri: 'http://localhost:' + config.port + '/blueprint/name/' + blueprint.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, blueprint.name)
      done()
    }, done)
  })

  it ('start date trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name + '/start',
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, date_trigger.name)
      done()
    }, done)
  })

  it ('make sure trigger start field was updated to true', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, date_trigger.name)
      assert.equal(body.started, true)
      trigger_id = body._id
      done()
    }, done)
  })

  it ('make sure an Instance document was started for the trigger', function(done) {
    setTimeout(() => {
      var options = {
        uri: 'http://localhost:' + config.port + '/blueprint/name/' + blueprint.name,
        json: true
      }
      request(options).then((body) => {
        assert.equal(body.name, blueprint.name)
        options = {
          uri: 'http://localhost:' + config.port + '/instance/blueprint/' + body._id,
          json: true
        }
        request(options).then((body) => {
          assert(body.length > 0, 'no instance for blueprint')
          assert.equal(body[0].currentStep, 0)
          done()
        }, done)
      }, done)
    }, 5000)
  })

  it ('stop date trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name + '/stop',
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, date_trigger.name)
      done()
    }, done)
  })

  it ('make sure trigger start field was updated to false', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name,
      json: true
    }
    setTimeout(() => {
      request(options).then((body) => {
        assert.equal(body.name, date_trigger.name)
        assert.equal(body.started, false)
        done()
      }, done)
    }, 2000)
  })

  it ('make sure Cron document was deleted for the trigger', function(done) {
    setTimeout(() => {
      Cron.findOne({trigger: trigger_id}).then((cron_obj) => {
        assert(!cron_obj, "Cron document not deleted for trigger")
        done()
      }, done)
    }, 5000)
  })
})
