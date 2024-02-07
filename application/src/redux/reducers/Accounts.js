import _every from 'lodash/every'
import _uniq from 'lodash/uniq'
import _get from 'lodash/get'

import { ActionTypes as SpendingActionTypes } from '../actions/Spending'
import { createReducer, upsertItem, updateObject } from '../../utils/Reducer'
import { ActionTypes as NetworthActionTypes } from '../actions/NetWorth'
import { ActionTypes } from '../actions/Accounts'
import { ActionTypes as ConnectActionTypes } from '../actions/Connect'
import { ActionTypes as ConnectionsActionTypes } from '../actions/Connections'
import { schema } from '../../schemas/Accounts'
import { AccountTypeNames } from '../../constants/Account'
import { accountFilteredFromWidget } from '../../utils/Account'

export const defaultState = {
  ariaLiveRegionMessage: '',
  details: {},
  items: [],
  loading: true,
  monthlyAccountBalances: [],
  schema,
  filter: {
    open: false,
    options: [],
    selected: [],
    applied: [],
  },
}

const createAccount = (state, action) => {
  const item = action.payload.item
  const name = item.name || item.user_name
  const stateFromUpsert = upsertItem(state, { ...item, name })
  const itemGuid = _get(action, 'payload.item.guid')

  return {
    ...stateFromUpsert,
    filter: {
      ...stateFromUpsert.filter,
      applied: _uniq([...stateFromUpsert.filter.applied, itemGuid]),
      selected: _uniq([...stateFromUpsert.filter.selected, itemGuid]),
    },
  }
}

const addAccount = (state, action) =>
  updateObject(state, { items: [...state.items, action.payload.item], loading: false })

const loadAccounts = (state, action) => {
  const { items, widget } = action.payload
  const selectedAndAppliedAccounts = items
    .filter(item => !accountFilteredFromWidget(item, widget))
    .map(item => item.guid)

  return {
    ...state,
    items,
    loading: false,
    filter: {
      ...state.filter,
      applied: _uniq([...state.filter.applied, ...selectedAndAppliedAccounts]),
      selected: _uniq([...state.filter.selected, ...selectedAndAppliedAccounts]),
    },
  }
}

const selectAccount = (state, action) => {
  const { details } = action.payload

  return updateObject(state, { details })
}

const updateAccount = (state, action) => {
  const item = action.payload.item

  return {
    ...upsertItem(state, item),
    details: { ...state.details, ...item },
    loading: false,
  }
}

const deleteAccount = (state, action) =>
  updateObject(state, {
    items: state.items.filter(item => item.guid !== action.payload.item.guid),
  })

const requestAccounts = state => updateObject(state, { loading: true })

const loadMonthlyAccountBalances = (state, action) =>
  updateObject(state, { monthlyAccountBalances: action.payload })

const updateFilterOptions = (state, { payload }) => ({
  ...state,
  filter: {
    ...state.filter,
    /**
     * We store the accounts used for the options as an
     * array of account guids so that the options array
     * stays normalized with the applied and selected arrays
     * of the filter(also arrays of account guids)
     */
    options: payload.map(option => option.guid),
  },
})

/**
 * Add or remove a a single item to the filter selected state.
 * This should not update applied.
 */
const selectFilterItem = (state, { payload }) => ({
  ...state,
  filter: {
    ...state.filter,
    selected: state.filter.selected.includes(payload)
      ? state.filter.selected.filter(item => item !== payload)
      : state.filter.selected.concat(payload),
  },
})

/**
 * Handle the selection of a group in the account filter. This means one of two
 * things:
 *
 * 1. If all of the visible items under the current group are selected, unselect all of
 *    them.
 *
 * 2. Otherwise, select all of the visible items for the group.
 *
 * Visible items are accounts that are not hidden, deleted, or closed and are
 * included in the filter options array for the current widget. This ensures
 * that toggling a group doesn't effect selected accounts for widgets that are
 * not currently being viewed.
 */
const selectFilterGroup = (state, { payload }) => {
  const { options, selected } = state.filter
  const visibleItems = state.items.filter(account => options.includes(account.guid))
  const accountsForGroup = visibleItems
    .filter(account => AccountTypeNames[account.account_type] === payload)
    .map(account => account.guid)

  const allSelected = _every(accountsForGroup, item => selected.includes(item))

  const newSelected = allSelected
    ? selected.filter(item => !accountsForGroup.includes(item))
    : _uniq(selected.concat(accountsForGroup))

  return {
    ...state,
    filter: {
      ...state.filter,
      selected: [...newSelected],
    },
  }
}

/**
 * Handle an toggle all event in the account filter. The behavior is thus:
 *
 * 1. If all of the visible items are selected, unselect all of them
 *
 * 2. Otherwise, select all visible item.
 *
 * Visible items are accounts that are not hidden, deleted, or closed and are
 * included in the filter options array for the current widget. This ensures
 * that toggling all doesn't effect selected accounts for widgets that are
 * not currently being viewed. eg: a credit type account was deselected in
 * the transaction widget but the user is currently in Cash Flow where credit
 * type accounts are no visible.
 */
const toggleAllFilters = state => {
  const { options, selected } = state.filter
  const visibleItems = state.items.filter(account => options.includes(account.guid))
  const allSelected = _every(visibleItems, account => selected.includes(account.guid))

  return {
    ...state,
    filter: {
      ...state.filter,
      selected: allSelected
        ? selected.filter(accountGuid => !options.includes(accountGuid))
        : _uniq([...selected, ...options]),
    },
  }
}

/**
 * Set the filter's applied state to whatever is in the filter's selected state
 */
const applyAccountFilter = (state, { payload }) => ({
  ...state,
  filter: {
    ...state.filter,
    open: false,
    applied: payload.selectedAccounts,
    selected: payload.selectedAccounts,
  },
})

const cancelSelectedFilters = state => ({
  ...state,
  filter: {
    ...state.filter,
    open: false,
    selected: state.filter.applied,
  },
})

const openFilter = state => ({
  ...state,
  filter: {
    ...state.filter,
    open: true,
  },
})

const addManualAccountSuccess = (state, action) => upsertItem(state, action.payload.account)

const loadConnectionsSuccess = (state, { payload }) => ({
  ...state,
  items: payload.accounts,
})

const updateAriaLiveRegion = (state, action) => ({
  ...state,
  ariaLiveRegionMessage: action.payload,
})

export const accounts = createReducer(defaultState, {
  [ActionTypes.ACCOUNT_ADDED]: addAccount,
  [ActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccountSuccess,
  [ActionTypes.ACCOUNT_DELETED]: deleteAccount,
  [ActionTypes.ACCOUNT_SELECTED]: selectAccount,
  [ActionTypes.ACCOUNT_UPDATED]: updateAccount,
  [ActionTypes.ACCOUNTS_LOADED]: loadAccounts,
  [ActionTypes.ACCOUNTS_REQUEST_INITIATED]: requestAccounts,
  [ActionTypes.CANCEL_SELECTED_FILTERS]: cancelSelectedFilters,
  [ActionTypes.OPEN_FILTER]: openFilter,
  [ActionTypes.MONTHLY_ACCOUNT_BALANCES_LOADED]: loadMonthlyAccountBalances,
  [ActionTypes.FAYE_ACCOUNTS_UPDATED]: updateAccount,
  [ActionTypes.FAYE_ACCOUNTS_CREATED]: createAccount,
  [ActionTypes.FAYE_ACCOUNTS_DELETED]: deleteAccount,
  [ActionTypes.SELECT_FILTER_GROUP]: selectFilterGroup,
  [ActionTypes.SELECT_FILTER_ITEM]: selectFilterItem,
  [ActionTypes.UPDATE_ARIA_LIVE_REGION]: updateAriaLiveRegion,
  [ActionTypes.UPDATE_FILTER_OPTIONS]: updateFilterOptions,
  [NetworthActionTypes.NET_WORTH_DATA_LOADED]: (state, action) =>
    loadAccounts(state, { payload: { items: action.payload.accounts } }),
  [ActionTypes.TOGGLE_ALL_FILTERS]: toggleAllFilters,
  [ActionTypes.APPLY_ACCOUNT_FILTER]: applyAccountFilter,
  [ActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS]: applyAccountFilter,
  [SpendingActionTypes.APPLY_SPENDING_ACCOUNT_FILTER]: applyAccountFilter,
  [ConnectActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccountSuccess,
  [ConnectionsActionTypes.LOAD_CONNECTIONS_SUCCESS]: loadConnectionsSuccess,
})
