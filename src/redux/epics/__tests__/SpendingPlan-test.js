import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import * as epics from '../../epics/SpendingPlan'
import { ActionTypes } from '../../actions/SpendingPlan'

jest.mock('utils/FireflyAPI')

describe('spending plan epics', () => {
  describe('loadSpendingPlan', () => {
    it('should emit load spending plan success', () => {
      FireflyAPI.fetchSpendingPlan = jest.fn(() => of({ spending_plan: { guid: 'SPL-1' } }))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: { type: ActionTypes.LOAD_SPENDING_PLAN, payload: { guid: 'SPL-1' } },
        })
        const output$ = epics.loadSpendingPlan(input$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_SUCCESS,
            payload: { spending_plan: { guid: 'SPL-1' } },
          },
        })
      })
    })

    it('should emit load spending plan error', () => {
      FireflyAPI.fetchSpendingPlan = jest.fn(() => throwError('spending plan error'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: { type: ActionTypes.LOAD_SPENDING_PLAN, payload: { guid: 'SPL-1' } },
        })
        const output$ = epics.loadSpendingPlan(input$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_ERROR,
            payload: 'spending plan error',
          },
        })
      })
    })
  })

  describe('loadSpendingPlans', () => {
    it('should emit load spending plans success', () => {
      FireflyAPI.fetchSpendingPlans = jest.fn(() => of([{ spending_plan: { guid: 'SPL-1' } }]))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: { type: ActionTypes.LOAD_SPENDING_PLANS },
        })
        const output$ = epics.loadSpendingPlans(input$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLANS_SUCCESS,
            payload: [{ spending_plan: { guid: 'SPL-1' } }],
          },
        })
      })
    })

    it('should emit load spending plans error', () => {
      FireflyAPI.fetchSpendingPlans = jest.fn(() => throwError('spending plans error'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: { type: ActionTypes.LOAD_SPENDING_PLANS },
        })
        const output$ = epics.loadSpendingPlans(input$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLANS_ERROR,
            payload: 'spending plans error',
          },
        })
      })
    })
  })

  describe('loadSpendingPlanIteration', () => {
    const state$ = {
      value: {
        spendingPlan: {
          currentSpendingPlan: {
            guid: 'SPL-1',
            current_iteration_number: 2,
          },
        },
      },
    }

    it('should emit load spending plan iteration success', () => {
      FireflyAPI.fetchSpendingPlanIteration = jest.fn(() =>
        of({ spending_plan_iteration: { guid: 'SPI-1' } }),
      )

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          },
        })
        const output$ = epics.loadSpendingPlanIteration(input$, state$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION_SUCCESS,
            payload: { spending_plan_iteration: { guid: 'SPI-1' } },
          },
        })
      })
    })

    it('should emit load spending plan iteration error', () => {
      FireflyAPI.fetchSpendingPlanIteration = jest.fn(() =>
        throwError('spending plan iteration error'),
      )

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          },
        })
        const output$ = epics.loadSpendingPlanIteration(input$, state$)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION_ERROR,
            payload: 'spending plan iteration error',
          },
        })
      })
    })
  })
})
