import { of, from } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { ActionTypes } from '../actions/Spending'
import { receiveCategoryTotals, loadCategoryTotalsError } from '../actions/CategoryTotals'
import { getDateRange } from '../selectors/CategoryTotals'
import { getAccountFilterAppliedGuids } from '../selectors/Accounts'
import FireflyAPI from '../../utils/FireflyAPI'

/**
 * Load in the category totals based on the applied account filter.
 */
export const getCategoryTotalsByAccounts = (actions$, state$) =>
  actions$.pipe(
    ofType(ActionTypes.APPLY_SPENDING_ACCOUNT_FILTER, ActionTypes.RELOAD_CATEGORY_TOTALS),
    flatMap(() => {
      const currentState = state$.value
      const { startDate, endDate, dateRangeType } = getDateRange(currentState)
      const accountGuids = getAccountFilterAppliedGuids(currentState)

      return from(FireflyAPI.loadCategoryTotalsByAccount(startDate, endDate, accountGuids)).pipe(
        map(resp => receiveCategoryTotals(resp, startDate, endDate, dateRangeType)),
        catchError(err => of(loadCategoryTotalsError(err))),
      )
    }),
  )
