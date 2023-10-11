import { of, throwError } from 'rxjs'

import { ActionTypes as SpendingActions } from '../../actions/Spending'
import * as epics from '../../epics/SpendingWidget'
import { receiveCategoryTotals, loadCategoryTotalsError } from '../../actions/CategoryTotals'
import FireflyAPI from '../../../utils/FireflyAPI'
import { expectRx } from '../../../utils/Test'

jest.mock('utils/FireflyAPI')

describe('getCategoryTotalsByAccounts', () => {
  const state = {
    value: {
      accounts: {
        filter: {
          applied: ['ACT-1'],
          options: ['ACT-1'],
        },
      },
      categoryTotals: {
        dateRange: {
          endDate: 1554767999,
          startDate: 1552176000,
        },
      },
    },
  }

  afterEach(() => {
    FireflyAPI.loadCategoryTotalsByAccount.mockReset()
  })

  it('should call receiveCategoryTotals on success', () => {
    expect.assertions(1)
    FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => of('something'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a-b', {
        a: { type: SpendingActions.APPLY_SPENDING_ACCOUNT_FILTER },
        b: { type: SpendingActions.RELOAD_CATEGORY_TOTALS },
      })
      const dateRange = state.value.categoryTotals.dateRange

      expectObservable(epics.getCategoryTotalsByAccounts(actions$, state)).toBe('a-a', {
        a: receiveCategoryTotals('something', dateRange.startDate, dateRange.endDate),
      })
    })
  })

  it('should call loadCategoryTotalsError if the request fails', () => {
    expect.assertions(1)
    FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => throwError('something'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a-b', {
        a: { type: SpendingActions.APPLY_SPENDING_ACCOUNT_FILTER },
        b: { type: SpendingActions.RELOAD_CATEGORY_TOTALS },
      })

      expectObservable(epics.getCategoryTotalsByAccounts(actions$, state)).toBe('a-a', {
        a: loadCategoryTotalsError('something'),
      })
    })
  })
})
