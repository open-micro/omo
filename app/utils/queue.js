const util          = require('util')
const mongoDbQueue  = require('mongodb-queue')
const logger        = require('./logger')('queue')
const queueConfig   = require('../../config/queue')
const QueueError    = require('../utils/errors').QueueError

var queues = Object.keys(queueConfig).reduce((obj, name) => {
  obj[name] = null
  return obj
}, {})

var createQueue = (db, name) => {
  logger.info('Creating queue ' + name)
  queues[name] = mongoDbQueue(db, name)
}

var createAllQueues = (db) => {
    for (let name of Object.keys(queueConfig)) {
      createQueue(db, queueConfig[name])
    }
}

var addMessage = (queue_name, msg) => {
  return new Promise((resolve, reject) => {
    if (!queues[queue_name]) {
      return reject(new QueueError('queue not created'))
    }
    queues[queue_name].add(msg, function(err, id) {
      if (err)
        return reject(err)
      logger.debug('Added msg to queue - ' + queue_name)
      logger.debug(util.inspect(msg))
      resolve(id)
    })
  })
}

var ackMessage = (queue_name, msg_ack) => {
  if (!queues[queue_name])
    return reject(new QueueError('queue not created'))
  return new Promise((resolve, reject) => {
    queues[queue_name].ack(msg_ack, function(err, msg_id) {
      if (err)
        return reject(err)
      logger.debug('acked message - id=' + msg_id)
      resolve(msg_id)
    })
  })
}

var pingMessage = (queue_name, msg_ack) => {
  if (!queues[queue_name])
    return reject(new QueueError('queue not created'))
  return new Promise((resolve, reject) => {
    queues[queue_name].ping(msg_ack, function(err, msg_id) {
      if (err)
        return reject(err)
      logger.debug('ping message - id=' + msg_id)
      resolve(msg_id)
    })
  })
}

var getMessage = (queue_name) => {
  if (!queues[queue_name])
    return reject(new QueueError('queue not created'))
  return new Promise((resolve, reject) => {
    queues[queue_name].get(function(err, msg) {
      if (err)
        return reject(err)
      resolve(msg)
    })
  })
}

var deleteAllMessages = async (db) => {
    for (let name of Object.keys(queueConfig))
      await db.collection(queueConfig[name]).remove()
    return Promise.resolve()
}

module.exports = {
  createQueue: createQueue,
  createAllQueues: createAllQueues,
  addMessage: addMessage,
  getMessage: getMessage,
  ackMessage: ackMessage,
  pingMessage: pingMessage,
  deleteAllMessages: deleteAllMessages
}
