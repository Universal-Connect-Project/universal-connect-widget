jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/CashFlow'
import { ActionTypes } from '../../actions/CashFlow'
import { loadCashFlowWidgetDataForDateRange } from '../../epics/CashFlow'

describe('Cash Flow Widget Epics', () => {
  describe('.loadCashFlowWidgetDataForDateRange', () => {
    it('should return data in format of "items', () => {
      expect.assertions(1)

      FireflyAPI.loadCashFlowWidgetDataForDateRange = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadCashFlowData({ accounts: {}, dateRange: {} }) })

        expectObservable(loadCashFlowWidgetDataForDateRange(input$, null, { FireflyAPI })).toBe(
          'a',
          {
            a: {
              type: ActionTypes.LOAD_CASH_FLOW_DATA_SUCCESS,
              // data should be under items sub index
              payload: { items: 'SUCCESS' },
            },
          },
        )
      })
    })
  })
})
