import { createReducer } from '../../utils/Reducer'
import { ActionTypes as AccountActionTypes } from '../actions/Accounts'
import { ActionTypes as MonthlyCategoryTotalsActionTypes } from '../actions/MonthlyCategoryTotals'
import { ActionTypes as CategoryTotalsActionTypes } from '../actions/CategoryTotals'

const {
  MONTHLY_CATEGORY_TOTALS_LOADED,
  MONTHLY_CATEGORY_TOTALS_LOADING,
} = MonthlyCategoryTotalsActionTypes
const { TOTALS_LOADED } = CategoryTotalsActionTypes

export const defaultState = {
  loading: true,
  items: [],
}

const loadingMonthlyCategoryTotals = state => ({
  ...state,
  loading: true,
})

const loadMonthlyCategoryTotals = (state, action) => ({
  ...state,
  items: action.payload.items,
  loading: false,
})

const loadMonthlyCategoryTotalsByAccountFilter = (state, action) => ({
  ...state,
  loading: false,
  items: action.payload.monthlyCategoryTotals,
})

export const monthlyCategoryTotals = createReducer(defaultState, {
  [AccountActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS]: loadingMonthlyCategoryTotals,
  [MONTHLY_CATEGORY_TOTALS_LOADED]: loadMonthlyCategoryTotals,
  [MONTHLY_CATEGORY_TOTALS_LOADING]: loadingMonthlyCategoryTotals,
  [TOTALS_LOADED]: loadMonthlyCategoryTotalsByAccountFilter,
})
