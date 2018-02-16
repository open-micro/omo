const router = require('express').Router()
const Blueprint = require('../models/blueprint')

module.exports = (app) => {
  app.use('/', router)
}

router.get('/', (req, res, next) => {
  Blueprint.find((err, blueprints) => {
    if (err) return next(err);
    res.json(blueprints);
  })
})
