import { DateRangeTypes } from '../../constants/Category'

import { ActionTypes as AccountActionTypes } from '../actions/Accounts'
import { ActionTypes } from '../actions/Categories'
import { ActionTypes as CategoryTotalActionTypes } from '../actions/CategoryTotals'
import { ActionTypes as MiniSpendingActionTypes } from '../actions/miniSpending'

import { createReducer } from '../../utils/Reducer'

const {
  CATEGORY_TOTALS_LOAD_ERROR,
  CATEGORY_TOTALS_LOADED,
  CLEAR_CATEGORY_TOTALS,
  DATE_RANGE_SET,
  LOAD_CATEGORY_TOTALS_NO_CHANGE,
  TOTALS_LOADED,
  TOTALS_LOAD_ERROR,
} = CategoryTotalActionTypes

const {
  CATEGORY_DELETED,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_EDIT_ERROR,
  CATEGORY_SAVED,
  CATEGORIES_LOAD,
  CATEGORIES_LOADED,
  CATEGORY_REQUEST_INITIATED,
  CATEGORY_SELECTED,
  CATEGORY_UPDATED,
  CHILD_CATEGORY_SELECTED,
  FAYE_CATEGORIES_CREATED,
  FAYE_CATEGORIES_DELETED,
  LOAD_CATEGORIES_ERROR,
  LOAD_CATEGORIES_NO_CHANGE,
  RESET_CHART,
  SHOW_CHILDREN,
} = ActionTypes

const defaultSelectedCategory = { guid: '', type: '' }

export const defaultCategoriesState = {
  error: false,
  filter: '',
  isShowingChildren: false,
  items: [],
  loading: true,
  selectedCategory: defaultSelectedCategory,
  selectedChildCategory: defaultSelectedCategory,
}

const deleteCategory = (state, action) => {
  const items = state.items.filter(c => c.guid !== action.payload.item.guid)

  return { ...state, loading: false, items }
}

const loadCategoriesError = state => ({ ...state, loading: false, error: true })

const loadCategories = (state, { payload: { items } }) => ({
  ...state,
  loading: false,
  items,
  error: false,
})

const selectCategory = (state, action) => ({
  ...state,
  selectedCategory: { guid: action.payload.guid, type: action.payload.type },
  isShowingChildren: action.payload.shouldHideChildren,
})

const selectChildCategory = (state, action) => ({
  ...state,
  selectedChildCategory: { guid: action.payload.guid, type: action.payload.type },
})

const saveCategory = (state, action) => {
  const { items } = state
  const newCategory = action.payload.item
  const categoryIndex = items.findIndex(category => category.guid === newCategory.guid)
  // If the category already existed, replace it at the current index
  // If it's new, append it to the end of the items
  const modifiedItems =
    categoryIndex > -1
      ? [...items.slice(0, categoryIndex), newCategory, ...items.slice(categoryIndex + 1)]
      : [...items.filter(({ guid }) => guid !== action.payload.item.guid), newCategory]

  return {
    ...state,
    items: modifiedItems,
    loading: false,
  }
}

const editCategoryError = state => ({ ...state, loading: false, error: true })

const showChildren = (state, action) => ({
  ...state,
  isShowingChildren: action.payload.shouldShowChildren,
})

const requestInitiated = state => ({ ...state, loading: true })

const resetChart = state => ({
  ...state,
  isShowingChildren: false,
  selectedCategory: defaultSelectedCategory,
  selectedChildCategory: defaultSelectedCategory,
})

const clearLoading = state => ({ ...state, loading: false })

export const categories = createReducer(defaultCategoriesState, {
  [CATEGORY_DELETED]: deleteCategory,
  [CATEGORY_EDIT_SUCCESS]: saveCategory,
  [CATEGORY_EDIT_ERROR]: editCategoryError,
  [CATEGORY_SAVED]: saveCategory,
  [CATEGORIES_LOADED]: loadCategories,
  [CATEGORIES_LOAD]: requestInitiated,
  [CATEGORY_SELECTED]: selectCategory,
  [CATEGORY_TOTALS_LOADED]: resetChart,
  [CATEGORY_UPDATED]: saveCategory,
  [CHILD_CATEGORY_SELECTED]: selectChildCategory,
  [FAYE_CATEGORIES_CREATED]: saveCategory,
  [FAYE_CATEGORIES_DELETED]: deleteCategory,
  [LOAD_CATEGORIES_ERROR]: loadCategoriesError,
  [LOAD_CATEGORIES_NO_CHANGE]: clearLoading,
  [RESET_CHART]: resetChart,
  [SHOW_CHILDREN]: showChildren,
})

export const defaultCategoryTotalsState = {
  dateRange: { startDate: 0, endDate: 0, dateRangeType: DateRangeTypes.DEFAULT },
  items: [],
  loading: true,
  error: false,
}

const loadingCategoryTotals = state => ({
  ...state,
  loading: true,
})

const loadCategoryTotals = (state, action) => ({
  ...state,
  dateRange: action.payload.dateRange,
  items: action.payload.items,
  loading: false,
  error: false,
})

const loadCategoryTotalsByAccountFilter = (state, action) => ({
  ...state,
  loading: false,
  items: action.payload.categoryTotals,
})

const loadCategoryTotalsError = state => ({ ...state, error: true, loading: false })

const requestCategoryTotals = state => ({ ...state, loading: true })

const setDateRange = (state, action) => ({ ...state, dateRange: action.payload.dateRange })

const clearCategoryTotals = state => ({ ...state, items: [] })

export const categoryTotals = createReducer(defaultCategoryTotalsState, {
  [AccountActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS]: loadingCategoryTotals,
  [CATEGORY_TOTALS_LOADED]: loadCategoryTotals,
  [CATEGORY_TOTALS_LOAD_ERROR]: loadCategoryTotalsError,
  [MiniSpendingActionTypes.SPENDING_DATA_SYNC_COMPLETE]: loadCategoryTotals,
  [CATEGORY_REQUEST_INITIATED]: requestCategoryTotals,
  [CLEAR_CATEGORY_TOTALS]: clearCategoryTotals,
  [DATE_RANGE_SET]: setDateRange,
  [LOAD_CATEGORY_TOTALS_NO_CHANGE]: clearLoading,
  [TOTALS_LOADED]: loadCategoryTotalsByAccountFilter,
  [TOTALS_LOAD_ERROR]: loadCategoryTotalsError,
})
