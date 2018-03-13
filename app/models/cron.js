const mongoose  = require('mongoose')
const Schema    = mongoose.Schema
const Trigger   = require('./trigger') // make sure model has been compiled

const CronSchema = new Schema({
  created: Date,
  updated: Date,
  nextFire: Date,
  trigger: {type: Schema.Types.ObjectId,
            ref: 'Trigger',
            required: true}
})

CronSchema.pre('init', function (next) {
  this.update({},{ $set: { updated: Date.now() } })
})

CronSchema.pre('save', function (next) {
  this.updated = Date.now()
  next()
})

CronSchema.pre('update', function() {
  this.update({},{ $set: { updated: Date.now() } })
})

module.exports = mongoose.model('Cron', CronSchema)
