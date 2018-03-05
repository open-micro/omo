const util      = require('util')
const path      = require('path')
const fs        = require('fs')
const recurse   = require('recursive-readdir')
const jsonfile  = require('jsonfile')
const Blueprint = require('./app/dao/blueprint')
const Trigger   = require('./app/dao/trigger')
const logger    = require('./app/utils/logger')('index')

const start = async (autoLoad) => {

  let server =  await require('./app')()

  if (autoLoad) {
    let fileNames = await util.promisify(recurse)(path.join(process.cwd(), 'omo'))
    logger.debug('processing ' + fileNames.length + ' files')
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
  }

  return server
}

module.exports = {start}
