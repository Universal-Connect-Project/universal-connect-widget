import {
  ActionTypes,
  loadUserFeaturesSuccess,
  loadUserFeaturesError,
} from 'reduxify/actions/UserFeatures'

import { defer, of } from 'rxjs'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const loadUserFeatures = (actions$, _, { connectAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_USER_FEATURES),
    mergeMap(() =>
      defer(() => connectAPI.loadUserFeatures()).pipe(
        map(userFeatures => loadUserFeaturesSuccess(userFeatures)),
        catchError(err => of(loadUserFeaturesError(err))),
      ),
    ),
  )
