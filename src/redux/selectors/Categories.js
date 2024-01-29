import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _flatten from 'lodash/flatten'
import _orderBy from 'lodash/orderBy'
import _sumBy from 'lodash/sumBy'
import * as d3 from 'd3'
import { createSelector } from 'reselect'
import { Icon, Guid, Name, ThemeName, CategoryTypes } from '../../constants/Category'
import { getCategoryTotals } from './CategoryTotals'
import { getHistory } from '../../utils/Category'
import { isSpending } from '../../utils/Spending'

const MONTHLY_AVERAGE_LENGTH = 3

const SpendingUtilities = {
  createOther: (a, b) => {
    if (a.isOther(b)) return Object.assign({}, a, { other: [...a.other, b] })

    return Object.assign({}, a, { source: [...a.source, b] })
  },
  isOther: isIncome => categories => {
    const OTHER_PERCENTAGE = 0.03
    const isValidTotalForChart = category => (isIncome ? category.value < 0 : category.value > 0)
    const total = _sumBy(categories.filter(isValidTotalForChart), 'value')

    return category => isValidTotalForChart(category) && category.value / total < OTHER_PERCENTAGE
  },
  matchesGuid: (guid, property) => category => category[property] === guid,
  addOtherParent: (source, other, theme) => {
    if (!other || !other.length) return source

    const otherValue = _sumBy(other, 'value')
    const monthlyTotals = _flatten(other.map(category => category.monthlyTotals))

    const history = getHistory(monthlyTotals)

    return [
      ...source,
      {
        history,
        icon: 'help',
        color: theme.Colors.GRAY_500,
        children: other,
        guid: 'other',
        name: 'Other',
        total: otherValue,
        value: otherValue,
      },
    ]
  },
}

const { addOtherParent, createOther, isOther, matchesGuid } = SpendingUtilities

const getCategoryDetails = (categoryTotals, monthlyCategoryTotals, theme) => category => {
  const is_transfer = category.guid === Guid.TRANSFER || category.parent_guid === Guid.TRANSFER
  const icon = Icon[category.parent_guid || category.guid]
  const color = theme.Colors[Name[category.parent_guid || category.guid]]
  const categoryTotal = _find(categoryTotals, total => total.category_guid === category.guid)
  const total = categoryTotal ? categoryTotal.total : 0
  const monthlyTotals = monthlyCategoryTotals.filter(
    total =>
      total.category_guid === category.guid || total.top_level_category_guid === category.guid,
  )
  const generalMonthlyTotals = monthlyCategoryTotals.filter(
    total => total.category_guid === category.guid,
  )
  const history = getHistory(monthlyTotals)
  const generalHistory = getHistory(generalMonthlyTotals)
  const average = Math.ceil(
    Math.max(0, _sumBy(history.slice(-MONTHLY_AVERAGE_LENGTH), 'total') / MONTHLY_AVERAGE_LENGTH),
  )

  return Object.assign({}, category, {
    average,
    color,
    generalHistory,
    icon,
    is_transfer,
    history,
    monthlyTotals,
    total,
    value: category.is_income ? Math.abs(total) : total,
  })
}

const getChildCategories = categories => category => {
  const color = d3.rgb(category.color)
  const darkenByValue = 10
  const children = categories
    .filter(child => child.parent_guid === category.guid)
    .map(child => {
      color.r -= darkenByValue
      color.g -= darkenByValue
      color.b -= darkenByValue

      return Object.assign({}, child, { color: color.toString() })
    })
  const childrenTotal = children.length ? _sumBy(children, 'total') : 0
  const overallTotal = category.total + childrenTotal
  const value = category.is_income ? Math.abs(overallTotal) : overallTotal

  return Object.assign({}, category, { children, childrenTotal, overallTotal, value })
}

export const getCategories = state => state.categories.items
const getTheme = state => state.theme
const getMonthlyCategoryTotals = state => state.monthlyCategoryTotals.items

export const getDetailedCategories = createSelector(
  getCategories,
  getCategoryTotals,
  getMonthlyCategoryTotals,
  getTheme,
  (categories, categoryTotals, monthlyCategoryTotals, theme) => {
    return categories.map(getCategoryDetails(categoryTotals, monthlyCategoryTotals, theme))
  },
)

export const getNestedCategories = createSelector(getDetailedCategories, categories =>
  categories.map(getChildCategories(categories)),
)

export const getParentCategories = createSelector(getNestedCategories, categories =>
  categories.filter(category => !category.parent_guid),
)

const getSpendingIncomeAndTransferCategories = createSelector(
  getParentCategories,
  parentCategories =>
    parentCategories.reduce(
      (acc, category) => {
        if (isSpending(category.is_income, category.guid))
          return { ...acc, spending: [...acc.spending, category] }
        if (category.is_income) return { ...acc, income: [...acc.income, category] }
        if (category.is_transfer) return { ...acc, transfers: [...acc.transfers, category] }

        return acc
      },
      { spending: [], income: [], transfers: [] },
    ),
)

export const getBudgetCategories = createSelector(
  getSpendingIncomeAndTransferCategories,
  ({ spending }) => spending,
)

const separateOther = createSelector(
  getSpendingIncomeAndTransferCategories,
  getTheme,
  ({ spending, income, transfers }, theme) => {
    const { source: sourceSpending, other: otherSpending } = spending.reduce(createOther, {
      source: [],
      other: [],
      isOther: isOther(false)(spending),
    })
    const { source: sourceIncome, other: otherIncome } = income.reduce(createOther, {
      source: [],
      other: [],
      isOther: isOther(true)(income),
    })
    const { source: sourceTransfers, other: otherTransfers } = transfers.reduce(createOther, {
      source: [],
      other: [],
      isOther: isOther(false)(transfers),
    })

    return {
      incomeCategories: _orderBy(addOtherParent(sourceIncome, otherIncome, theme), 'value', 'desc'),
      otherIncome,
      otherSpending,
      otherTransfers,
      spendingCategories: _orderBy(
        addOtherParent(sourceSpending, otherSpending, theme),
        'value',
        'desc',
      ),
      transferCategories: _orderBy(
        addOtherParent(sourceTransfers, otherTransfers, theme),
        'value',
        'desc',
      ),
    }
  },
)

export const getSpendingCategories = createSelector(separateOther, ({ spendingCategories }) =>
  spendingCategories.filter(({ value }) => value > 0),
)

export const getIncomeCategories = createSelector(
  separateOther,
  ({ incomeCategories }) => incomeCategories,
)

export const getTransferCategories = createSelector(separateOther, ({ transferCategories }) =>
  transferCategories.filter(({ value }) => value !== 0),
)

export const getOtherCategories = createSelector(
  separateOther,
  ({ otherSpending }) => otherSpending,
)

export const getTotals = createSelector(
  getIncomeCategories,
  getSpendingCategories,
  getTransferCategories,
  (incomeCategories, spendingCategories, transfersCategories) => ({
    income: _sumBy(incomeCategories, 'value'),
    spending: _sumBy(spendingCategories, 'value'),
    transfers: _sumBy(transfersCategories, 'value'),
  }),
)

const getSelectedGuid = state => state.categories.selectedCategory.guid
const getSelectedType = state => state.categories.selectedCategory.type
const getSelectedChildGuid = state => state.categories.selectedChildCategory.guid
const getSelectedChildType = state => state.categories.selectedChildCategory.type

const findCategoryByGuid = (guid = '', parents = [], others = [], children = []) => {
  if (guid === '' || (parents === [] && others === [] && children === [])) return { guid: '' }
  const matches = [...parents, ...others, ...children].filter(matchesGuid(guid, 'guid'))

  if (!matches.length) return { guid: '' }

  //if there are two matches the first is the parent and the second is the child
  return matches.length > 1 ? matches[1] : matches[0]
}

export const getSelectedCategory = createSelector(
  separateOther,
  getSelectedGuid,
  getSelectedType,
  (
    {
      incomeCategories,
      otherIncome,
      otherSpending,
      spendingCategories,
      transferCategories,
      otherTransfers,
    },
    guid,
    type,
  ) => {
    if (type === CategoryTypes.TRANSFER) {
      return findCategoryByGuid(guid, transferCategories, otherTransfers)
    } else if (type === CategoryTypes.SPENDING) {
      return findCategoryByGuid(guid, spendingCategories, otherSpending)
    }

    return findCategoryByGuid(guid, incomeCategories, otherIncome)
  },
)

export const getSelectedCategoryChildren = createSelector(getSelectedCategory, category => {
  if (!category.children) return []

  if (category.total && category.guid !== 'other') {
    return _orderBy(
      [
        ...category.children,
        {
          guid: category.guid,
          name: 'General ' + category.name,
          value: category.is_income ? Math.abs(category.total) : category.total,
        },
      ],
      'value',
      'desc',
    )
  }

  return _orderBy(category.children, 'value', 'desc')
})

export const getSelectedChildCategory = createSelector(
  separateOther,
  getSelectedCategoryChildren,
  getSelectedChildGuid,
  getSelectedChildType,
  (
    {
      incomeCategories,
      otherIncome,
      otherSpending,
      spendingCategories,
      transferCategories,
      otherTransfers,
    },
    children,
    guid,
    type,
  ) => {
    if (type === CategoryTypes.TRANSFER) {
      return findCategoryByGuid(guid, transferCategories, otherTransfers, children)
    } else if (type === CategoryTypes.SPENDING) {
      return findCategoryByGuid(guid, spendingCategories, otherSpending, children)
    }

    return findCategoryByGuid(guid, incomeCategories, otherIncome, children)
  },
)

export const getSelectedIndices = createSelector(
  getIncomeCategories,
  getSpendingCategories,
  getTransferCategories,
  getSelectedCategory,
  getSelectedCategoryChildren,
  getSelectedChildCategory,
  (
    incomeCategories,
    spendingCategories,
    transferCategories,
    { guid: parentGuid },
    children,
    { guid: childGuid },
  ) => ({
    child: _findIndex(children, { guid: childGuid }),
    income: _findIndex(incomeCategories, { guid: parentGuid }),
    spending: _findIndex(spendingCategories, { guid: parentGuid }),
    transfers: _findIndex(transferCategories, { guid: parentGuid }),
  }),
)

export const getColors = createSelector(
  getIncomeCategories,
  getSpendingCategories,
  getTransferCategories,
  getSelectedCategory,
  getSelectedCategoryChildren,
  getTheme,
  (
    incomeCategories,
    spendingCategories,
    transferCategories,
    selectedCategory,
    selectedCategoryChildren,
    theme,
  ) => {
    const findColor = category => {
      return theme.Colors[ThemeName[category.name]] || theme.Colors['Uncategorized']
    }

    const color = d3.rgb(findColor(selectedCategory))
    const darkenByValue = 10

    return {
      income: incomeCategories.map(findColor),
      spending: spendingCategories.map(findColor),
      transfer: transferCategories.map(findColor),
      child:
        selectedCategory.guid === 'other'
          ? selectedCategoryChildren.map(findColor)
          : selectedCategoryChildren.map(() => {
              color.r -= darkenByValue
              color.g -= darkenByValue
              color.b -= darkenByValue

              return color.toString()
            }),
    }
  },
)

export const getIsShowingChildren = state => state.categories.isShowingChildren

export const getIsLoading = state =>
  state.categories.loading || state.categoryTotals.loading || state.accounts.loading
