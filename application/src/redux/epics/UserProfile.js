import {
  ActionTypes,
  updateUserProfileSuccess,
  updateUserProfileError,
} from 'reduxify/actions/UserProfile'

import { defer } from 'rxjs'
import { map, mergeMap, catchError, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const updateUserProfile = (actions$, _, { connectAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_USER_PROFILE),
    pluck('payload'),
    mergeMap(userProfile =>
      defer(() => connectAPI.updateUserProfile(userProfile)).pipe(
        map(data => updateUserProfileSuccess(data)),
        catchError(err => updateUserProfileError(err)),
      ),
    ),
  )
