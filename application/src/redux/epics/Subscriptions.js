import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/Subscriptions'

export const fetchSubscriptionsByDateRange = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.SUBSCRIPTIONS_LOADING),
    pluck('payload'),
    flatMap(({ startDate, endDate }) =>
      from(FireflyAPI.loadSubscriptionsByDateRange(startDate, endDate)).pipe(
        map(items => ({ type: ActionTypes.SUBSCRIPTIONS_LOADED, payload: { items } })),
        catchError(err => {
          return of({ type: ActionTypes.SUBSCRIPTIONS_LOADED_ERROR, payload: err })
        }),
      ),
    ),
  )
