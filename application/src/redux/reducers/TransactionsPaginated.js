import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/TransactionsPaginated'

const {
  LOAD_TRANSACTIONS_BY_PAGINATION,
  LOADED_TRANSACTIONS_BY_PAGINATION,
  CHANGED_TRANSACTIONS_BY_PAGINATION_FILTER,
  ERROR_LOADING_TRANSACTIONS_BY_PAGINATION,
} = ActionTypes

export const defaultState = {
  endDate: null,
  error: null,
  isLoading: false,
  showFrom: null,
  showUntil: null,
  startDate: null,
  transactions: [],
}

const transactionsLoaded = (state, action) => ({
  endDate: action.payload.endDate,
  error: null,
  isLoading: false,
  startDateFilter: action.payload.startDateFilter,
  endDateFilter: action.payload.endDateFilter,
  startDate: action.payload.startDate,
  transactions: { ...state.transactions, ...action.payload.transactions },
})

const transactionsLoading = state => ({ ...state, error: null, isLoading: true })

const transactionsLoadingError = (state, action) => ({
  ...state,
  error: action.payload.error,
  isLoading: false,
})

const transactionsFilterChanged = (state, action) => ({
  ...state,
  startDateFilter: action.payload.startDateFilter,
  endDateFilter: action.payload.endDateFilter,
  isLoading: false,
})

export default createReducer(defaultState, {
  [LOAD_TRANSACTIONS_BY_PAGINATION]: transactionsLoading,
  [LOADED_TRANSACTIONS_BY_PAGINATION]: transactionsLoaded,
  [ERROR_LOADING_TRANSACTIONS_BY_PAGINATION]: transactionsLoadingError,
  [CHANGED_TRANSACTIONS_BY_PAGINATION_FILTER]: transactionsFilterChanged,
})
