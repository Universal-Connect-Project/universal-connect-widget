import {
  ActionTypes,
  loadUserFeaturesSuccess,
  loadUserFeaturesError,
} from '../actions/UserFeatures'

import { defer, of } from 'rxjs'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const loadUserFeatures = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_USER_FEATURES),
    mergeMap(() =>
      defer(() => FireflyAPI.loadUserFeatures()).pipe(
        map(userFeatures => loadUserFeaturesSuccess(userFeatures)),
        catchError(err => of(loadUserFeaturesError(err))),
      ),
    ),
  )
