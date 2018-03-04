const Instance = require('../models/instance')

const create = async (input) => {
    return await Instance.create(input)
}

const update = async (input) => {
  return await Instance.findOneAndUpdate({_id: input._id}, input)
}

const find = async (query) => {
  query = query || {}
  return await Instance.find(query)
}

const findOne = async (query) => {
  query = query || {}
  return await Instance.findOne(query)
}

module.exports = {
  create: create,
  update: update,
  find: find,
  findOne: findOne
}
