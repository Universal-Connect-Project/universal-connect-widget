import { defer, of } from 'rxjs'
import { catchError, mergeMapTo, map } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes, loadMasterDataSuccess, loadMasterDataError } from '../actions/App'

export const loadMasterData = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_MASTER_DATA),
    mergeMapTo(
      defer(() => FireflyAPI.loadMaster()).pipe(
        map(response => loadMasterDataSuccess(response)),
        catchError(err => of(loadMasterDataError(err))),
      ),
    ),
  )
