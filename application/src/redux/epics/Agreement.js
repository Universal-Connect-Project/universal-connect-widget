import { from, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import connectAPI from 'src/connect/services/api'

import { ActionTypes } from 'reduxify/actions/Agreement'

export const loadAgreement = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.AGREEMENT_LOADING),
    flatMap(() =>
      from(connectAPI.loadAgreement()).pipe(
        map(agreement => ({ type: ActionTypes.AGREEMENT_LOADED, payload: { agreement } })),
        catchError(() => of({ type: ActionTypes.AGREEMENT_ERROR })),
      ),
    ),
  )
