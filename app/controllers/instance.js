const router = require('express').Router()
const Instance = require('../models/instance')

module.exports = (app) => {
  app.use('/instance', router)
}

router.get('/', async (req, res, next) => {
  try {
    let instances = await Instance.find()
    res.json(instances);
  } catch (err) {
    next(err)
  }
})

router.get('/blueprint/:id', async (req, res, next) => {
  try {
    let instances = await Instance.find({blueprint: req.params.id})
    res.json(instances);
  } catch (err) {
    next(err)
  }
})

router.get('/error', async (req, res, next) => {
  try {
    let instances = await Instance.find({status: 'error'})
    res.json(instances);
  } catch (err) {
    next(err)
  }
})
