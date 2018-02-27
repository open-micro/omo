const config  = require('../config.js')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var blueprint, trigger

describe('trigger a blueprint instance which runs a python script', function() {
  it ('read and parse cron blueprint', function(done) {
    blueprint = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'blueprints', 'DateTriggerPythonBlueprint.omo')))
    done()
  })

  it ('read and parse date trigger', function(done) {
    trigger = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'triggers', 'DateTrigger.omo')))
    trigger.config = new Date(Date.now() + 1000)
    done()
  })

  it ('post blueprint', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/blueprint',
      body: blueprint,
      json: true
    }
    request(options).then((body) => {
      blueprint = body
      done()
    }, done)
  })

  it ('post trigger', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger',
      body: trigger,
      json: true
    }
    request(options).then((body) => {
      done()
    }, done)
  })

  it ('start date trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + trigger.name + '/start',
      json: true
    }
    request(options).then((body) => {
      assert(body.msgId)
      done()
    }, done)
  })

  it ('make sure instance completed successfully', function(done) {
    setTimeout(() => {
      var options = {
        uri: 'http://localhost:' + config.port + '/instance/blueprint/' + blueprint._id,
        json: true
      }
      request(options).then((body) => {
        assert(body[0])
        assert.equal(body[0].status, 'done')
        done()
      }, done)
    }, 3000)
  })

  it ('update blueprint to use python script that errors', function(done) {
    blueprint.tasks[0].config.path.main = 'test/samples/exec/twoSecError.py'
    var options = {
      method: 'PUT',
      uri: 'http://localhost:' + config.port + '/blueprint',
      body: blueprint,
      json: true
    }
    request(options).then((body) => {
      blueprint = body
      done()
    }, done)
  })

  it ('start date trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + trigger.name + '/start',
      json: true
    }
    request(options).then((body) => {
      assert(body.msgId)
      done()
    }, done)
  })

  it ('make sure instance errored', function(done) {
    setTimeout(() => {
      var options = {
        uri: 'http://localhost:' + config.port + '/instance/error',
        json: true
      }
      request(options).then((body) => {
        assert(body[0])
        assert.equal(body[0].status, 'error')
        done()
      }, done)
    }, 3000)
  })
})
