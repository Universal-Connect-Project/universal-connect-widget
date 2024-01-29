import {
  ActionTypes,
  updateUserProfileSuccess,
  updateUserProfileError,
} from '../actions/UserProfile'

import { defer } from 'rxjs'
import { map, mergeMap, catchError, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const updateUserProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_USER_PROFILE),
    pluck('payload'),
    mergeMap(userProfile =>
      defer(() => FireflyAPI.updateUserProfile(userProfile)).pipe(
        map(data => updateUserProfileSuccess(data)),
        catchError(err => updateUserProfileError(err)),
      ),
    ),
  )
