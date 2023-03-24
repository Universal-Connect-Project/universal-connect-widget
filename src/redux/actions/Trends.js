import moment from 'moment'

import { dispatcher as accountsDispatcher } from './Accounts'
import { dispatcher as monthlyCategoryTotalsDispatcher } from './MonthlyCategoryTotals'
import categoriesDispatcher from './Categories'
import categoryTotalsDispatcher from './CategoryTotals'

export const ActionTypes = {
  TRENDS_WIDGET_LOADING: 'trends/trends_widget_loading',
  TRENDS_WIDGET_LOADED: 'trends/trends_widget_loaded',
  UPDATE_MONTH_COUNT: 'trends/update_month_count',
  UPDATE_SELECTED_CATEGORY: 'trends/update_selected_category',
}

import { setupAction } from '../../utils/ActionHelpers'

// TODO: Update to epic
const loadTrendsWidgetData = monthCount => dispatch => {
  dispatch({ type: ActionTypes.TRENDS_WIDGET_LOADING })

  const startDate = moment()
    .subtract(monthCount, 'months')
    .startOf('month')
    .unix()
  const endDate = moment()
    .endOf('month')
    .unix()

  return accountsDispatcher(dispatch)
    .loadAccounts()
    .then(() => {
      return Promise.all([
        categoriesDispatcher(dispatch).loadCategories(),
        categoryTotalsDispatcher(dispatch).loadCategoryTotals(startDate, endDate),
        monthlyCategoryTotalsDispatcher(dispatch).loadMonthlyCategoryTotalsByAppliedAccountGuids(),
      ]).then(() => {
        dispatch({ type: ActionTypes.TRENDS_WIDGET_LOADED })
      })
    })
}

const updateMonthCount = monthCount => dispatch =>
  dispatch(setupAction(ActionTypes.UPDATE_MONTH_COUNT, { monthCount }))

const updateSelectedCategory = selectedCategory => dispatch =>
  dispatch(setupAction(ActionTypes.UPDATE_SELECTED_CATEGORY, { selectedCategory }))

export const dispatcher = dispatch => ({
  loadTrendsWidgetData: (startDate, endDate) => dispatch(loadTrendsWidgetData(startDate, endDate)),
  updateMonthCount: monthCount => dispatch(updateMonthCount(monthCount)),
  updateSelectedCategory: selectedCategory => dispatch(updateSelectedCategory(selectedCategory)),
})
