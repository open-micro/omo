const mongoose  = require('mongoose')
const util      = require('util')
const config    = require('../../config/config')
const logger    = require('./logger')('mongoose')

if (config.logLevel === 'debug') {
  mongoose.set('debug', function(coll, method, query, doc, options) {
      let set = {
          coll: coll,
          method: method,
          query: query,
          doc: doc,
          options: options
      };

     //logger.debug(util.inspect(set))
  })
}

module.exports = mongoose
