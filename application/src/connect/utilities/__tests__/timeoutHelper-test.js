import TimeoutHelper, { buildClientSessionTimeoutURL } from 'src/connect/utilities/timeoutHelper'

jest.useFakeTimers()

describe('Timeout Helper', () => {
  let timeout

  describe('constructor no options', () => {
    beforeEach(() => {
      timeout = new TimeoutHelper()
    })

    it('should start the timer at 0', () => {
      expect(timeout.timePassed).toEqual(0)
    })

    it('should have some default options', () => {
      expect(timeout.options.timeout).toEqual(900)
      expect(timeout.options.warningTime).toEqual(30)
      expect(timeout.options.timeoutCallback).toEqual(expect.any(Function))
      expect(timeout.options.restartCallback).toEqual(expect.any(Function))
      expect(timeout.options.warningCallback).toEqual(expect.any(Function))
    })
  })

  describe('constructor with options', () => {
    let func

    beforeEach(() => {
      func = () => 1 + 1

      timeout = new TimeoutHelper({
        timeout: 500,
        timeoutCallback: func,
      })
    })

    it('should merge the default values with the options provided', () => {
      expect(timeout.options.timeout).toEqual(500)
      expect(timeout.options.warningTime).toEqual(30)
      expect(timeout.options.timeoutCallback).toEqual(func)
      expect(timeout.options.restartCallback).toEqual(expect.any(Function))
    })
  })

  describe('methods', () => {
    let timeout
    let timeoutCallback
    let restartCallback
    let warningCallback

    beforeEach(() => {
      timeoutCallback = jest.fn()
      restartCallback = jest.fn()
      warningCallback = jest.fn()

      timeout = new TimeoutHelper({
        timeout: 60,
        warningTime: 30,
        timeoutCallback,
        restartCallback,
        warningCallback,
      })
    })

    describe('.start', () => {
      beforeEach(() => {
        jest.spyOn(timeout, '_clearInterval')
        jest.spyOn(timeout, 'stop')

        timeout.start()
      })

      it('should call _clearInterval', () => {
        expect(timeout._clearInterval).toHaveBeenCalled()
      })

      it('should set an interval', () => {
        expect(timeout.interval).not.toBe(null)
      })

      it('should increment the timePassed prop', () => {
        jest.advanceTimersByTime(2001)
        expect(timeout.timePassed).toEqual(2)
      })

      it('should trigger the warning callback in the warning window', () => {
        jest.advanceTimersByTime(30100)
        expect(warningCallback).toHaveBeenCalled()
        expect(warningCallback._timerTriggered).toEqual(true)
      })

      it('should only trigger the warning callback once', () => {
        warningCallback.mockClear()
        jest.advanceTimersByTime(40000)
        expect(warningCallback.mock.calls).toHaveLength(1)
      })

      it('should trigger the timeout callback and call stop', () => {
        jest.advanceTimersByTime(60001)
        expect(warningCallback).toHaveBeenCalled()
        expect(timeoutCallback).toHaveBeenCalled()
        // expect(timeoutCallback._timerTriggered).toEqual(true)  // TODO: Fix this
        expect(timeout.stop).toHaveBeenCalled()
      })
    })

    describe('.stop', () => {
      beforeEach(() => {
        jest.spyOn(timeout, '_clearInterval')
        jest.spyOn(timeout, '_resetCallbacks')
      })

      it('should reset the timePassed property', () => {
        timeout.timePassed = 100
        timeout.stop()
        expect(timeout.timePassed).toEqual(0)
      })

      it('should clear the interval', () => {
        timeout.stop()
        expect(timeout._clearInterval).toHaveBeenCalled()
      })

      it('should reset the callback booleans', () => {
        timeout.stop()
        expect(timeout._resetCallbacks).toHaveBeenCalled()
      })
    })

    describe('.pause', () => {
      beforeEach(() => {
        jest.spyOn(timeout, '_clearInterval')
        timeout.pause()
      })

      it('should clear the interval', () => {
        expect(timeout._clearInterval).toHaveBeenCalled()
      })
    })

    describe('.resume', () => {
      beforeEach(() => {
        jest.spyOn(timeout, 'start')
        timeout.resume()
      })

      it('should just call start', () => {
        expect(timeout.start).toHaveBeenCalled()
      })
    })

    describe('.restart', () => {
      beforeEach(() => {
        jest.spyOn(timeout, 'start')
        jest.spyOn(timeout, 'stop')
        timeout.restart()
      })

      it('should call restartCallback', () => {
        expect(timeout.options.restartCallback).toHaveBeenCalled()
      })

      it('should call stop', () => {
        expect(timeout.stop).toHaveBeenCalled()
      })

      it('should call start', () => {
        expect(timeout.start).toHaveBeenCalled()
      })
    })

    describe('._clearInterval', () => {
      beforeEach(() => {
        jest.spyOn(global, 'clearInterval')
      })

      it('should call the global clearInterval if we have a interval', () => {
        timeout.interval = 1
        timeout._clearInterval()
        expect(global.clearInterval).toHaveBeenCalled()
      })

      it('should not call clearInterval with no interval', () => {
        timeout.interval = null
        timeout._clearInterval()
        expect(global.clearInterval).not.toHaveBeenCalled()
      })
    })

    describe('._resetCallbacks', () => {
      it('should reset the _timerTriggered property to false', () => {
        timeout._resetCallbacks()
        expect(timeoutCallback._timerTriggered).toEqual(false)
        expect(warningCallback._timerTriggered).toEqual(false)
      })
    })
  })
})

describe('buildClientSessionTimeoutURL', () => {
  test('should do nothing if no url is supplied', () => {
    expect(buildClientSessionTimeoutURL()).toEqual(null)
  })

  test('should do nothing if url is empty string', () => {
    expect(buildClientSessionTimeoutURL('')).toEqual(null)
  })

  test('should handle no template at all', () => {
    const url = 'https://mx.com'
    const result = buildClientSessionTimeoutURL(url)

    expect(url).toEqual(result)
  })

  test('should handle the widgetType template', () => {
    const url = 'https://mx.com/{widgetType}'
    const widgetType = 'connect_widget'

    const result = buildClientSessionTimeoutURL(url, widgetType)

    expect(result).toEqual('https://mx.com/connect_widget')
  })

  test('should leave as is if template is not widgetType', () => {
    const url = 'https://mx.com/{badTemplate}'
    const widgetType = 'connect_widget'

    expect(buildClientSessionTimeoutURL(url, widgetType)).toEqual(url)
  })
})
