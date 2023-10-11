jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/CashFlowWidget'
import { ActionTypes } from '../../actions/CashFlowWidget'
import { markAsPaid, skipEvent } from '../../epics/CashFlowWidget'

describe('Cash Flow Widget Epics', () => {
  describe('.markAsPaid', () => {
    it('should emit MARK_EVENT_AS_PAID_SUCCESS', () => {
      expect.assertions(2)

      FireflyAPI.createCashflowEvent = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.markAsPaid({}) })

        expectObservable(markAsPaid(input$)).toBe('a', {
          a: { type: ActionTypes.MARK_EVENT_AS_PAID_SUCCESS },
        })
      })

      expect(FireflyAPI.createCashflowEvent).toHaveBeenCalled()
    })

    it('should emit MARK_EVENT_AS_PAID_ERROR', () => {
      expect.assertions(2)

      FireflyAPI.createCashflowEvent = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.markAsPaid({}) })

        expectObservable(markAsPaid(input$)).toBe('a', {
          a: { type: ActionTypes.MARK_EVENT_AS_PAID_ERROR },
        })
      })

      expect(FireflyAPI.createCashflowEvent).toHaveBeenCalled()
    })
  })

  describe('.skipEvent', () => {
    it('should emit SKIP_EVENT_SUCCESS', () => {
      expect.assertions(2)

      FireflyAPI.createCashflowEvent = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.skipEvent({}) })

        expectObservable(skipEvent(input$)).toBe('a', {
          a: { type: ActionTypes.SKIP_EVENT_SUCCESS },
        })
      })

      expect(FireflyAPI.createCashflowEvent).toHaveBeenCalled()
    })

    it('should emit SKIP_EVENT_ERROR', () => {
      expect.assertions(2)

      FireflyAPI.createCashflowEvent = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.skipEvent({}) })

        expectObservable(skipEvent(input$)).toBe('a', {
          a: { type: ActionTypes.SKIP_EVENT_ERROR },
        })
      })

      expect(FireflyAPI.createCashflowEvent).toHaveBeenCalled()
    })
  })
})
