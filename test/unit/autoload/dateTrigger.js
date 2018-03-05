const config  = require('../../config.js')
const Cron    = require('../../../app/models/cron')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert
const Instance = require('../../../app/dao/instance')

var cron_trigger, trigger_id, blueprint

describe('date triggers autoload', function() {

  before(function(done) {
    config.dbTrunc().then(done, done);
  })

  before(function(done) {
    config.queueTrunc().then(done, done);
  })

  before(function(done) {
    console.log(111)
    var index = require("../../../index")
    index.start(true).then(function(s) {
      server = s
      done()
    }, done)
  })

  after(function(done) {
    server.close()
    done()
  })

  it ('read and parse date trigger', function(done) {
    date_trigger = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'omo', 'DateTrigger.omo')))
    done()
  })

  it ('read blueprint to be triggered', function(done) {
    blueprint = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'omo', 'CronBlueprint.omo')))
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
          assert(body, 'no instance for blueprint')
          assert.equal(body[0].currentStep, 0)
          done()
        }, done)
      }, done)
    }, 1000)
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
    request(options).then((body) => {
      assert.equal(body.name, date_trigger.name)
      assert.equal(body.started, false)
      done()
    }, done)
  })

  it ('make sure Cron document was deleted for the trigger', function(done) {
    setTimeout(() => {
      Cron.findOne({trigger: trigger_id}).then((cron_obj) => {
        assert(!cron_obj, "Cron document not deleted for trigger")
        done()
      }, done)
    }, 1000)
  })
})
