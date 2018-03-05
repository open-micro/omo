const util          = require('util')
const queueConfig   = require('../../config/queue')
const queueClient   = require('./queue')
const Trigger       = require('../models/trigger')
const logger        = require('./logger')('work')

const ack = (queue, ack_id) => {
    return queueClient.ackMessage(queue, ack_id)
}

const ping = (queue, ack_id) => {
    return queueClient.pingMessage(queue, ack_id)
}

const addTrigger = (trigger) => {
  if (trigger instanceof Trigger) {
    logger.info('adding Trigger to trigger queue')
    logger.debug(util.inspect(trigger))
    return queueClient.addMessage(queueConfig.trigger_queue, trigger)
  } else {
    return Promise.reject('not a Trigger')
  }
}

const addWork = (work) => {
  logger.info('adding work to work queue')
  logger.debug(util.inspect(work))
  return queueClient.addMessage(queueConfig.work_queue, work)
}

const getNextTrigger = () => {
    return queueClient.getMessage(queueConfig.trigger_queue).then((msg) => {
      let msg_return
      if (msg) {
        msg_return = {payload: msg.payload,
                      ack: () => {
                            ack(queueConfig.trigger_queue, msg.ack)
                      },
                      ping: () => {
                            ping(queueConfig.trigger_queue, msg.ack)
                      }
                    }
      }
      return Promise.resolve(msg_return)
    }, (err) => {
      return Promise.reject(err)
    })
}

const getNextWork = () => {
    return queueClient.getMessage(queueConfig.work_queue).then((msg) => {
      let msg_return
      if (msg) {
        msg_return = {msg: msg.payload,
                      ack: ack(queueConfig.work_queue, msg.ack),
                      ping: ping(queueConfig.work_queue, msg.ack)}
      }
      return Promise.resolve(msg_return)
    }, (err) => {
      return Promise.reject(err)
    })
}

module.exports = {addTrigger, addWork, getNextTrigger, getNextWork}
