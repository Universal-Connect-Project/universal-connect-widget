import { createSelector } from 'reselect'
import { updateObject } from '../../utils/Reducer'
import _find from 'lodash/find'
import _sortBy from 'lodash/sortBy'
import _sumBy from 'lodash/sumBy'
import { getBudgetCategories, getNestedCategories } from './Categories'
import { appendCategoryDetailsToBudget } from '../../utils/Budget'

import * as BudgetUtils from '../../utils/Budget'

const nestBudget = budgets => budget => {
  const children = budgets.filter(child => child.parent_guid === budget.guid)

  return updateObject(budget, { children })
}

export const getBudgets = state => state.budgets.items

export const getDetailedBudgets = createSelector(
  getBudgets,
  getNestedCategories,
  (budgets, categories) => {
    if (!categories.length) return []

    return _sortBy(
      budgets.map(budget => appendCategoryDetailsToBudget(budget, categories)),
      'category_name',
    )
  },
)

export const getNestedBudgets = createSelector(getDetailedBudgets, budgets => {
  if (!budgets.length) return []

  return budgets.map(nestBudget(budgets))
})

export const getParentBudgets = createSelector(getNestedBudgets, budgets =>
  budgets.filter(budget => !budget.parent_guid),
)

export const getSpendingBudgets = createSelector(getParentBudgets, budgets =>
  budgets.filter(budget => !budget.category_is_income && !budget.category_is_transfer),
)

export const getIncomeBudget = createSelector(
  getParentBudgets,
  budgets => _find(budgets, budget => budget.category_is_income) || {},
)

export const getTotalSpent = createSelector(getSpendingBudgets, budgets =>
  _sumBy(budgets, 'category_total'),
)

export const getBudgetedCategories = createSelector(
  getBudgetCategories,
  getSpendingBudgets,
  (spendingCategories, spendingBudgets) =>
    spendingCategories.filter(category => BudgetUtils.categoryHasBudget(spendingBudgets, category)),
)

export const getUnbudgetedCategories = createSelector(
  getBudgetCategories,
  getSpendingBudgets,
  (spendingCategories, spendingBudgets) =>
    spendingCategories.filter(
      category => !BudgetUtils.categoryHasBudget(spendingBudgets, category),
    ),
)

export const getRecalculatedCategories = createSelector(getBudgetCategories, spendingCategories =>
  spendingCategories.filter(category => BudgetUtils.categoryIsRecalculated(category)),
)

export const getTotalBudgeted = createSelector(getSpendingBudgets, budgets =>
  _sumBy(budgets, 'amount'),
)

export const getUnbudgetedIncome = createSelector(
  getIncomeBudget,
  getTotalBudgeted,
  (incomeBudget, totalBudgeted) => (incomeBudget.amount || 0) - totalBudgeted,
)
