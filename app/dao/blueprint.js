const Blueprint = require('../models/blueprint')

const create = async (input) => {
  return await Blueprint.create(input)
}

const update = async (input) => {
  return await Blueprint.findOneAndUpdate({name: input.name}, input)
}

const upsert = async (input) => {
  let obj
  if (!(obj = await Blueprint.findOneAndUpdate({name: input.name}, input, {new: true})))
    obj = create(input)

  return obj
}

const find = async (query, populate) => {
  query = query || {}
  var q = Blueprint.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Blueprint.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

module.exports = {create, update, upsert, find, findOne}