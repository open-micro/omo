const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TriggerSchema = new Schema({
  created: Date,
  name: String,
  version: {
     type: Number,
     required: false
  },
  type: {
     type: String,
     enum: ['cron']
  },
  config: String,
  started: {
     type: Boolean,
     default: false
  },
  lastFired: Date
})

TriggerSchema.pre('save', function (next) {
  if (!this.created)
    this.created = new Date
  next()
})

module.exports = mongoose.model('Trigger', TriggerSchema)
