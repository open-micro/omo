const mongoose  = require('mongoose')
const config    = require('../../config/config')
const logger    = require('./logger')

if (config.logLevel === 'debug') {
  mongoose.set('debug', function(coll, method, query, doc, options) {
      let set = {
          coll: coll,
          method: method,
          query: query,
          doc: doc,
          options: options
      };

//      logger.debug({
//          dbQuery: set
//      })
  })
}

module.exports = mongoose
