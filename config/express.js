const express         = require('express')
const glob            = require('glob')
const favicon         = require('serve-favicon')
const logger          = require('morgan')
const cookieParser    = require('cookie-parser')
const bodyParser      = require('body-parser')
const compress        = require('compression')
const dbErrorHandler  = require('../app/middleware/dbError')

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development'
  app.locals.ENV = env
  app.locals.ENV_DEVELOPMENT = env == 'development'

  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  // app.use(favicon(config.root + '/public/img/favicon.ico'))
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(cookieParser())
  app.use(compress())
  app.use(express.static(config.root + '/public'))

  // controllers
  var controllers = glob.sync(config.root + '/app/controllers/*.js')
  controllers.forEach((controller) => {
    require(controller)(app)
  })

  // resource not found
  app.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handlers
  app.use(dbErrorHandler)
  app.use((err, req, res, next) => {
    console.log(err.message)
    res.status(err.status || 500)
    res.json({
      message: err.message
    })
  })

  return app
}
