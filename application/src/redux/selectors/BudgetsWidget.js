import { createSelector } from 'reselect'

import { getNestedBudgets } from './Budgets'
import { getNestedCategories } from './Categories'
import { getFilteredTransactionsForBudgets } from './Transactions'

export const getBudget = state => state.budgetsWidget.budget
export const getBudgetBeingViewed = state => state.budgetsWidget.budgetBeingViewed
export const getSelectedDate = state => state.budgetsWidget.selectedDate

export const getBudgetTransactions = createSelector(
  getBudget,
  getFilteredTransactionsForBudgets,
  (budget, transactions) =>
    transactions.filter(transaction => {
      return (
        transaction.top_level_category_guid === budget.category_guid ||
        (transaction.top_level_category_guid === budget.category_parent_guid &&
          transaction.category_guid === budget.category_guid)
      )
    }),
)

export const getNestedBudget = createSelector(
  getBudget,
  getNestedBudgets,
  (budget, budgets) => budgets.find(b => b.guid === budget.guid) || {},
)

export const getNestedCategory = createSelector(
  getBudget,
  getNestedCategories,
  (budget, categories) => categories.find(c => c.guid === budget.category_guid) || {},
)

export const getSubBudgetsForBudgetBeingViewed = createSelector(
  getBudgetBeingViewed,
  getNestedBudgets,
  (budgetBeingViewed, budgets) =>
    budgets.filter(budget => budget.parent_guid === budgetBeingViewed.guid),
)
