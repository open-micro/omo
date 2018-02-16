const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InstanceSchema = new Schema({
  created: Date,
  currentStep: Number,
  initialContext: Schema.Types.Mixed,
  global: Schema.Types.Mixed
})

InstanceSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date
  next()
})

module.exports = mongoose.model('Instance', InstanceSchema)
