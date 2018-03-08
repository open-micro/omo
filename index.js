const util      = require('util')
const path      = require('path')
const fs        = require('fs')
const recurse   = require('recursive-readdir')
const jsonfile  = require('jsonfile')
const Blueprint = require('./app/dao/blueprint')
const Trigger   = require('./app/dao/trigger')
const logger    = require('./app/utils/logger')('index')

const load = async (loadDir) => {
  console.log(1111)
  let dir = loadDir || path.join(process.cwd(), 'omo')

  try {
    let fileNames = await util.promisify(recurse)(dir)
    logger.debug('loading ' + fileNames.length + ' omo files')
    let readFile = util.promisify(jsonfile.readFile)
    fileNames.forEach(async (filename) => {
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
    })
  } catch (err) {
    logger.error('could not load omo files: ' + err)
  }
}

const run = async () => {
  let server =  await require('./app')()

  if (process.env.AUTOLOAD) {
    await load(process.env.AUTOLOAD_DIR)
    return server
  } else {
    return server
  }
}

run()
