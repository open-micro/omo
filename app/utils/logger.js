const winston     = require('winston')
const config      = require('../../config/config')

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return Date.now()
      },
      formatter: function(options) {
        return winston.config.colorize(options.level, new Date(options.timestamp()) + ' ' +
          options.level.toUpperCase() + ' ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' ))
      },
      level: config.logLevel
    })
  ]
})

module.exports = (comp) => {
  comp = '[' + comp + ']'
  return {
    debug: function(msg) {
      logger.log('debug', comp + ': ' + msg)
    },
    info: function(msg) {
      logger.log('info', comp + ': ' + msg)
    },
    warn: function(msg) {
      logger.log('warn', comp + ': ' + msg)
    },
    error: function(msg) {
      logger.log('error', comp + ': ' + msg)
    },
    crit: function(msg) {
      logger.log('crit', comp + ': ' + msg)
    },
    alert: function(msg) {
      logger.log('alert', comp + ': ' + msg)
    },
    emerg: function(msg) {
      logger.log('emerg', comp + ': ' + msg)
    }
  }
};
