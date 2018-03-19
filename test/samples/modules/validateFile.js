const jsonfile      = require('jsonfile')
const util          = require('util')
const { promisify } = require('util')

module.exports = async (omoContext) => {
  const read = promisify(jsonfile.readFile)
  let file = omoContext.global.file

  return new Promise((resolve, reject) => {
    read(file).then((obj) => {
      console.log('validateFile module read file ' + file + ': ' + util.inspect(obj))
      resolve()
    }, (err) => {
      console.log('validateFile module error reading file ' + file + ': ' + util.inspect(err))
      resolve({status: 'error'})
    })
  })
}
