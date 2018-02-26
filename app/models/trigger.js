const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TriggerSchema = new Schema({
  created: Date,
  updated: Date,
  name: String,
  version: {
     type: Number,
     required: false
  },
  type: {
     type: String,
     enum: ['cron', 'date']
  },
  config: String,
  started: {
     type: Boolean,
     default: false
  },
  lastFired: Date
})

TriggerSchema.pre('save', function (next) {
  let date = new Date()
  if (!this.created)
    this.created = date
  this.updated = date
  next()
})

module.exports = mongoose.model('Trigger', TriggerSchema)
