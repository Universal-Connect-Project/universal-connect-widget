import moment from 'moment'
import { createReducer } from '../../utils/Reducer'

import { ActionTypes as BudgetsActionTypes } from '../actions/Budgets'
import { ActionTypes as BudgetsWidgetActionTypes } from '../actions/BudgetsWidget'

const { BUDGET_SAVED, BUDGET_DELETED } = BudgetsActionTypes
const {
  BUBBLE_TOUCH_TOGGLE,
  BUDGET_SELECTED,
  BUDGET_RESELECT_PARENT,
  BUDGETS_WIDGET_LOADED,
  BUDGETS_WIDGET_LOADING,
  RESET_BUDGET,
  SELECT_DATE,
  VIEW_BUDGET,
} = BudgetsWidgetActionTypes

export const defaultState = {
  /**
   * TODO: Rename budget to BudgetBeingEdited
   * once the budget list view redesign under
   * the newBudgetListViewEnabled feature flag
   * is released to everyone.
   */
  budget: {},
  budgetBeingViewed: {},
  isTouchActive: false,
  loading: true,
  selectedDate: moment()
    .startOf('month')
    .unix(),
}

const bubbleTouchToggle = (state, action) => {
  return { ...state, isTouchActive: action.payload }
}

const budgetSaved = (state, action) => {
  const { item, options } = action.payload
  const budget = state.budget.guid === item.guid || options.selectOnSave ? item : state.budget
  const budgetBeingViewed =
    state.budgetBeingViewed.guid === item.guid || options.selectOnSave
      ? item
      : state.budgetBeingViewed

  if (item.parent_guid && item.parent_guid === budgetBeingViewed.guid) {
    const filteredChildren = budgetBeingViewed.children.filter(child => child.guid !== item.guid)

    budgetBeingViewed.children = [...filteredChildren, item]
    budget.children = [...filteredChildren, item]
  }

  return { ...state, budget, budgetBeingViewed }
}

const budgetReselectParent = state => {
  return { ...state, budget: state.budgetBeingViewed }
}

const budgetSelected = (state, action) => {
  const budget = { ...action.payload.item }

  return { ...state, budget }
}

const budgetsWidgetLoaded = state => ({ ...state, loading: false })
const budgetsWidgetLoading = state => ({ ...state, loading: true })
const resetBudget = state => ({
  ...state,
  budget: defaultState.budget,
  budgetBeingViewed: defaultState.budgetBeingViewed,
})

const selectDate = (state, action) => ({
  ...state,
  selectedDate: action.payload,
})

const viewBudget = (state, action) => ({ ...state, budgetBeingViewed: action.payload.item })

/**
 * If the budget being deleted has a parent, reselect the budget to budgetBeingViewed
 * which is the parent. If there is no parent, clear out budget and budgetBeingViewed
 */
const budgetDeleted = (state, action) => {
  const { item } = action.payload
  const budgetBeingViewed = state.budgetBeingViewed

  if (item.parent_guid) {
    if (item.parent_guid === budgetBeingViewed.guid) {
      const filteredChildren = budgetBeingViewed.children.filter(child => child.guid !== item.guid)

      budgetBeingViewed.children = filteredChildren
    }

    return { ...state, budget: budgetBeingViewed, budgetBeingViewed }
  }

  return { ...state, budget: {}, budgetBeingViewed: {} }
}

export const budgetsWidget = createReducer(defaultState, {
  [BUBBLE_TOUCH_TOGGLE]: bubbleTouchToggle,
  [BUDGET_DELETED]: budgetDeleted,
  [BUDGET_RESELECT_PARENT]: budgetReselectParent,
  [BUDGET_SAVED]: budgetSaved,
  [BUDGET_SELECTED]: budgetSelected,
  [BUDGETS_WIDGET_LOADED]: budgetsWidgetLoaded,
  [BUDGETS_WIDGET_LOADING]: budgetsWidgetLoading,
  [RESET_BUDGET]: resetBudget,
  [SELECT_DATE]: selectDate,
  [VIEW_BUDGET]: viewBudget,
})
