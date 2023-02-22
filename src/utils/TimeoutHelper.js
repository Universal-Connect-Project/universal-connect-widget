export default class TimeoutHelper {
  constructor(options) {
    // Times are in SECONDS
    const defaults = {
      timeout: 900,
      warningTime: 30,
      timeoutCallback: () => {},
      restartCallback: () => {},
      warningCallback: () => {},
    }

    this.options = Object.assign({}, defaults, options)
    this.timePassed = 0
  }

  start() {
    this._clearInterval()

    this.interval = setInterval(() => {
      this.timePassed++

      if (
        this.timePassed >= this.options.timeout &&
        !this.options.timeoutCallback._timerTriggered
      ) {
        this.options.timeoutCallback()
        this.options.timeoutCallback._timerTriggered = true
        this.stop()
      } else if (
        this.timePassed >= this.options.timeout - this.options.warningTime &&
        !this.options.warningCallback._timerTriggered
      ) {
        this.options.warningCallback()
        this.options.warningCallback._timerTriggered = true
      }
    }, 1000)
  }

  stop() {
    this.timePassed = 0
    this._clearInterval()
    this._resetCallbacks()
  }

  pause() {
    this._clearInterval()
  }

  resume() {
    this.start()
  }

  restart() {
    this.options.restartCallback()
    this.stop()
    this.start()
  }

  _clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  _resetCallbacks() {
    this.options.timeoutCallback._timerTriggered = false
    this.options.warningCallback._timerTriggered = false
  }
}
