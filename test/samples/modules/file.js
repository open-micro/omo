const jsonfile      = require('jsonfile')
const util          = require('util')
const { promisify } = require('util')

myOMOFunc = async (omoContext) => {
  const write = promisify(jsonfile.writeFile)

  return new Promise((resolve, reject) => {
    write('/tmp/foo.bar', {foo: 'bar'}).then(() => {
      console.log('file module wrote file /tmp/foo.bar')
      resolve({global: {file: '/tmp/foo.bar'}})
    }, (err) => {
      console.log('file module error writing file /tmp/foo.bar: ' + util.inspect(err))
      resolve({status: 'error'})
    })
  })
}

module.exports = myOMOFunc
