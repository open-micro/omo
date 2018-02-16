const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlueprintSchema = new Schema({
  created: Date,
  name: String,
  version: Number,
  tasks: []
})

BlueprintSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date
  next()
})

module.exports = mongoose.model('Blueprint', BlueprintSchema)
