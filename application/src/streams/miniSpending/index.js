import { merge } from 'rxjs'
import { map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../../redux/actions/miniSpending'
import { WSEventSubject$ } from '../Subjects'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const MiniSpendingCategoryTotalsUpdated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.MONTHLY_CATEGORY_TOTALS_UPDATED),
  pluck('payload'),
  map(monthlyCategoryTotals => ({
    type: ActionTypes.FAYE_MONTHLY_CATEGORY_TOTALS_UPDATED,
    payload: { item: monthlyCategoryTotals },
  })),
)

export const MiniSpendingActions$ = merge(MiniSpendingCategoryTotalsUpdated$)
