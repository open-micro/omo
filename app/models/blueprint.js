const mongoose  = require('mongoose')
const Schema    = mongoose.Schema
const Task      = require('./task')

const BlueprintSchema = new Schema({
  model: {
     type: String,
     required: true,
     enum: ['blueprint', 'Blueprint']
  },
  created: { type: Date, default: Date.now },
  updated: Date,
  name: { type: String, unique: true },
  version: {type: Number,
            required: false},
  triggerName: {type: String,
                required: false},
  tasks: [Schema.Types.Mixed]
})

BlueprintSchema.pre('init', function (next) {
  this.update({},{ $set: { updated: Date.now() } })
})

BlueprintSchema.pre('save', function (next) {
  this.updated = Date.now()
  next()
})

BlueprintSchema.pre('update', function() {
  this.update({},{ $set: { updated: Date.now() } })
})

module.exports = mongoose.model('Blueprint', BlueprintSchema)
