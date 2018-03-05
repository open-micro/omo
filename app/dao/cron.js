const Cron = require('../models/cron')

const create = async (input) => {
    return await Cron.create(input)
}

const update = async (input) => {
  return await Cron.findOneAndUpdate({_id: input._id}, input)
}

const upsert = async (input) => {
  let obj
  if (!(obj = await Cron.findOneAndUpdate({name: input.name}, input, {new: true})))
    obj = create(input)

  return obj
}

const find = async (query, populate) => {
  query = query || {}
  var q = Cron.find(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const findOne = async (query, populate) => {
  query = query || {}
  var q = Cron.findOne(query)
  if (populate)
    q.populate(populate)
  return await q.exec()
}

const remove = async (query) => {
  return await Cron.findOneAndRemove(query)
}

module.exports = {create, update, upsert, find, findOne, remove}
