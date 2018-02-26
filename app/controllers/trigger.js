const router      = require('express').Router()
const Trigger     = require('../models/trigger')
const workClient  = require('../utils/work')
const MongoError  = require('../utils/errors').MongoError

module.exports = (app) => {
  app.use('/trigger', router);
}

router.get('/', async (req, res, next) => {
  try {
    let triggers = await Trigger.find()
    res.json(triggers);
  } catch (err) {
    next(err)
  }
})

router.get('/name/:name', async (req, res, next) => {
  try {
    let trigger = await Trigger.findOne({name: req.params.name})
    res.json(trigger);
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await Trigger.create(req.body)
    res.status(200).json({})
  } catch (err) {
    next(err)
  }
})

router.post('/name/:name/start', async (req, res, next) => {
  try {
    let trigger = await Trigger.findOneAndUpdate({name: req.params.name}, {started: true})
    let work_status = await workClient.addTrigger(trigger)
    res.status(200).json({msgId: work_status})
  } catch (err) {
    next(err)
  }
})

router.post('/name/:name/stop', async (req, res, next) => {
  try {
    let trigger = await Trigger.findOneAndUpdate({name: req.params.name}, {started: false})
    let work_status = await workClient.addTrigger(trigger)
    res.status(200).json({msgId: work_status})
  } catch (err) {
    next(err)
  }
})
