import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { itemAction, setupAction } from '../../utils/ActionHelpers'

import { ActionTypes } from '../actions/GoalsWidget'
import FireflyAPI from '../../utils/FireflyAPI'

export const saveGoalForm = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.SAVE_GOAL_FORM, ActionTypes.UPDATE_AND_SAVE_GOAL),
    pluck('payload', 'item'),
    flatMap(goalForm =>
      from(FireflyAPI.updateGoal(goalForm)).pipe(
        pluck('goal'),
        map(goal => itemAction(ActionTypes.GOAL_FORM_SAVED, goal)),
        catchError(err => of(setupAction(ActionTypes.GOAL_FORM_SAVE_ERROR, err))),
      ),
    ),
  )

export const markGoalAsComplete = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.MARK_GOAL_AS_SPENT),
    pluck('payload'),
    flatMap(goal =>
      from(FireflyAPI.updateGoal({ ...goal, has_been_spent: true })).pipe(
        pluck('goal'),
        map(goal => itemAction(ActionTypes.MARK_GOAL_AS_SPENT_SUCCESS, goal)),
        catchError(err => of(setupAction(ActionTypes.MARK_GOAL_AS_SPENT_ERROR, err))),
      ),
    ),
  )
