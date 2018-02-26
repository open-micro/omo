const mongoose    = require('mongoose')
const Schema      = mongoose.Schema
const Blueprint   = require('./blueprint') // make sure model has been compiled

const InstanceSchema = new Schema({
  created: Date,
  updated: Date,
  currentStep: {type: Number,
                default: 0},
  blueprint: {type: Schema.Types.ObjectId,
            ref: 'Blueprint'},
  initialContext: {type: Schema.Types.Mixed,
                    default: {}
                  },
  global: {type: Schema.Types.Mixed,
            default: {}
          },
  taskResults: [Schema.Types.Mixed]
})

InstanceSchema.pre('save', function (next) {
  let date = new Date()
  if (!this.created)
    this.created = date
  this.updated = date
  next()
})

module.exports = mongoose.model('Instance', InstanceSchema)
