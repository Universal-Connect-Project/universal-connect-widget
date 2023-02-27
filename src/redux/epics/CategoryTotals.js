import moment from 'moment'

import { from, of, zip } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { receiveTotals, loadTotalsError } from '../actions/CategoryTotals'

import { getDateRange } from '../selectors/CategoryTotals'
import { getAccountFilterAppliedGuids } from '../selectors/Accounts'

import FireflyAPI from '../../utils/FireflyAPI'

import { ActionTypes as AccountActionTypes } from '../actions/Accounts'

import {
  ActionTypes,
  receiveCategoryTotals,
  loadCategoryTotalsError,
} from '../actions/CategoryTotals'

/**
 * Load in the category totals and monthly category totals
 * based on the applied account filter.
 */
export const getCategoryTotalsAndMonthlyCategoryTotalsByAccounts = (actions$, state$) =>
  actions$.pipe(
    ofType(AccountActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS),
    flatMap(() => {
      const currentState = state$.value
      const { startDate: categoryTotalsStartDate, endDate: categoryTotalsEndDate } = getDateRange(
        currentState,
      )
      // Always get a years worth of monthly category totals
      const monthlyCategoryTotalsStartDate = moment()
        .subtract(12, 'months')
        .startOf('month')
        .unix()
      const monthlyCategoryTotalsEndDate = moment()
        .endOf('month')
        .unix()
      const accountGuids = getAccountFilterAppliedGuids(currentState)

      return zip(
        from(
          FireflyAPI.loadCategoryTotalsByAccount(
            categoryTotalsStartDate,
            categoryTotalsEndDate,
            accountGuids,
          ),
        ),
        from(
          FireflyAPI.loadMonthlyCategoryTotalsByAccount(
            monthlyCategoryTotalsStartDate,
            monthlyCategoryTotalsEndDate,
            accountGuids,
          ),
        ),
      ).pipe(
        map(([loadedCategoryTotals, { monthly_category_totals }]) => {
          return receiveTotals(loadedCategoryTotals, monthly_category_totals)
        }),
        catchError(() => of(loadTotalsError())),
      )
    }),
  )

export const loadCategoryTotals = (action$, state$) =>
  action$.pipe(
    ofType(ActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED),
    pluck('payload', 'dateRange'),
    flatMap(({ startDate, endDate, dateRangeType }) => {
      const appliedAccountFilterGuids = getAccountFilterAppliedGuids(state$.value)

      return from(
        FireflyAPI.loadCategoryTotalsByAccount(startDate, endDate, appliedAccountFilterGuids),
      ).pipe(
        flatMap(categoryTotals => {
          if (!Array.isArray(categoryTotals)) {
            return of({ type: ActionTypes.CATEGORY_TOTALS_LOAD_ERROR })
          }
          return of(categoryTotals).pipe(
            map(categoryTotals =>
              receiveCategoryTotals(categoryTotals, startDate, endDate, dateRangeType),
            ),
          )
        }),
        catchError(err => of(loadCategoryTotalsError(err))),
      )
    }),
  )
