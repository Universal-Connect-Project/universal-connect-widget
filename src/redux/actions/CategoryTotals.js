import { DateRangeTypes } from '../../constants/Category'

export const ActionTypes = {
  CATEGORY_TOTALS_LOAD_ERROR: 'categorytotals/category_totals_load_error',
  CATEGORY_TOTALS_LOADED: 'categorytotals/category_totals_loaded',
  CATEGORY_TOTALS_REQUEST_INITIATED: 'categorytotals/category_totals_request_initiated',
  CLEAR_CATEGORY_TOTALS: 'categorytotals/clear_category_totals',
  DATE_RANGE_SET: 'categorytotals/date_range_set',
  TOTALS_LOADED: 'categorytotals/totals_loaded',
  TOTALS_LOAD_ERROR: 'categorytotals/totals_load_error',
}

export const loadCategoryTotals = (startDate, endDate, dateRangeType = DateRangeTypes.DEFAULT) => ({
  type: ActionTypes.CATEGORY_TOTALS_REQUEST_INITIATED,
  payload: {
    dateRange: { startDate, endDate, dateRangeType },
  },
})

export const receiveTotals = (categoryTotals, monthlyCategoryTotals) => ({
  type: ActionTypes.TOTALS_LOADED,
  payload: {
    categoryTotals,
    monthlyCategoryTotals,
  },
})

export const loadTotalsError = () => ({
  type: ActionTypes.TOTALS_LOAD_ERROR,
})

export const receiveCategoryTotals = (items, startDate, endDate, dateRangeType) => ({
  type: ActionTypes.CATEGORY_TOTALS_LOADED,
  payload: {
    dateRange: { endDate, startDate, dateRangeType },
    items,
  },
})

export const loadCategoryTotalsError = err => ({
  type: ActionTypes.CATEGORY_TOTALS_LOAD_ERROR,
  payload: err,
})

export const setDateRange = (startDate, endDate, dateRangeType) => ({
  type: ActionTypes.DATE_RANGE_SET,
  payload: {
    dateRange: {
      endDate,
      startDate,
      dateRangeType,
    },
  },
})

export const clearCategoryTotals = () => ({
  type: ActionTypes.CLEAR_CATEGORY_TOTALS,
})

export default dispatch => ({
  clearCategoryTotals: () => dispatch(clearCategoryTotals()),
  loadCategoryTotals: (startDate, endDate, dateRangeType) =>
    dispatch(loadCategoryTotals(startDate, endDate, dateRangeType)),
  setDateRange: (startDate, endDate, dateRangeType) =>
    dispatch(setDateRange(startDate, endDate, dateRangeType)),
})
