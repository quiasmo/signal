import _ from "lodash"
import observable from "riot-observable"

export default class Track {
  constructor() {
    this.events = []
    this.lastEventId = 0
    observable(this)
  }

  setName(name) {
    const e = this.findTrackNameEvents()[0]
    this.updateEvent(e.id, {
      value: name
    })
  }

  getName() {
    const e = this.findTrackNameEvents()[0]
    return e && e.text || ""
  }

  getEndOfTrack() {
    return this.endOfTrack
  }

  getEvents() {
    return this.events
  }

  getEventById(id) {
    for (const e of this.events) {
      if (e.id == id) {
        return e
      }
    }
    return null
  }

  updateEvent(id, obj) {
    const anObj = this.getEventById(id)
    if (_.isEqual(Object.assign({}, anObj, obj), anObj)) {
      return
    }
    _.extend(anObj, obj)
    this.emitChange()
    return anObj
  }

  removeEvent(id) {
    const obj = this.getEventById(id)
    _.pull(this.events, obj)
    this.emitChange()
  }

  addEvent(e) {
    if (e.tick === undefined) {
      const lastEvent = this.getEventById(this.lastEventId)
      e.tick = e.deltaTime + (lastEvent ? lastEvent.tick : 0)
    }
    e.id = this.lastEventId
    if (e.type == "channel" && e.channel === undefined) {
      e.channel = this.channel
    }
    this.events.push(e)
    this.lastEventId++
    this.emitChange()
    return e
  }

  transaction(func) {
    this._paused = true
    this._changed = false
    func(this)
    this._paused = false
    if (this._changed) {
      this.emitChange()
    }
  }

  emitChange() {
    this._changed = true
    if (!this._paused) { 
      this.trigger("change")
    }
  }

  /* helper */

  findTrackNameEvents() {
    return this.events.filter(t => t.subtype == "trackName")
  }

  findProgramChangeEvents() {
    return this.events.filter(t => t.subtype == "programChange")
  }

  findVolumeEvents() {
    return this.events.filter(t => t.subtype == "controller" && t.controllerType == 7)
  }

  findPanEvents() {
    return this.events.filter(t => t.subtype == "controller" && t.controllerType == 10)
  }
}