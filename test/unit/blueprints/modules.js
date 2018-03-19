const config  = require('../../config.js')
const path    = require('path')
const fs      = require('fs')
const request = require('request-promise')
const assert  = require('chai').assert

var blueprint

describe('modules', function() {

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

  it ('read and parse blueprint', function(done) {
    blueprint = JSON.parse(fs.readFileSync(path.join(config.samplesDir, 'blueprints', 'ModuleBlueprint.omo')))
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

  it ('get blueprint by name', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/blueprint/name/' + blueprint.name,
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.name, blueprint.name)
      done()
    }, done)
  })

  it ('start blueprint by name', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/blueprint/start/name/' + blueprint.name,
      method: 'POST',
      json: true
    }
    request(options).then((body) => {
      assert.equal(body.status, 'ready')
      done()
    }, done)
  })

  it ('make sure instance completed', function(done) {
    var options = {
      uri: 'http://localhost:' + config.port + '/instance/blueprint/' + blueprint._id,
      json: true
    }
    setTimeout(() => {
      request(options).then((body) => {
        assert.equal(body[0].status, 'done')
        done()
      }, done)
    }, 5000)
  })
})
