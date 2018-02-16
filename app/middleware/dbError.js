const MongoError  = require('../utils/errors').MongoError

module.exports = (error, req, res, next) => {
  if (error instanceof MongoError) {
    return res.status(503).json({
      type: 'MongoError',
      message: error.message
    })
  }
  next(error)
}
