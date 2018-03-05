const Instance = require('../models/instance')

const create = async (input) => {
    return await Instance.create(input)
}

const update = async (input) => {
  return await Instance.findOneAndUpdate({_id: input._id}, input)
}

const find = async (query, populate) => {
  query = query || {}
  var q = Instance.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Instance.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

module.exports = {create, update, find, findOne}
