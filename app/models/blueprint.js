const mongoose  = require('mongoose')
const Schema    = mongoose.Schema
const Task      = require('./task')

const BlueprintSchema = new Schema({
  created: Date,
  updated: Date,
  name: { type: String, unique: true },
  version: {type: Number,
            required: false},
  triggerName: {type: String,
                required: false},
  tasks: [Schema.Types.Mixed]
})

BlueprintSchema.pre('save', function (next) {
  let date = new Date()
  if (!this.created)
    this.created = date
  this.updated = date
  next()
})

module.exports = mongoose.model('Blueprint', BlueprintSchema)
