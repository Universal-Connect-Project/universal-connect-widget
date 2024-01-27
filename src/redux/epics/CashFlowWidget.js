import { from, of, defer } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/CashFlowWidget'
import { ActionTypes as CashFlowActionTypes } from '../actions/CashFlow'
import { getAccountsForCashflow } from '../selectors/Accounts'

import { setupAction, itemsAction } from '../../utils/ActionHelpers'
import FireflyAPI from '../../utils/FireflyAPI'

/**
 * Manually mark an event as paid. Note: Marking a *projected event* as paid,
 * is just creating an actual event.
 */
export const markAsPaid = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.MARK_EVENT_AS_PAID),
    pluck('payload'),
    flatMap(projectedEvent =>
      from(FireflyAPI.createCashflowEvent(projectedEvent)).pipe(
        pluck('cashflow_event'),
        map(newEvent => setupAction(ActionTypes.MARK_EVENT_AS_PAID_SUCCESS, newEvent)),
        catchError(err => of(setupAction(ActionTypes.MARK_EVENT_AS_PAID_ERROR, err))),
      ),
    ),
  )

/**
 * This stream listens for varios events and refetchs all of the cashflow data
 * from the server.
 *
 * NOTE: It is worth noting that we do this because the logic of updating and
 * projecting cashflow events is complicated and we want to let the server do
 * it instead of trying to do it in reducers.
 */
export const refreshCashFlowData = (actions$, state$) => {
  return actions$.pipe(
    ofType(ActionTypes.MARK_EVENT_AS_PAID_SUCCESS, ActionTypes.SKIP_EVENT_SUCCESS),
    flatMap(() => {
      const state = state$.value
      const cashAccounts = getAccountsForCashflow(state)

      return defer(() =>
        FireflyAPI.loadCashFlowWidgetDataForDateRange(cashAccounts, state.cashFlow.dateRange),
      ).pipe(
        map(cashFlowData =>
          itemsAction(CashFlowActionTypes.LOAD_CASH_FLOW_DATA_SUCCESS, cashFlowData),
        ),
        catchError(err => ({
          type: CashFlowActionTypes.LOAD_CASH_FLOW_DATA_ERROR,
          payload: err,
        })),
      )
    }),
  )
}

export const skipEvent = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.SKIP_EVENT),
    pluck('payload'),
    flatMap(event =>
      from(
        FireflyAPI.createCashflowEvent({
          ...event,
          is_skipped: true,
          occurred_on: event.expected_date,
        }),
      ).pipe(
        map(event => setupAction(ActionTypes.SKIP_EVENT_SUCCESS, event)),
        catchError(err => of(setupAction(ActionTypes.SKIP_EVENT_ERROR, err))),
      ),
    ),
  )
