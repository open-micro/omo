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
    if (req.body.auto) {
      req.body.started = true
    }
    let trigger = await Trigger.create(req.body)
    if (trigger.auto) {
      await workClient.addTrigger(trigger)
    }
    res.status(200).json(trigger)
  } catch (err) {
    next(err)
  }
})

router.post('/name/:name/start', async (req, res, next) => {
  try {
    let trigger = await Trigger.findOneAndUpdate({name: req.params.name}, {started: true}, {new: true})
    let work_status = await workClient.addTrigger(trigger)
    res.status(200).json({msgId: work_status})
  } catch (err) {
    next(err)
  }
})

router.post('/name/:name/stop', async (req, res, next) => {
  try {
    let trigger = await Trigger.findOneAndUpdate({name: req.params.name}, {started: false}, {new: true})
    let work_status = await workClient.addTrigger(trigger)
    res.status(200).json({msgId: work_status})
  } catch (err) {
    next(err)
  }

  router.put('/', async (req, res, next) => {
    try {
      if (req.body.auto) {
        req.body.started = true
      }
      let trigger = await Trigger.findOneAndUpdate({name: req.body.name}, req.body)
      if (trigger.auto) {
        await workClient.addTrigger(trigger)
      }
      res.status(200).json(trigger)
    } catch (err) {
      next(err)
    }
  })
})
