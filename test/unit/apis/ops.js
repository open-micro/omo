const config            = require('../../config.js')
const path              = require('path')
const fs                = require('fs')
const request           = require('request-promise')
const getRequestOptions = require('node-request-by-swagger')
const assert            = require('chai').assert

const schema = require('../../samples/apis/petStore.json')

describe.only('swagger apis', () => {

  it ('invoke pet store schema operation', (done) => {
    let options = getRequestOptions(schema.paths['/pet'].post, {
        method: 'post',
        baseUrl: `http://${schema.host}${schema.basePath}`,
        path: '/pet',
        args: {
            body: {
                name: 'bob'
            }
        }
    })
    options.json = true
    request(options).then((body) => {
      console.log(body)
      done()
    }, done)
  })
})
