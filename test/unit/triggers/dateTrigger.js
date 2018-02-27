const config  = require('../../config.js')
const Cron    = require('../../../app/models/cron')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var cron_trigger, trigger_id, blueprint

describe('date triggers', function() {
  it ('read and parse date trigger  - set the trigger to fire in 100ms', function(done) {
    date_trigger = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'triggers', 'DateTrigger.omo')))
    date_trigger.config = new Date(Date.now() + 1000)
    done()
  })

  it ('read blueprint to be triggered', function(done) {
    blueprint = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'blueprints', 'CronBlueprint.omo')))
    done()
  })

  it ('post date trigger', function(done) {
    let options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger',
      body: date_trigger,
      json: true
    }
    request(options).then((body) => {
      done()
    }, done)
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

  it ('post blueprint', function(done) {
    let options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/blueprint',
      body: blueprint,
      json: true
    }
    request(options).then((body) => {
      done()
    }, done)
  })

  it ('get blueprint by name', function(done) {
    let options = {
      uri: 'http://localhost:' + config.port + '/blueprint/name/' + blueprint.name,
      json: true
    }
    request(options).then((body) => {
      console.log(body)
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
      assert(body.msgId)
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

  it ('stop cron trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + date_trigger.name + '/stop',
      json: true
    }
    request(options).then((body) => {
      assert(body.msgId)
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
