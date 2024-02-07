import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import FireflyAPI from '../../utils/FireflyAPI'
import { itemsAction, itemAction } from '../../utils/ActionHelpers'

import { ActionTypes } from '../actions/Goals'

export const fetchGoals = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.GOALS_LOAD),
    flatMap(() =>
      from(FireflyAPI.loadGoals()).pipe(
        map(({ goals }) => itemsAction(ActionTypes.GOALS_LOADED, goals)),
        catchError(err => of({ type: ActionTypes.GOALS_LOADED_ERROR, payload: err })),
      ),
    ),
  )

export const fetchCreateGoal = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.GOAL_CREATE),
    pluck('payload'),
    flatMap(({ goal }) =>
      from(FireflyAPI.createGoal(goal)).pipe(
        map(({ goal }) => itemAction(ActionTypes.GOAL_CREATED, goal)),
        catchError(err => of({ type: ActionTypes.GOAL_CREATED_ERROR, payload: err })),
      ),
    ),
  )

export const fetchDeleteGoal = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.GOAL_DELETE),
    pluck('payload', 'goal'),
    flatMap(goal =>
      from(FireflyAPI.deleteGoal(goal)).pipe(
        map(() => itemAction(ActionTypes.GOAL_DELETED, goal)),
        catchError(err => of({ type: ActionTypes.GOAL_DELETED_ERROR, payload: err })),
      ),
    ),
  )

export const fetchRepositionGoals = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.REPOSITION_GOALS),
    pluck('payload'),
    flatMap(({ goals }) =>
      from(FireflyAPI.repositionGoals(goals)).pipe(
        map(({ goals }) => itemsAction(ActionTypes.REPOSITION_GOALS_SUCCESS, goals)),
        catchError(error => of({ type: ActionTypes.GOALS_LOAD, error })),
      ),
    ),
  )

export const fetchUpdateGoal = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.GOAL_UPDATE),
    pluck('payload'),
    flatMap(({ goal }) =>
      from(FireflyAPI.updateGoal(goal)).pipe(
        map(({ goal }) => itemAction(ActionTypes.GOAL_UPDATED, goal)),
        catchError(error => of({ type: ActionTypes.GOALS_LOAD, error })),
      ),
    ),
  )
