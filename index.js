const util      = require('util')
const path      = require('path')
const fs        = require('fs')
const recurse   = require('recursive-readdir')
const jsonfile  = require('jsonfile')
const db        = require('./app/utils/db')
const queue     = require('./app/utils/queue')
const Blueprint = require('./app/dao/blueprint')
const Trigger   = require('./app/dao/trigger')
const Cron      = require('./app/dao/blueprint')
const Instance  = require('./app/dao/trigger')
const logger    = require('./app/utils/logger')('index')

var server

const load = async (loadDir) => {
  let dir = loadDir || path.join(process.cwd(), 'omo')

  try {
    let fileNames = await util.promisify(recurse)(dir)
    let readFile = util.promisify(jsonfile.readFile)
    fileNames.forEach(async (filename) => {
      if (filename.endsWith('.omo')) {
        logger.info('loading ' + filename)
        try {
          let obj = await readFile(filename)
          if (obj.model === 'blueprint') {
            await Blueprint.upsert(obj)
          } else if (obj.model === 'trigger') {
            await Trigger.upsert(obj)
          }
        } catch (err) {
          logger.error('Could not load file ' + filename + ': ' + err)
        }
      }
    })
  } catch (err) {
    logger.error('could not load omo files: ' + err)
  }
}

const run = async () => {
  server =  await require('./app')()
  if (process.env.TRUNCDB) {
    logger.info('Truncing DB and Queues')
    await truncDB()
  }
  if (process.env.AUTOLOAD) {
    logger.info('Loading OMO files')
    await load(process.env.AUTOLOAD_DIR)
  }

  return server
}

if ((process.env.NODE_ENV && process.env.NODE_ENV === 'PROD') || process.env.AUTO)
  run()

const truncDB = async () => {
  let db_con = await db.trunc()
  await queue.deleteAllMessages(db_con)
}

module.exports = { run,
                   truncDB }
