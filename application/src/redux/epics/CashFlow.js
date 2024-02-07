import { of, defer, zip } from 'rxjs'
import { catchError, mergeMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/CashFlow'
import { getAccountsForCashflow } from '../selectors/Accounts'

import FireflyAPI from '../../utils/FireflyAPI'

export const loadCashFlowWidgetDataForDateRange = ($actions, _, { FireflyAPI }) =>
  $actions.pipe(
    ofType(ActionTypes.LOAD_CASH_FLOW_DATA),
    pluck('payload'),
    mergeMap(({ accounts, dateRange }) => {
      return defer(() => FireflyAPI.loadCashFlowWidgetDataForDateRange(accounts, dateRange)).pipe(
        map(
          data => ({
            type: ActionTypes.LOAD_CASH_FLOW_DATA_SUCCESS,
            payload: { items: data, dateRange },
          }),
          catchError(err =>
            of({
              type: ActionTypes.LOAD_CASH_FLOW_DATA_ERROR,
              payload: err,
            }),
          ),
        ),
      )
    }),
  )

export const loadCashFlowDataTwelveMonths = (actions$, state$) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS),
    mergeMap(() =>
      zip(
        FireflyAPI.loadCashFlowEvents(),
        FireflyAPI.loadCashFlowProjectedEvents(),
        FireflyAPI.loadCashFlowSequences(),
        FireflyAPI.loadCashFlowDailyAccountBalances(getAccountsForCashflow(state$.value)),
      ).pipe(
        map(
          ([
            cashFlowEvents,
            cashFlowProjectedEvents,
            cashFlowSequences,
            cashFlowDailyAccountBalances,
          ]) => ({
            type: ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_SUCCESS,
            payload: {
              cashFlowEvents,
              cashFlowProjectedEvents,
              cashFlowSequences,
              cashFlowDailyAccountBalances,
            },
          }),
        ),
        catchError(err => {
          return of({
            type: ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_ERROR,
            payload: err,
          })
        }),
      ),
    ),
  )
