import { of, defer } from 'rxjs'
import { catchError, map, pluck, mergeMapTo, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/NotificationProfile'

export const loadNotificationProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_NOTIFICATION_PROFILES),
    mergeMapTo(
      defer(() => FireflyAPI.loadNotificationProfiles()).pipe(
        map(profiles => ({
          type: ActionTypes.LOAD_NOTIFICATION_PROFILES_SUCCESS,
          payload: { profiles },
        })),
        catchError(err => {
          return of({ type: ActionTypes.LOAD_NOTIFICATION_PROFILES_ERROR, payload: err })
        }),
      ),
    ),
  )

export const editNotificationProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.EDIT_NOTIFICATION_PROFILE),
    pluck('payload'),
    mergeMap(({ profile }) =>
      defer(() => FireflyAPI.editNotificationProfile(profile)).pipe(
        map(profile => ({
          type: ActionTypes.EDIT_NOTIFICATION_PROFILE_SUCCESS,
          payload: { profile },
        })),
        catchError(err => {
          return of({ type: ActionTypes.EDIT_NOTIFICATION_PROFILE_ERROR, payload: err })
        }),
      ),
    ),
  )
