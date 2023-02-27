jest.mock('utils/FireflyAPI')
jest.mock('reduxify/selectors/Accounts')
import FireflyAPI from '../../../utils/FireflyAPI'
import * as AccountSelectors from '../../selectors/Accounts'

import { expectRx } from '../../../utils/Test'

import {
  ActionTypes,
  receiveCategoryTotals,
  loadCategoryTotalsError,
} from 'reduxify/actions/CategoryTotals'
import * as epics from '../../epics/CategoryTotals'
import { of, throwError } from 'rxjs'

import { getCategoryTotalsAndMonthlyCategoryTotalsByAccounts } from '../../epics/CategoryTotals'
import { ActionTypes as AccountsActionTypes } from '../../actions/Accounts'
import { loadTotalsError, receiveTotals } from '../../actions/CategoryTotals'

describe('Load Category Totals', () => {
  const dateRange = {
    startDate: 300,
    endDate: 321,
  }
  const categoryTotals = [
    {
      guid: '123',
    },
  ]

  describe('.loadCategoryTotals', () => {
    it('should load category totals', () => {
      FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => of(categoryTotals))
      AccountSelectors.getAccountFilterAppliedGuids = jest.fn(() => [])
      const payload = { dateRange }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED, payload },
        })
        const output$ = epics.loadCategoryTotals(action$, {})

        expectObservable(output$).toBe('a', {
          a: receiveCategoryTotals(categoryTotals, dateRange.startDate, dateRange.endDate),
        })
      })
    })

    it('should throw an error when category totals is not an array', () => {
      FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => of({}))
      AccountSelectors.getAccountFilterAppliedGuids = jest.fn(() => [])
      const payload = { dateRange }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED, payload },
        })
        const output$ = epics.loadCategoryTotals(action$, {})

        expectObservable(output$).toBe('a', {
          a: { type: ActionTypes.CATEGORY_TOTALS_LOAD_ERROR },
        })
      })
    })

    it('should should throw an error trying to get category totals', () => {
      FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => throwError('FAIL'))
      AccountSelectors.getAccountFilterAppliedGuids = jest.fn(() => [])
      const payload = { dateRange }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED, payload },
        })
        const output$ = epics.loadCategoryTotals(action$, {})

        expectObservable(output$).toBe('a', {
          a: loadCategoryTotalsError('FAIL'),
        })
      })
    })
  })
})

describe('apply account filter and load totals', () => {
  describe('getCategoryTotalsAndMonthlyCategoryTotalsByAccounts', () => {
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
      FireflyAPI.loadMonthlyCategoryTotalsByAccount.mockReset()
    })

    it('should call receiveTotals on success', () => {
      expect.assertions(1)
      FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => of([{ guid: '123' }]))
      FireflyAPI.loadMonthlyCategoryTotalsByAccount = jest.fn(() =>
        of({ monthly_category_totals: [{ guid: '456' }] }),
      )

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: AccountsActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS },
        })

        expectObservable(getCategoryTotalsAndMonthlyCategoryTotalsByAccounts(actions$, state)).toBe(
          'a',
          {
            a: receiveTotals([{ guid: '123' }], [{ guid: '456' }]),
          },
        )
      })
    })

    it('should call loadTotalsError if one of the request fails', () => {
      expect.assertions(1)
      FireflyAPI.loadCategoryTotalsByAccount = jest.fn(() => throwError('something'))
      FireflyAPI.loadMonthlyCategoryTotalsByAccount = jest.fn(() =>
        of({ monthly_category_totals: [{ guid: '456' }] }),
      )

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: AccountsActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS },
        })

        expectObservable(getCategoryTotalsAndMonthlyCategoryTotalsByAccounts(actions$, state)).toBe(
          'a',
          {
            a: loadTotalsError('something'),
          },
        )
      })
    })
  })
})
