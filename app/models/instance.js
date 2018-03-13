const mongoose    = require('mongoose')
const Schema      = mongoose.Schema

const InstanceSchema = new Schema({
  created: { type: Date, default: Date.now },
  updated: Date,
  currentStep: {type: Number,
                default: 0},
  status: {
     type: String,
     enum: ['ready', 'processing', 'detached', 'error', 'done'],
     default: 'ready'
  },
  blueprint: {type: Schema.Types.ObjectId,
              ref: 'Blueprint'},
  initialContext: {type: Schema.Types.Mixed,
                    default: {}
                  },
  global: {type: Schema.Types.Mixed,
            default: {}
          },
  taskResults: [Schema.Types.Mixed],
  error: String,
  nextCheck: Date
})

InstanceSchema.pre('init', function (next) {
  this.update({},{ $set: { updated: Date.now() } })
})

InstanceSchema.pre('save', function (next) {
  this.updated = Date.now()
  next()
})

InstanceSchema.pre('update', function() {
  this.update({},{ $set: { updated: Date.now() } })
})

module.exports = mongoose.model('Instance', InstanceSchema)
