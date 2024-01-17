import { ActionTypes } from 'reduxify/actions/User'

import { defer, of } from 'rxjs'
import { map, catchError, pluck, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const updateUser = (actions$, _, { connectAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_USER),
    pluck('payload'),
    mergeMap(user =>
      defer(() => connectAPI.updateUser(user)).pipe(
        map(user => ({ type: ActionTypes.UPDATE_USER_SUCCESS, payload: user })),
        catchError(err => of({ type: ActionTypes.UPDATE_USER_ERROR, payload: err })),
      ),
    ),
  )
