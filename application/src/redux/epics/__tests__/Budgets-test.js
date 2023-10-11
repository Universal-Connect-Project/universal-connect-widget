jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'
import { StateObservable } from 'redux-observable'

import * as actions from '../../actions/Budgets'
import * as epics from '../../epics/Budgets'
import { ActionTypes } from '../../actions/Budgets'
import { ActionTypes as WidgetActionTypes } from '../../actions/BudgetsWidget'
import { ActionTypes as CategoryTotalsActionTypes } from '../../actions/CategoryTotals'

import { Guid } from '../../../constants/Category'
import Store from '../../Store'

describe('A budget', () => {
  let state = {}

  beforeEach(() => {
    state = Store.getState()
  })

  afterEach(() => {
    FireflyAPI.loadBudgets.mockReset()
    FireflyAPI.saveBudget.mockReset()
  })

  it('should emit budgets success', () => {
    expect.assertions(2)
    FireflyAPI.loadBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchBudgets() })

      expectObservable(epics.loadBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_LOADED },
      })
    })

    expect(FireflyAPI.loadBudgets).toHaveBeenCalled()
  })

  it('should emit budgets error', () => {
    expect.assertions(2)
    FireflyAPI.loadBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchBudgets() })

      expectObservable(epics.loadBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_LOADED_ERROR },
      })
    })

    expect(FireflyAPI.loadBudgets).toHaveBeenCalled()
  })

  it('should save', () => {
    expect.assertions(2)
    FireflyAPI.saveBudget = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveBudget({}) })

      expectObservable(epics.saveBudget(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGET_SAVED },
      })
    })

    expect(FireflyAPI.saveBudget).toHaveBeenCalled()
  })

  it('should try to save', () => {
    expect.assertions(2)
    FireflyAPI.saveBudget = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveBudget({}) })

      expectObservable(epics.saveBudget(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGET_SAVE_ERROR },
      })
    })

    expect(FireflyAPI.saveBudget).toHaveBeenCalled()
  })

  it('should delete', () => {
    const ctx = { FireflyAPI: { deleteBudget: () => of('SUCCESS') } }

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudget({}) })

      expectObservable(epics.deleteBudget(input$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.BUDGET_DELETED },
      })
    })
  })

  it('should try to delete', () => {
    const ctx = { FireflyAPI: { deleteBudget: () => throwError('FAIL') } }

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudget({}) })

      expectObservable(epics.deleteBudget(input$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.BUDGET_DELETED_ERROR },
      })
    })
  })

  it('should reset UI tracking vars after delete', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: { type: ActionTypes.BUDGET_DELETED } })
      const store$ = { value: state }

      store$.value.budgets = {
        items: [{ category_guid: Guid.INCOME }],
        generated: false,
      }

      const output$ = epics.clearOrReset(actions$, store$)

      expectObservable(output$).toBe('a', {
        a: { type: WidgetActionTypes.RESET_BUDGET },
      })
    })
  })

  it('should clear and reset UI tracking vars after delete', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: { type: ActionTypes.BUDGET_DELETED } })
      const store$ = { value: state }

      store$.value.budgets = {
        items: [{ category_guid: Guid.INCOME }],
        generated: true,
      }

      const output$ = epics.clearOrReset(actions$, store$)

      expectObservable(output$).toBe('(ab)', {
        a: { type: ActionTypes.BUDGET_GENERATION_CLEARED },
        b: { type: WidgetActionTypes.RESET_BUDGET },
      })
    })
  })
})

describe('A list of budgets', () => {
  afterEach(() => {
    FireflyAPI.deleteBudgets.mockReset()
    FireflyAPI.saveBudgets.mockReset()
  })

  it('should save', () => {
    expect.assertions(2)
    FireflyAPI.saveBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveBudgets({}) })

      expectObservable(epics.saveBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_SAVED },
      })
    })

    expect(FireflyAPI.saveBudgets).toHaveBeenCalled()
  })

  it('should try to save', () => {
    expect.assertions(2)
    FireflyAPI.saveBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveBudgets({}) })

      expectObservable(epics.saveBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_SAVE_ERROR },
      })
    })

    expect(FireflyAPI.saveBudgets).toHaveBeenCalled()
  })

  it('should delete', () => {
    expect.assertions(2)
    FireflyAPI.deleteBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudgets({}) })

      expectObservable(epics.deleteBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_DELETED_SUCCESS },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
  })

  it('should try to delete', () => {
    expect.assertions(2)
    FireflyAPI.deleteBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudgets({}) })

      expectObservable(epics.deleteBudgets(input$)).toBe('a', {
        a: { type: ActionTypes.BUDGETS_DELETED_ERROR },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
  })

  it('should delete budgets then generate budgets', () => {
    expect.assertions(3)
    FireflyAPI.deleteBudgets = jest.fn(() => of('SUCCESS'))
    FireflyAPI.generateBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudgetsThenGenerate({}) })
      const output$ = epics.deleteBudgetsThenGenerate(input$)

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_DELETED_THEN_GENERATED_SUCCESS },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
    expect(FireflyAPI.generateBudgets).toHaveBeenCalled()
  })

  it('should try to delete budgets then generate budgets', () => {
    expect.assertions(2)
    FireflyAPI.deleteBudgets = jest.fn(() => throwError('FAIL'))
    FireflyAPI.generateBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudgetsThenGenerate({}) })
      const output$ = epics.deleteBudgetsThenGenerate(input$)

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_DELETED_THEN_GENERATED_ERROR },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
  })

  it('should delete budgets then try to generate budgets', () => {
    expect.assertions(3)
    FireflyAPI.deleteBudgets = jest.fn(() => of('SUCCESS'))
    FireflyAPI.generateBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.deleteBudgetsThenGenerate({}) })
      const output$ = epics.deleteBudgetsThenGenerate(input$)

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_DELETED_THEN_GENERATED_ERROR },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
    expect(FireflyAPI.generateBudgets).toHaveBeenCalled()
  })
})

describe('Generating a budget', () => {
  let state = {}

  beforeEach(() => {
    state = Store.getState()
  })

  afterEach(() => {
    FireflyAPI.generateBudgets.mockReset()
  })

  it('should generate budgets', () => {
    expect.assertions(2)
    FireflyAPI.generateBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.generateBudgets() })
      const output$ = epics.generateBudgets(input$)

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_GENERATED },
      })
    })

    expect(FireflyAPI.generateBudgets).toHaveBeenCalled()
  })

  it('should try to generate budgets', () => {
    expect.assertions(2)
    FireflyAPI.generateBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.generateBudgets() })
      const output$ = epics.generateBudgets(input$)

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_GENERATED_ERROR },
      })
    })

    expect(FireflyAPI.generateBudgets).toHaveBeenCalled()
  })

  it('should save and then recalculate budgets', () => {
    expect.assertions(2)
    FireflyAPI.deleteBudgets = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveRecalculatedBudgets() })
      const output$ = epics.saveRecalculatedBudgets(input$, { value: state })

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_SAVE },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
  })

  it('should try to save and then recalculate budgets', () => {
    expect.assertions(2)
    FireflyAPI.deleteBudgets = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.saveRecalculatedBudgets() })
      const output$ = epics.saveRecalculatedBudgets(input$, { value: state })

      expectObservable(output$).toBe('a', {
        a: { type: ActionTypes.BUDGETS_SAVE_RECALCULATED_ERROR },
      })
    })

    expect(FireflyAPI.deleteBudgets).toHaveBeenCalled()
  })
})

describe('update budget being viewed', () => {
  const state = Store.getState()

  state.budgetsWidget = {
    budgetBeingViewed: {
      guid: 'budget_guid',
      category_guid: 'category_guid',
    },
  }
  const state$ = new StateObservable(of(state), state)

  it('should update when the budgetBeingViewed is not empty', () => {
    expect.assertions(1)
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: { type: CategoryTotalsActionTypes.CATEGORY_TOTALS_LOADED },
      })
      const output$ = epics.updateBudgetBeingViewed(action$, state$)

      expectObservable(output$).toBe('a', {
        a: {
          type: WidgetActionTypes.VIEW_BUDGET,
        },
      })
    })
  })
})
