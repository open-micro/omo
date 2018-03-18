const instanceError = (instance, err) => {
  if (!instance.taskResults)
    instance.taskResults = []
  instance.taskResults.push({})
  instance.status = 'error'
  //instance.error = err
}

module.exports = { instanceError }
