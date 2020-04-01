class ActionType {
  constructor(base) {
    this.base = base
  }

  start() {
    return `${this.base}:START`
  }

  success() {
    return `${this.base}:SUCCESS`
  }

  fail() {
    return `${this.base}:FAIL`
  }

  progressing() {
    return `${this.base}:PROGRESSING`
  }

  finished() {
    return `${this.base}:FINISHED`
  }

  reset() {
    return `${this.base}:RESET`
  }

  custom(type) {
    return `${this.base}:${type}`
  }
}

export default ActionType
