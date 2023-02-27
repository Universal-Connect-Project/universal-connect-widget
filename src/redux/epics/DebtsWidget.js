import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { itemAction } from '../../utils/ActionHelpers'

import { ActionTypes } from '../actions/DebtsWidget'

export const saveDebtForm = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.SAVE_DEBT_FORM, ActionTypes.UPDATE_AND_SAVE_DEBT),
    pluck('payload'),
    flatMap(debtForm =>
      from(FireflyAPI.updateGoal(debtForm)).pipe(
        pluck('goal'),
        map(goal => itemAction(ActionTypes.DEBT_FORM_SAVED, goal)),
        catchError(err => of({ type: ActionTypes.DEBT_FORM_SAVE_ERROR, payload: err })),
      ),
    ),
  )
