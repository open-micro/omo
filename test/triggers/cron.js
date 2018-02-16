const config  = require('../config.js')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var cron_trigger

describe('cron triggers', function() {
  it ('read and parse cron trigger', function(done) {
    cron_trigger = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'CronTrigger.omo')))
    done()
  })

  it ('post cron trigger', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger',
      body: cron_trigger,
      json: true
    }
    request(options).then((body) => {
      done()
    }, done)
  })

  it ('get cron trigger by name', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + cron_trigger.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, cron_trigger.name)
      done()
    }, done)
  })

  it ('start cron trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + cron_trigger.name + '/start',
      json: true
    }
    request(options).then((body) => {
      console.log(body)
      //assert.equal(body.name, cron_trigger.name)
      done()
    }, done)
  })
})
