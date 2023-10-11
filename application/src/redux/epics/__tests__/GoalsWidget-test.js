import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'
import { ActionTypes } from '../../actions/GoalsWidget'
import { saveGoalForm, markGoalAsComplete } from '../../epics/GoalsWidget'

describe('saveGoalForm', () => {
  afterEach(() => {
    FireflyAPI.updateGoal.mockReset()
  })

  it('should react to SAVE_GOAL_FORM and UPDATE_AND_SAVE_GOAL update the goal and emit GOAL_FORM_SAVED', () => {
    expect.assertions(3)
    const goal = { name: 'Vacation' }

    FireflyAPI.updateGoal = jest.fn(() => of({ goal }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.SAVE_GOAL_FORM, payload: { item: goal } },
      })

      expectObservable(saveGoalForm(actions$)).toBe('b', {
        b: { type: ActionTypes.GOAL_FORM_SAVED, payload: { item: goal } },
      })

      const updateActions$ = hot('a', {
        a: { type: ActionTypes.UPDATE_AND_SAVE_GOAL, payload: { item: goal } },
      })

      expectObservable(saveGoalForm(updateActions$)).toBe('b', {
        b: { type: ActionTypes.GOAL_FORM_SAVED, payload: { item: goal } },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalledWith(goal)
  })

  it('should handle errors from the API', () => {
    expect.assertions(2)
    const goal = { name: 'Vacation' }

    FireflyAPI.updateGoal = jest.fn(() => throwError('Oops!'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.SAVE_GOAL_FORM, payload: { item: goal } },
      })

      expectObservable(saveGoalForm(actions$)).toBe('b', {
        b: { type: ActionTypes.GOAL_FORM_SAVE_ERROR, payload: 'Oops!' },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalledWith(goal)
  })
})

describe('markGoalAsComplete', () => {
  afterEach(() => {
    FireflyAPI.updateGoal.mockReset()
  })
  const goal = { name: 'Vacation' }
  const updatedGoal = { ...goal, has_been_spent: true }

  it('should take a goal and set has_been_spent to true', () => {
    expect.assertions(2)
    FireflyAPI.updateGoal = jest.fn(() => of({ goal: updatedGoal }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.MARK_GOAL_AS_SPENT, payload: goal },
      })

      expectObservable(markGoalAsComplete(actions$)).toBe('b', {
        b: {
          type: ActionTypes.MARK_GOAL_AS_SPENT_SUCCESS,
          payload: { item: updatedGoal },
        },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalledWith(updatedGoal)
  })

  it('should handle an error from the api', () => {
    expect.assertions(2)

    FireflyAPI.updateGoal = jest.fn(() => throwError('Oops!'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.MARK_GOAL_AS_SPENT, payload: goal },
      })

      expectObservable(markGoalAsComplete(actions$)).toBe('b', {
        b: {
          type: ActionTypes.MARK_GOAL_AS_SPENT_ERROR,
          payload: 'Oops!',
        },
      })
    })

    expect(FireflyAPI.updateGoal).toHaveBeenCalledWith(updatedGoal)
  })
})
