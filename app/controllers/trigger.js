const router                        = require('express').Router()
const {create, update,
        startByName, stopByName,
        find, findOne}              = require('../dao/trigger')

module.exports = (app) => {
  app.use('/trigger', router);
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
    res.json(await findOne({name: req.params.name}));
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

router.post('/name/:name/start', async (req, res, next) => {
  try {
    res.status(200).json(await startByName(req.params.name))
  } catch (err) {
    next(err)
  }
})

router.post('/name/:name/stop', async (req, res, next) => {
  try {
    res.status(200).json(await stopByName(req.params.name))
  } catch (err) {
    next(err)
  }

  router.put('/', async (req, res, next) => {
    try {
      res.status(200).json(await update(req.body))
    } catch (err) {
      next(err)
    }
  })
})
