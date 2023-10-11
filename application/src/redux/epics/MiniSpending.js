import { debounceTime, mapTo } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { ActionTypes } from '../actions/miniSpending'
import { ActionTypes as AccountActionTypes } from '../actions/Accounts'

export const miniSpending = (actions$, _, { scheduler } = {}) => {
  return actions$.pipe(
    ofType(
      ActionTypes.FAYE_MONTHLY_CATEGORY_TOTALS_UPDATED,
      AccountActionTypes.FAYE_ACCOUNTS_UPDATED,
    ),
    debounceTime(6000, scheduler),
    mapTo({ type: ActionTypes.NEW_SPENDING_DATA_AVAILABLE }),
  )
}
