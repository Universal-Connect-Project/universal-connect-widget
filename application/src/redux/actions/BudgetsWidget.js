import moment from 'moment'
import { dispatcher as accountsDispatcher } from './Accounts'
import budgetsDispatcher from './Budgets'
import categoriesDispatcher from './Categories'
import categoryTotalsDispatcher from './CategoryTotals'
import { dispatcher as monthlyCashFlowProfileDispatcher } from './MonthlyCashFlowProfile'
import { dispatcher as monthlyCategoryTotalsDispatcher } from './MonthlyCategoryTotals'
import { itemAction, initiateRequest, setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  BUBBLE_TOUCH_TOGGLE: 'budgetswidget/bubble_touch_toggle',
  BUDGET_RESELECT_PARENT: 'budgetswidget/budget_reselect_parent',
  BUDGET_SELECTED: 'budgetswidget/budget_selected',
  BUDGETS_WIDGET_LOADED: 'budgetswidget/budgets_widget_loaded',
  BUDGETS_WIDGET_LOADING: 'budgetswidget/budgets_widget_loading',
  RESET_BUDGET: 'budgetswidget/reset_budget',
  SELECT_DATE: 'budgetswidget/select_date',
  SELECT_NEXT_MONTH: 'budgetswidget/select_next_month',
  SELECT_PREV_MONTH: 'budgetswidget/select_prev_month',
  VIEW_BUDGET: 'budgetswidget/view_budget',
}

export const reselectParentBudget = () => dispatch => {
  dispatch(setupAction(ActionTypes.BUDGET_RESELECT_PARENT))
}

export const loadBudgetWidgetData = startDate => dispatch => {
  const endDate = moment
    .unix(startDate)
    .endOf('month')
    .unix()

  dispatch(initiateRequest(ActionTypes.BUDGETS_WIDGET_LOADING))

  return accountsDispatcher(dispatch)
    .loadAccounts()
    .then(() => {
      return Promise.all([
        budgetsDispatcher(dispatch).loadBudgets(),
        categoriesDispatcher(dispatch).loadCategories(),
        categoryTotalsDispatcher(dispatch).loadCategoryTotals(startDate, endDate),
        monthlyCategoryTotalsDispatcher(dispatch).loadMonthlyCategoryTotalsByAppliedAccountGuids(),
        monthlyCashFlowProfileDispatcher(dispatch).loadMonthlyCashFlowProfile(),
      ]).then(() => {
        dispatch(initiateRequest(ActionTypes.BUDGETS_WIDGET_LOADED))
      })
    })
}

export const resetBudget = () => dispatch => dispatch(initiateRequest(ActionTypes.RESET_BUDGET))
export const selectBudget = budget => dispatch =>
  dispatch(itemAction(ActionTypes.BUDGET_SELECTED, budget))
export const selectDate = date => dispatch => dispatch(setupAction(ActionTypes.SELECT_DATE, date))
export const viewBudget = budget => dispatch =>
  dispatch(itemAction(ActionTypes.VIEW_BUDGET, budget))

export const selectNextMonth = () => (dispatch, getState) => {
  const state = getState()
  const startDate = moment
    .unix(state.budgetsWidget.selectedDate)
    .add(1, 'month')
    .unix()
  const endDate = moment
    .unix(startDate)
    .endOf('month')
    .unix()

  dispatch(selectDate(startDate))
  return categoryTotalsDispatcher(dispatch).loadCategoryTotals(startDate, endDate)
}

export const selectPrevMonth = () => (dispatch, getState) => {
  const state = getState()
  const selectedDate = state.budgetsWidget.selectedDate
  const startDate = moment
    .unix(selectedDate)
    .subtract(1, 'month')
    .unix()
  const endDate = moment
    .unix(startDate)
    .endOf('month')
    .unix()

  dispatch(selectDate(startDate))
  return categoryTotalsDispatcher(dispatch).loadCategoryTotals(startDate, endDate)
}

export const selectMonth = date => dispatch => {
  const startDate = moment
    .unix(date)
    .startOf('month')
    .unix()
  const endDate = moment
    .unix(date)
    .endOf('month')
    .unix()

  dispatch(selectDate(date))
  return categoryTotalsDispatcher(dispatch).loadCategoryTotals(startDate, endDate)
}

export const bubbleTouchToggle = isTouchActive => ({
  type: ActionTypes.BUBBLE_TOUCH_TOGGLE,
  payload: isTouchActive,
})

export const dispatcher = dispatch => ({
  bubbleTouchToggle: isTouchActive => dispatch(bubbleTouchToggle(isTouchActive)),
  loadBudgetWidgetData: startDate => dispatch(loadBudgetWidgetData(startDate)),
  resetBudget: () => dispatch(resetBudget()),
  selectBudget: budget => dispatch(selectBudget(budget)),
  selectNextMonth: () => dispatch(selectNextMonth()),
  selectPrevMonth: () => dispatch(selectPrevMonth()),
  selectMonth: date => dispatch(selectMonth(date)),
  viewBudget: budget => dispatch(viewBudget(budget)),
})
