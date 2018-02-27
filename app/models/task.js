const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  created: Date,
  updated: Date,
  name: {type: String,
            required: true},
  version: {type: Number,
            required: false},
  type: {
     type: String,
     enum: ['exec', 'log']
  },
  config: {type: Schema.Types.Mixed,
            required: false}
})

TaskSchema.pre('save', function (next) {
  let date = new Date()
  if (!this.created)
    this.created = date
  this.updated = date
  next()
})

module.exports = mongoose.model('Task', TaskSchema)
