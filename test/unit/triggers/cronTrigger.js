const config  = require('../../config.js')
const Cron    = require('../../../app/models/cron')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var cron_trigger, trigger_id

describe('cron triggers', function() {

  before(function(done) {
    config.dbTrunc().then(done, done);
  })

  before(function(done) {
    config.queueTrunc().then(done, done);
  })

  before(function(done) {
    var app = require("../../../app")
    app().then(function(s) {
      server = s
      done()
    }, done)
  })

  after(function(done) {
    server.close()
    done()
  })

  it ('read and parse cron trigger', function(done) {
    cron_trigger = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'triggers', 'CronTrigger.omo')))
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
      assert.equal(body.name, cron_trigger.name)
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
      assert.equal(body.name, cron_trigger.name)
      done()
    }, done)
  })

  it ('make sure trigger start field was updated to true', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + cron_trigger.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, cron_trigger.name)
      assert.equal(body.started, true)
      trigger_id = body._id
      done()
    }, done)
  })

  it ('make sure cron entry was made for the trigger', function(done) {
    setTimeout(() => {
      Cron.findOne({trigger: trigger_id}).then((cron_obj) => {
        assert.equal(cron_obj.trigger, trigger_id)
        done()
      }, done)
    }, 300)
  })

  it ('stop cron trigger by name', function(done) {
    var options = {
      method: 'POST',
      uri: 'http://localhost:' + config.port + '/trigger/name/' + cron_trigger.name + '/stop',
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, cron_trigger.name)
      done()
    }, done)
  })

  it ('make sure trigger start field was updated to false', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/trigger/name/' + cron_trigger.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, cron_trigger.name)
      assert.equal(body.started, false)
      done()
    }, done)
  })

  it ('make sure cron entry was deleted for the trigger', function(done) {
    setTimeout(() => {
      Cron.findOne({trigger: trigger_id}).then((cron_obj) => {
        assert(!cron_obj)
        done()
      }, done)
    }, 300)
  })
})
