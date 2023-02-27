import { from, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import FireflyAPI from '../../utils/FireflyAPI'

import { ActionTypes } from '../actions/Agreement'

export const loadAgreement = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.AGREEMENT_LOADING),
    flatMap(() =>
      from(FireflyAPI.loadAgreement()).pipe(
        map(agreement => ({ type: ActionTypes.AGREEMENT_LOADED, payload: { agreement } })),
        catchError(() => of({ type: ActionTypes.AGREEMENT_ERROR })),
      ),
    ),
  )
