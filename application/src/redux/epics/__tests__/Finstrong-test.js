jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import * as epics from '../../epics/Finstrong'
import { ActionTypes } from '../../actions/Finstrong'

describe('A user', () => {
  it('should emit peer score success', () => {
    expect.assertions(2)
    FireflyAPI.fetchPeerScore = jest.fn(() =>
      of({ average_health_score: { average_health_score: 50 } }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_PEER_SCORE } })
      const output$ = epics.fetchPeerScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_PEER_SCORE_SUCCESS,
          payload: { average_health_score: { average_health_score: 50 } },
        },
      })
    })

    expect(FireflyAPI.fetchPeerScore).toHaveBeenCalled()
  })

  it('should emit peer score failure', () => {
    expect.assertions(2)
    FireflyAPI.fetchPeerScore = jest.fn(() => throwError({ message: 'you had an error' }))
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_PEER_SCORE } })
      const output$ = epics.fetchPeerScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_PEER_SCORE_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchPeerScore).toHaveBeenCalled()
  })
})

describe('fetchAverageHealthScores epic', () => {
  it('should emit average health scores success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchAverageHealthScores = jest.fn(() => of({ average_health_scores: [1, 2, 3, 4] }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES } })
      const output$ = epics.fetchAverageHealthScores(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES_SUCCESS,
          payload: { average_health_scores: [1, 2, 3, 4] },
        },
      })
    })

    expect(FireflyAPI.fetchAverageHealthScores).toHaveBeenCalled()
  })

  it('should emit average health scores error', () => {
    expect.assertions(2)
    FireflyAPI.fetchAverageHealthScores = jest.fn(() => throwError({ message: 'you had an error' }))
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES } })
      const output$ = epics.fetchAverageHealthScores(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })
    expect(FireflyAPI.fetchAverageHealthScores).toHaveBeenCalled()
  })
})

describe('fetchHealthScore', () => {
  it('should emit fetch health score success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchHealthScore = jest.fn(() =>
      of({
        healthScore: 75,
      }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_HEALTH_SCORE } })
      const output$ = epics.fetchHealthScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_HEALTH_SCORE_SUCCESS,
          payload: { healthScore: 75 },
        },
      })
    })

    expect(FireflyAPI.fetchHealthScore).toHaveBeenCalled()
  })

  it('should emit a fetch health score failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchHealthScore = jest.fn(() => throwError({ message: 'you had an error' }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_HEALTH_SCORE } })
      const output$ = epics.fetchHealthScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_HEALTH_SCORE_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchHealthScore).toHaveBeenCalled()
  })
})

describe('calculateHealthScore', () => {
  it('should emit healthscore success', () => {
    expect.assertions(2)
    FireflyAPI.calculateHealthScore = jest.fn(() => of({ health_score: { health_score: 50 } }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.CALCULATE_HEALTH_SCORE } })
      const output$ = epics.calculateHealthScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.CALCULATE_HEALTH_SCORE_SUCCESS,
          payload: { health_score: { health_score: 50 } },
        },
      })
    })

    expect(FireflyAPI.calculateHealthScore).toHaveBeenCalled()
  })

  it('should emit healthscore failure', () => {
    expect.assertions(2)
    FireflyAPI.calculateHealthScore = jest.fn(() => throwError({ message: 'you had an error' }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.CALCULATE_HEALTH_SCORE } })
      const output$ = epics.calculateHealthScore(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.CALCULATE_HEALTH_SCORE_ERROR,
        },
      })
    })

    expect(FireflyAPI.calculateHealthScore).toHaveBeenCalled()
  })
})

describe('fetchDebtSpendTransactions', () => {
  it('should emit fetch debt spend transactions success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchDebtSpendTransactions = jest.fn(() =>
      of([
        { guid: 'TRN-1', amount: 10 },
        { guid: 'TRN-2', amount: 20 },
      ]),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS } })
      const output$ = epics.fetchDebtSpendTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS,
          payload: [
            { guid: 'TRN-1', amount: 10 },
            { guid: 'TRN-2', amount: 20 },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchDebtSpendTransactions).toHaveBeenCalled()
  })

  it('should emit a fetch debt spend transactions failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchDebtSpendTransactions = jest.fn(() =>
      throwError({ message: 'you had an error' }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS } })
      const output$ = epics.fetchDebtSpendTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchDebtSpendTransactions).toHaveBeenCalled()
  })
})

describe('fetchStandardSpendTransactions', () => {
  it('should emit fetch standard spend transactions success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchStandardSpendTransactions = jest.fn(() =>
      of([
        { guid: 'TRN-1', amount: 10 },
        { guid: 'TRN-2', amount: 20 },
      ]),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS } })
      const output$ = epics.fetchStandardSpendTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS,
          payload: [
            { guid: 'TRN-1', amount: 10 },
            { guid: 'TRN-2', amount: 20 },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchStandardSpendTransactions).toHaveBeenCalled()
  })

  it('should emit a fetch standard spend transactions failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchStandardSpendTransactions = jest.fn(() =>
      throwError({ message: 'you had an error' }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS } })
      const output$ = epics.fetchStandardSpendTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchStandardSpendTransactions).toHaveBeenCalled()
  })
})

describe('fetchSpendingFeeTransactions', () => {
  it('should emit fetch spending fee transactions success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchSpendingFeeTransactions = jest.fn(() =>
      of([
        { guid: 'TRN-1', amount: 10 },
        { guid: 'TRN-2', amount: 20 },
      ]),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS } })
      const output$ = epics.fetchSpendingFeeTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS,
          payload: [
            { guid: 'TRN-1', amount: 10 },
            { guid: 'TRN-2', amount: 20 },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchSpendingFeeTransactions).toHaveBeenCalled()
  })

  it('should emit a fetch spending fee transactions failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchSpendingFeeTransactions = jest.fn(() =>
      throwError({ message: 'you had an error' }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS } })
      const output$ = epics.fetchSpendingFeeTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchSpendingFeeTransactions).toHaveBeenCalled()
  })
})

describe('fetchIncomeTransactions', () => {
  it('should emit fetch income transactions success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchIncomeTransactions = jest.fn(() =>
      of([
        { guid: 'TRN-1', amount: 10 },
        { guid: 'TRN-2', amount: 20 },
      ]),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_INCOME_TRANSACTIONS } })
      const output$ = epics.fetchIncomeTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_INCOME_TRANSACTIONS_SUCCESS,
          payload: [
            { guid: 'TRN-1', amount: 10 },
            { guid: 'TRN-2', amount: 20 },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchIncomeTransactions).toHaveBeenCalled()
  })

  it('should emit a fetch income transactions failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchIncomeTransactions = jest.fn(() => throwError({ message: 'you had an error' }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_INCOME_TRANSACTIONS } })
      const output$ = epics.fetchIncomeTransactions(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_INCOME_TRANSACTIONS_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchIncomeTransactions).toHaveBeenCalled()
  })
})

describe('fetchMonthylHealthScoreSummaries', () => {
  it('should emit fetch monthly health score summaries success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchMonthlyHealthScoreSummaries = jest.fn(() => {
      return of([
        {
          user_guid: 'USR-1eb418f0-523b-4fe3-977b-4f95b72d6941',
          year: 2020,
          month: 8,
          standard_spend: 452.05,
          debt_spend: 0.0,
          income: 111.61,
          available_cash: 259998.0,
          debt_balance: 4540.0,
        },
      ])
    })

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES } })
      const output$ = epics.fetchMonthlyHealthScoreSummaries(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS,
          payload: [
            {
              user_guid: 'USR-1eb418f0-523b-4fe3-977b-4f95b72d6941',
              year: 2020,
              month: 8,
              standard_spend: 452.05,
              debt_spend: 0.0,
              income: 111.61,
              available_cash: 259998.0,
              debt_balance: 4540.0,
            },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchMonthlyHealthScoreSummaries).toHaveBeenCalled()
  })

  it('should emit a fetch monthly health score summaries failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchMonthlyHealthScoreSummaries = jest.fn(() =>
      throwError({ message: 'you had an error' }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES } })
      const output$ = epics.fetchMonthlyHealthScoreSummaries(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchIncomeTransactions).toHaveBeenCalled()
  })
})

describe('fetchHealthScoreChangeReports', () => {
  it('should emit fetch health score report success action', () => {
    expect.assertions(2)
    FireflyAPI.fetchHealthScoreChangeReports = jest.fn(() => {
      return of([
        {
          user_guid: 'USR-123',
          older_health_score_guid: 'HSC-123',
          newer_health_score_guid: 'HSC-321',
          older_health_score: 72,
          newer_health_score: 72,
        },
      ])
    })

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS } })
      const output$ = epics.fetchHealthScoreChangeReports(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS,
          payload: [
            {
              user_guid: 'USR-123',
              older_health_score_guid: 'HSC-123',
              newer_health_score_guid: 'HSC-321',
              older_health_score: 72,
              newer_health_score: 72,
            },
          ],
        },
      })
    })

    expect(FireflyAPI.fetchMonthlyHealthScoreSummaries).toHaveBeenCalled()
  })

  it('should emit a fetch health score change report failure action', () => {
    expect.assertions(2)
    FireflyAPI.fetchHealthScoreChangeReports = jest.fn(() =>
      throwError({ message: 'you had an error' }),
    )

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: { type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS } })
      const output$ = epics.fetchHealthScoreChangeReports(input$)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR,
          payload: { message: 'you had an error' },
        },
      })
    })

    expect(FireflyAPI.fetchIncomeTransactions).toHaveBeenCalled()
  })
})
