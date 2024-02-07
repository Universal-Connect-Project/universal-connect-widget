import { ActionTypes } from '../actions/UserCommunicationProfile'

import { defer, of } from 'rxjs'
import { map, catchError, pluck, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const updateUserCommunicationProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_USER_COMMUNICATION_PROFILE),
    pluck('payload'),
    mergeMap(userCommunicationProfile =>
      defer(() => FireflyAPI.updateUserCommunicationProfile(userCommunicationProfile)).pipe(
        map(res => ({
          type: ActionTypes.UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS,
          payload: res.data?.user_communication_profile,
        })),
        catchError(err =>
          of({ type: ActionTypes.UPDATE_USER_COMMUNICATION_PROFILE_ERROR, payload: err }),
        ),
      ),
    ),
  )
