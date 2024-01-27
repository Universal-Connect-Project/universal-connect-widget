import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Trends'

const {
  TRENDS_WIDGET_LOADING,
  TRENDS_WIDGET_LOADED,
  UPDATE_MONTH_COUNT,
  UPDATE_SELECTED_CATEGORY,
} = ActionTypes

export const defaultState = {
  loading: false,
  selectedCategory: {},
  monthCount: 6,
}

const updateMonthCount = (state, action) =>
  updateObject(state, { monthCount: action.payload.monthCount })

const updateSelectedCategory = (state, action) =>
  updateObject(state, { selectedCategory: action.payload.selectedCategory })

const trendsLoading = state => ({
  ...state,
  loading: true,
})

const trendsLoaded = state => ({
  ...state,
  loading: false,
})

export const trends = createReducer(defaultState, {
  [TRENDS_WIDGET_LOADING]: trendsLoading,
  [TRENDS_WIDGET_LOADED]: trendsLoaded,
  [UPDATE_MONTH_COUNT]: updateMonthCount,
  [UPDATE_SELECTED_CATEGORY]: updateSelectedCategory,
})
