export default class ReducerBase {
  constructor (actionType, initial) {
    this.actionType = actionType
    this.initial = initial ? initial : {
      loading: false,
      data: null,
      error: null,
    }
  }

  start (state) {
    return {
      ...state,
      loading: true,
    }
  }

  success (state, payload) {
    return {
      ...state,
      ...payload,
      loading: false,
    }
  }

  fail (state, payload) {
    return {
      ...state,
      ...payload,
      loading: false,
    }
  }

  reset () {
    return this.initial
  }

  reducer (state = this.initial, action) {
    const { type, payload } = action
    switch (type) {
      case this.actionType.start():
        return this.start(state)
      case this.actionType.success():
        return this.success(state, payload)
      case this.actionType.fail():
        return this.fail(state, payload)
      case this.actionType.reset():
        return this.reset()
      default:
        return state
    }
  }
}
