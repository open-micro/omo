const mongoDbQueue  = require('mongodb-queue')
const config        = require('../../config/queue')
const QueueError    = require('../utils/errors').QueueError

var queue

var createQueue = (db) => {
  queue = mongoDbQueue(db, config.work_queue)
}

var addMessage = (msg) => {
  return new Promise((resolve, reject) => {
    if (!queue)
      return reject(new QueueError('queue not created'))
    queue.add(msg, function(err, id) {
      if (err)
        return reject(err)
      winston.info('Added msg to queue - id=' + id)
      return resolve(id)
    })
  })
}

var ackMessage = (msg_ack) => {
  if (!queue)
    return reject(new QueueError('queue not created'))
  return new Promise((resolve, reject) => {
    queue.ack(msg_ack, function(err, msg) {
      if (err)
        return reject(err)
      winston.info('acked message - id=' + msg.id)
      resolve(msg)
    })
  })
}

var getMessage = () => {
  if (!queue)
    return reject(new QueueError('queue not created'))
  return new Promise((resolve, reject) => {
    queue.get(msg, function(err, msg) {
      if (err)
        return reject(err)
      winston.info('got msg from queue - id=' + msg.id)
      resolve(msg)
    })
  })
}

var deleteAllMessages = (db) => {
    return db.collection(config.work_queue).remove()
}

module.exports = {
  createQueue: createQueue,
  addMessage: addMessage,
  getMessage: getMessage,
  ackMessage: ackMessage,
  deleteAllMessages: deleteAllMessages
}
