import _orderBy from 'lodash/orderBy'
import _sumBy from 'lodash/sumBy'
import _get from 'lodash/get'
import _find from 'lodash/find'

import StyleUtils from './Style'

import { Guid, TranslatedBudgetMap } from '../constants/Category'

export const getBudgetPercentage = (budgetAmount, budgetSpent) => {
  // No budget amount and nothing spent results in zero percent and green bubble
  if (!budgetAmount && !budgetSpent) {
    return 0
  }

  // No budget amount and money spent results in 101 percent and red bubble
  if (!budgetAmount && budgetSpent) {
    return 101
  }

  // Budget amount and money spent results in calculating percentage for color
  return (budgetSpent / budgetAmount) * 100
}

export const getHighContrastBubbleColors = (budgetAmount, budgetSpent) => {
  const percentage = getBudgetPercentage(budgetAmount, budgetSpent)
  let bubbleColors = {}

  if (percentage > 100) {
    bubbleColors = {
      bubble: '#D92D24',
      text: '#FFFFFF',
      mercury: '#BC271F',
    }
  } else if (percentage > 80) {
    bubbleColors = {
      bubble: '#FEBD35',
      text: '#121417',
      mercury: '#8A6A02',
    }
  } else {
    bubbleColors = {
      bubble: '#078364',
      text: '#FFFFFF',
      mercury: '#0CED9C',
    }
  }

  return bubbleColors
}

export const getBudgetBubble = (budget, isParent = false, theme) => {
  const percentage = getBudgetPercentage(budget.amount, budget.category_total)
  const color =
    budget.category_guid === 'add' || budget.category_guid === 'edit'
      ? theme.Colors.GRAY_500
      : StyleUtils.PercentageColor(percentage, theme)
  const currentAmount = budget.category_total
  const key = budget.category_guid

  const title =
    TranslatedBudgetMap[budget.category_guid]?.() || TranslatedBudgetMap[Guid.UNCATEGORIZED]()

  const totalAmount = budget.amount
  const parentMercuryData = {
    percentage,
    total: budget.category_total - _sumBy(budget.children, 'category_total'),
    color: StyleUtils.MercuryColor(percentage, theme),
  }
  const childMercuryData = budget.children
    ? budget.children.map(child => {
        const childPercentage = child.amount ? (child.category_total / child.amount) * 100 : 0
        const maxPercentage = Math.max(childPercentage, percentage)
        //Child percentage color should never be less than parent, ie: parent = yellow, child is either yellow or red, not green

        return {
          percentage: maxPercentage,
          total: child.category_total,
          color: StyleUtils.MercuryColor(maxPercentage, theme),
        }
      })
    : []
  const mercuryData = _orderBy(childMercuryData.concat([parentMercuryData]), 'percentage', 'desc')

  return Object.assign({}, budget, {
    color,
    currentAmount,
    isParent,
    key,
    mercuryData,
    percentage,
    title,
    totalAmount,
  })
}

export const getSubTitle = budget => {
  const subBudgetCount = _get(budget, 'children.length', 0)
  const subTitle = `${subBudgetCount === 0 ? 'No' : subBudgetCount} ${
    subBudgetCount === 1 ? 'Sub-Budget' : 'Sub-Budgets'
  }`

  return subTitle
}

export const categoryHasBudget = (budgets, category) => {
  const budgetGuids = budgets.map(budget => budget.category_guid)

  return budgetGuids.indexOf(category.guid) >= 0
}

export const categoryIsRecalculated = category => {
  return !!category.average
}

export const appendCategoryDetailsToBudget = (budget, categories) => {
  const category = _find(categories, category => category.guid === budget.category_guid) || {}

  return {
    ...budget,
    category_color: category.color,
    category_history: category.history,
    category_is_income: category.is_income,
    category_is_transfer: category.is_transfer,
    category_monthly_totals: category.monthlyTotals,
    category_name: category.name,
    category_parent_guid: category.parent_guid,
    category_total: Math.ceil(category.overallTotal),
    icon: category.icon,
    percentage: budget.amount ? (category.overallTotal / budget.amount) * 100 : 0,
  }
}

export const getProgressText = percentage => {
  if (percentage > 100) {
    return "You've overspent."
  } else if (percentage > 80) {
    return "You're near your limit."
  } else {
    return "You're on track."
  }
}
