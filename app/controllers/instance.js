const router = require('express').Router()
const Instance = require('../models/instance')

module.exports = (app) => {
  app.use('/', router)
}

router.get('/', (req, res, next) => {
  Instance.find((err, intances) => {
    if (err) return next(err)
    res.json(instances)
  })
})
