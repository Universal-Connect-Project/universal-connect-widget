jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import { ActionTypes } from '../../actions/Goals'
import * as actions from '../../actions/Goals'
import * as epics from '../../epics/Goals'

describe('A Goal', () => {
  it('should fetch goals', () => {
    expect.assertions(2)
    FireflyAPI.loadGoals = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchGoals() })

      expectObservable(epics.fetchGoals(input$)).toBe('a', {
        a: { type: ActionTypes.GOALS_LOADED },
      })
    })

    expect(FireflyAPI.loadGoals).toHaveBeenCalled()
    FireflyAPI.loadGoals.mockClear()
  })

  it('should emit fetch goal error', () => {
    expect.assertions(2)
    FireflyAPI.loadGoals = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchGoals() })

      expectObservable(epics.fetchGoals(input$)).toBe('a', {
        a: { type: ActionTypes.GOALS_LOADED_ERROR },
      })
    })

    expect(FireflyAPI.loadGoals).toHaveBeenCalled()
    FireflyAPI.loadGoals.mockClear()
  })

  it('should create a goal', () => {
    expect.assertions(2)
    FireflyAPI.createGoal = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchCreateGoal({}) })

      expectObservable(epics.fetchCreateGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOAL_CREATED },
      })
    })

    expect(FireflyAPI.createGoal).toHaveBeenCalled()
    FireflyAPI.createGoal.mockClear()
  })

  it('should try to create a goal', () => {
    expect.assertions(2)
    FireflyAPI.createGoal = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchCreateGoal({}) })

      expectObservable(epics.fetchCreateGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOAL_CREATED_ERROR },
      })
    })

    expect(FireflyAPI.createGoal).toHaveBeenCalled()
    FireflyAPI.createGoal.mockClear()
  })

  it('should delete a goal', () => {
    expect.assertions(2)
    FireflyAPI.deleteGoal = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchDeleteGoal({}) })

      expectObservable(epics.fetchDeleteGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOAL_DELETED },
      })
    })

    expect(FireflyAPI.deleteGoal).toHaveBeenCalled()
    FireflyAPI.deleteGoal.mockClear()
  })

  it('should try to delete a goal', () => {
    expect.assertions(2)
    FireflyAPI.deleteGoal = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchDeleteGoal({}) })

      expectObservable(epics.fetchDeleteGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOAL_DELETED_ERROR },
      })
    })

    expect(FireflyAPI.deleteGoal).toHaveBeenCalled()
    FireflyAPI.deleteGoal.mockClear()
  })

  it('should update a goal', () => {
    expect.assertions(2)
    FireflyAPI.updateGoal = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchUpdateGoal({}) })

      expectObservable(epics.fetchUpdateGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOAL_UPDATED },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalled()
    FireflyAPI.updateGoal.mockClear()
  })

  it('should try to fetch goals when update fails', () => {
    expect.assertions(2)
    FireflyAPI.updateGoal = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchUpdateGoal({}) })

      expectObservable(epics.fetchUpdateGoal(input$)).toBe('a', {
        a: { type: ActionTypes.GOALS_LOAD },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalled()
    FireflyAPI.updateGoal.mockClear()
  })

  it('should update new goals positions', () => {
    expect.assertions(2)
    FireflyAPI.repositionGoals = jest.fn(() => of('SUCCESS'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchRepositionGoals({}) })

      expectObservable(epics.fetchRepositionGoals(input$)).toBe('a', {
        a: { type: ActionTypes.REPOSITION_GOALS_SUCCESS },
      })
    })

    expect(FireflyAPI.repositionGoals).toHaveBeenCalled()
    FireflyAPI.repositionGoals.mockClear()
  })

  it('should try fetch goals if update new goals positions fails', () => {
    expect.assertions(2)
    FireflyAPI.repositionGoals = jest.fn(() => throwError('FAIL'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const input$ = hot('a', { a: actions.fetchRepositionGoals({}) })

      expectObservable(epics.fetchRepositionGoals(input$)).toBe('a', {
        a: { type: ActionTypes.GOALS_LOAD },
      })
    })

    expect(FireflyAPI.repositionGoals).toHaveBeenCalled()
    FireflyAPI.repositionGoals.mockClear()
  })
})
