import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/Notifications'
import FireflyAPI from '../../utils/FireflyAPI'

export const loadNotifications = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.NOTIFICATIONS_LOADING),
    flatMap(() =>
      from(FireflyAPI.loadNotifications()).pipe(
        map(items => ({ type: ActionTypes.NOTIFICATIONS_LOADED, payload: { items } })),
        catchError(err => {
          return of({
            type: ActionTypes.NOTIFICATIONS_LOADED_ERROR,
            payload: {
              loadingError: err,
            },
          })
        }),
      ),
    ),
  )

export const markAllNotificationsAsRead = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.MARK_ALL_NOTIFICATIONS_AS_READ),
    flatMap(() =>
      from(FireflyAPI.markAllNotificationsAsRead()).pipe(
        map(() => ({ type: ActionTypes.ALL_NOTIFICATIONS_MARKED_AS_READ })),
        catchError(err => {
          return of({ type: ActionTypes.MARK_ALL_NOTIFICATIONS_AS_READ_ERROR, payload: err })
        }),
      ),
    ),
  )

export const saveNotification = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.SAVE_NOTIFICATION),
    pluck('payload'),
    flatMap(notification =>
      from(FireflyAPI.saveNotification(notification)).pipe(
        map(notification => ({
          type: ActionTypes.NOTIFICATION_SAVED,
          payload: { item: notification },
        })),
        catchError(err => {
          return of({ type: ActionTypes.NOTIFICATION_SAVE_ERROR, payload: err })
        }),
      ),
    ),
  )
