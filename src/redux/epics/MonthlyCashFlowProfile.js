import { of, defer } from 'rxjs'
import { catchError, map, pluck, mergeMapTo, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/MonthlyCashFlowProfile'

export const loadMonthlyCashFlowProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_MONTHLY_CASH_FLOW),
    mergeMapTo(
      defer(() => FireflyAPI.loadMonthlyCashFlowProfile()).pipe(
        map(({ monthly_cash_flow_profile }) => ({
          type: ActionTypes.LOAD_MONTHLY_CASH_FLOW_SUCCESS,
          payload: monthly_cash_flow_profile,
        })),
        catchError(err => {
          return of({ type: ActionTypes.LOAD_MONTHLY_CASH_FLOW_ERROR, payload: err })
        }),
      ),
    ),
  )

export const updateMonthlyCashFlowProfile = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_MONTHLY_CASH_FLOW),
    pluck('payload'),
    mergeMap(cashFlowProfile =>
      defer(() => FireflyAPI.updateMonthlyCashFlowProfile(cashFlowProfile)).pipe(
        map(({ monthly_cash_flow_profile }) => ({
          type: ActionTypes.UPDATE_MONTHLY_CASH_FLOW_SUCCESS,
          payload: monthly_cash_flow_profile,
        })),
        catchError(err => {
          return of({ type: ActionTypes.UPDATE_MONTHLY_CASH_FLOW_ERROR, payload: err })
        }),
      ),
    ),
  )
