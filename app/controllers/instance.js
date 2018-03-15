const router                             = require('express').Router()
const { create,
        update,
        remove,
        find,
        findOne }    = require('../dao/instance')

module.exports = (app) => {
  app.use('/instance', router)
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await find({}, 'blueprint'))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await findOne({_id: req.params.id}, 'blueprint'))
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    res.json(await remove({_id: req.params.id}))
  } catch (err) {
    next(err)
  }
})

router.delete('/all/done', async (req, res, next) => {
  try {
    res.json(await remove({status: 'done'}))
  } catch (err) {
    next(err)
  }
})

router.get('/blueprint/:id', async (req, res, next) => {
  try {
    res.json(await find({blueprint: req.params.id}))
  } catch (err) {
    next(err)
  }
})

router.get('/error/all', async (req, res, next) => {
  try {
    res.json(await find({status: 'error'}))
  } catch (err) {
    next(err)
  }
})
