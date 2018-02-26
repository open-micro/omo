const mongoose  = require('mongoose')
const Schema    = mongoose.Schema
const Trigger   = require('./trigger') // make sure model has been compiled

const CronSchema = new Schema({
  created: Date,
  updated: Date,
  nextFire: Date,
  trigger: {type: Schema.Types.ObjectId,
            ref: 'Trigger'}
})

CronSchema.pre('save', function (next) {
  let date = new Date()
  if (!this.created)
    this.created = date
  this.updated = date
  next()
})

module.exports = mongoose.model('Cron', CronSchema)
