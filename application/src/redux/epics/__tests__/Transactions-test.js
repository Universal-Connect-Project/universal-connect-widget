jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'
import { from, of } from 'rxjs'
import { expectRx } from '../../../utils/Test'
import { StateObservable } from 'redux-observable'

import { ActionTypes } from '../../actions/Transactions'
import { ActionTypes as CategoryTotalsActionTypes } from '../../actions/CategoryTotals'
import * as epics from '../../epics/Transactions'

import { getDateRanges, normalizePage, normalizePages } from '../Transactions'
import { loadCategoryTotals } from '../../actions/CategoryTotals'

describe('Transactions Epics', () => {
  describe('.getDateRanges', () => {
    it('should return an empty array if dates are the same', () => {
      expect(
        getDateRanges({ startDate: 1, endDate: 2, storedStartDate: 1, storedEndDate: 2 }),
      ).toEqual([])
    })
    it('should return an array with new dates if storedDates are null', () => {
      expect(
        getDateRanges({ startDate: 1, endDate: 2, storedStartDate: null, storedEndDate: null }),
      ).toEqual([{ startDate: 1, endDate: 2 }])
    })
    it('should include new ranges if needed', () => {
      expect(
        getDateRanges({ startDate: 1, endDate: 4, storedStartDate: 2, storedEndDate: 3 }),
      ).toEqual([
        { startDate: 1, endDate: 2 },
        { startDate: 3, endDate: 4 },
      ])
    })
  })
  describe('.normalizePage', () => {
    it('should return an object with current value unwrapped and accumulated', () => {
      const acc = { 'TRN-123': { guid: 'TRN:123', amount: 50 } }
      const guid = 'TRN: 234'
      const current = { transaction: { guid, amount: -175 } }
      const result = { ...acc, [guid]: current.transaction }

      expect(normalizePage(acc, current)).toEqual(result)
    })
  })
  describe('.normalizePages', () => {
    it('should return an object with current value unwrapped and accumulated', () => {
      const acc = { 'TRN-123': { guid: 'TRN:123', amount: 50 } }
      const guid = 'TRN: 234'
      const current = { data: [{ transaction: { guid, amount: -175 } }] }
      const result = { ...acc, [guid]: current.data[0].transaction }

      expect(normalizePages(acc, current)).toEqual(result)
    })
  })
})

describe('load category totals', () => {
  const dateRange = { startDate: 300, endDate: 321 }
  const transactions = {
    items: [
      {
        guid: 'transaction_guid',
        category_guid: 'category_guid',
        is_hidden: false,
        amount: 50,
        date: 310,
      },
    ],
  }
  const state = {
    transactions,
    categoryTotals: {
      dateRange,
    },
  }

  const state$ = new StateObservable(of(state), state)

  state$.pipe = jest.fn(() => from([transactions.items, transactions.items]))

  describe('by default', () => {
    const item = null

    it('should load category totals on transaction delete', () => {
      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.TRANSACTION_DELETED, payload: { item } },
        })
        const output$ = epics.reloadCategoryTotalsOnTransactionChange(action$, state$)

        expectObservable(output$).toBe('a', {
          a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
        })
      })
    })

    it('should load category totals on transaction split', () => {
      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.TRANSACTION_SPLIT_CREATED, payload: { item } },
        })
        const output$ = epics.reloadCategoryTotalsOnTransactionChange(action$, state$)
        const { startDate, endDate } = dateRange

        expectObservable(output$).toBe('a', { a: loadCategoryTotals(startDate, endDate) })
      })
    })

    it('should load category totals on transaction split delete', () => {
      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.TRANSACTION_SPLIT_DELETED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals on manual transaction created', () => {
      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals when multiple transactions are updated', () => {
      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.TRANSACTIONS_UPDATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })
  })

  describe('on conditions of transaction update', () => {
    const item = {}

    beforeEach(() => {
      item.guid = 'transaction_guid'
      item.category_guid = 'category_guid'
      item.is_hidden = false
      item.amount = 50
      item.date = 310
    })

    it('should load category totals on transaction amount change', () => {
      expect.assertions(1)
      item.amount -= 10

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals on transaction category change', () => {
      expect.assertions(1)
      item.category_guid = 'diff_category_guid'

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals on transaction is_hidden change', () => {
      expect.assertions(1)
      item.is_hidden = true

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals on transaction date change (earlier)', () => {
      expect.assertions(1)
      item.date = dateRange.startDate - 10

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })

    it('should load category totals on transaction date change (later)', () => {
      expect.assertions(1)
      item.date = dateRange.endDate + 10

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED, payload: { item } },
        })

        expectObservable(epics.reloadCategoryTotalsOnTransactionChange(actions$, state$)).toBe(
          'a',
          {
            a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED },
          },
        )
      })
    })
  })
})

describe('create manual transaction', () => {
  const dateRange = { startDate: 300, endDate: 321 }
  const item = {
    guid: 'transaction_guid',
    category_guid: 'category_guid',
    is_hidden: false,
    amount: 50,
    date: 310,
    tags: [],
  }
  const state = {
    categoryTotals: {
      dateRange,
    },
  }
  const state$ = new StateObservable(of(state), state)

  it('should create a manual transaction', () => {
    expect.assertions(1)

    // FireflyAPI.createManualTransaction = jest.fn(() => of(item))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: { type: ActionTypes.CREATE_MANUAL_TRANSACTION, payload: item },
      })
      const ctx = {
        FireflyAPI: {
          createManualTransaction: () => of(item),
        },
      }

      expectObservable(epics.createManualTransaction(action$, state$, ctx)).toBe('a', {
        a: { type: ActionTypes.MANUAL_TRANSACTION_CREATED },
      })
    })
  })

  it('should not emit MANUAL_TRANSACTION_CREATED when out of date range', () => {
    expect.assertions(1)

    item.date = 290

    FireflyAPI.createManualTransaction = jest.fn(() => of(item))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: { type: ActionTypes.CREATE_MANUAL_TRANSACTION, payload: item },
      })
      const ctx = {
        FireflyAPI: {
          createManualTransaction: () => of(item),
        },
      }

      expectObservable(epics.createManualTransaction(action$, state$, ctx)).toBe('-')
    })
  })
})
