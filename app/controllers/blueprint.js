const router                             = require('express').Router()
const {create, update, find, findOne}    = require('../dao/blueprint')

module.exports = (app) => {
  app.use('/blueprint', router)
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await find());
  } catch (err) {
    next(err)
  }
})

router.get('/name/:name', async (req, res, next) => {
  try {
    res.json(await findOne({name: req.params.name}))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    res.status(200).json(await create(req.body))
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    res.status(200).json(await update(req.body))
  } catch (err) {
    next(err)
  }
})
