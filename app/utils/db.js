const mongoose  = require('./mongoose')
const config    = require('../../config/config')

var db

const connect = () => {
  if (!db) {
    return mongoose.connect(config.db).then(() => {
      return Promise.resolve(db = mongoose.connection)
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(db)
    })
  }
}

module.exports = {
  connect: connect
}
