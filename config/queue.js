const work_queue = process.env.OMO_WORK_QUEUE || 'OmoWorkQueue'
const trigger_queue = process.env.OMO_TRIGGER_QUEUE || 'OmoTriggerQueue'

module.exports = {
  work_queue: work_queue,
  trigger_queue: trigger_queue
}
