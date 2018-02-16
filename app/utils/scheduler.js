const heartbeats  = require('heartbeats')
const winston     = require('winston')

var heart

const start = (interval) => {
  heart = heartbeats.createHeart(interval); // beat interval
}

const stop = () => {
  heart.kill()
}

const schedule = (beat_interval, fn) => {
  heart.createEvent(beat_interval, fn)
}

module.exports = {
  start: start,
  stop: stop,
  schedule: schedule
}
