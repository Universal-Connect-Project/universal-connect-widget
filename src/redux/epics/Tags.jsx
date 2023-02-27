import { defer, of } from 'rxjs'
import { catchError, map, pluck, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/Tags'

export const createTagging = (action$, _, { FireflyAPI }) =>
  action$.pipe(
    ofType(ActionTypes.CREATE_TAGGING),
    pluck('payload'),
    mergeMap(tagging => {
      return defer(() => FireflyAPI.createTagging(tagging)).pipe(
        map(item => ({ type: ActionTypes.TAGGING_CREATED, payload: { item } })),
        catchError(error =>
          of({
            type: ActionTypes.CREATE_TAGGING_ERROR,
            payload: error,
          }),
        ),
      )
    }),
  )
