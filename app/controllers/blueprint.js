const router = require('express').Router()
const Blueprint = require('../models/blueprint')

module.exports = (app) => {
  app.use('/blueprint', router)
}

router.get('/', async (req, res, next) => {
  try {
    let blueprints = await Blueprint.find()
    res.json(blueprints);
  } catch (err) {
    next(err)
  }
})

router.get('/name/:name', async (req, res, next) => {
  try {
    let blueprint = await Blueprint.findOne({name: req.params.name})
    res.json(blueprint);
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    let created = await Blueprint.create(req.body)
    res.status(200).json(created)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    await Blueprint.update(req.body)
    let updated = await Blueprint.findOne({name: req.body.name})
    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
})
