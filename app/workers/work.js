const queue   = require('../utils/queue')
const Trigger = require('../models/trigger')
const winston = require('winston')

const addWork = (work) => {
  if (work instanceof Trigger) {
    winston.info('adding trigger to work queue')
    return queue.addMessage(work)
  }
}

module.exports = {
  addWork: addWork
}
