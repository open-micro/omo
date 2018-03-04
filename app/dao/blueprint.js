const Blueprint = require('../models/blueprint')

const create = async (input) => {
    return await Blueprint.create(input)
}

const update = async (input) => {
  return await Blueprint.findOneAndUpdate({name: input.name}, input)
}

const find = async (query) => {
  query = query || {}
  return await Blueprint.find(query)
}

const findOne = async (query) => {
  query = query || {}
  return await Blueprint.findOne(query)
}

module.exports = {
  create: create,
  update: update,
  find: find,
  findOne: findOne
}
