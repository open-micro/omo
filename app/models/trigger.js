const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Cron = require('./cron')

const TriggerSchema = new Schema({
  model: {
     type: String,
     required: true,
     enum: ['trigger', 'Trigger']
  },
  created: { type: Date, default: Date.now },
  updated: Date,
  name: { type: String, unique: true },
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
  auto: {
     type: Boolean,
     default: false
  },
  lastFired: Date,
  cron: {type: Schema.Types.ObjectId,
            ref: 'Cron'}
})

TriggerSchema.pre('init', function (next) {
  this.update({},{ $set: { updated: Date.now() } })
})

TriggerSchema.pre('save', function (next) {
  this.updated = Date.now()
  next()
})

TriggerSchema.pre('update', function() {
  this.update({},{ $set: { updated: Date.now() } })
})

module.exports = mongoose.model('Trigger', TriggerSchema)
