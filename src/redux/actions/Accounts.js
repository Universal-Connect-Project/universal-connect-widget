import { ActionTypes as MemberActionTypes } from './Members'

import { itemAction, itemsAction, setupAction } from '../../utils/ActionHelpers'
import { getSortedAccountsWithMembers } from '../../utils/Account'
import FireflyAPIUtils from '../../utils/FireflyAPI'

export const ActionTypes = {
  ACCOUNT_ADDED: 'accounts/account_added',
  ACCOUNT_DELETED: 'accounts/account_deleted',
  ACCOUNT_SELECTED: 'accounts/account_selected',
  ACCOUNT_UPDATED: 'accounts/account_updated',
  ACCOUNTS_UPDATED: 'accounts/accounts_updated',
  ACCOUNTS_UPDATED_ERROR: 'accounts/accounts_updated_error',
  ACCOUNTS_LOADED: 'accounts/accounts_loaded',
  ACCOUNTS_REQUEST_INITIATED: 'accounts/accounts_request_initiated',
  ADD_MANUAL_ACCOUNT: 'accounts/add_manual_account',
  ADD_MANUAL_ACCOUNT_SUCCESS: 'accounts/add_manual_account_success',
  ADD_MANUAL_ACCOUNT_ERROR: 'accounts/add_manual_account_error',
  APPLY_ACCOUNT_FILTER: 'accounts/apply_account_filter',
  APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS: 'accounts/apply_account_filter_and_load_totals',
  CANCEL_SELECTED_FILTERS: 'accounts/cancel_selected_filters',
  SELECT_FILTER_ITEM: 'accounts/select_filter_item',
  FAYE_ACCOUNTS_CREATED: 'accounts/faye_accounts_created',
  FAYE_ACCOUNTS_DELETED: 'accounts/faye_accounts_deleted',
  FAYE_ACCOUNTS_UPDATED: 'accounts/faye_accounts_updated',
  MONTHLY_ACCOUNT_BALANCES_LOADED: 'accounts/monthly_account_balances_loaded',
  SELECT_FILTER_GROUP: 'accounts/select_filter_group',
  OPEN_FILTER: 'accounts/open_filter',
  TOGGLE_ALL_FILTERS: 'accounts/toggle_all_filters',
  UPDATE_ARIA_LIVE_REGION: 'accounts/update_aria_live_region',
  UPDATE_FILTER_OPTIONS: 'accounts/update_filter_options',
}

const addAccount = account => itemAction(ActionTypes.ACCOUNT_ADDED, account)
const updateAccount = account => itemAction(ActionTypes.ACCOUNT_UPDATED, account)
const initiateRequest = () => dispatch => dispatch({ type: ActionTypes.ACCOUNTS_REQUEST_INITIATED })
const receiveAccounts = items => ({ type: ActionTypes.ACCOUNTS_LOADED, payload: { items } })
const updateAccounts = accounts => dispatch => dispatch(receiveAccounts(accounts))
const selectAccount = account => ({
  type: ActionTypes.ACCOUNT_SELECTED,
  payload: { details: account },
})

export const addManualAccountSuccess = (account, member, institution) => ({
  type: ActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS,
  payload: { account, member, institution },
})

export const loadAccounts = showLoading => dispatch => {
  if (showLoading) dispatch(initiateRequest())

  return FireflyAPIUtils.loadAccounts().then(({ accounts, members }) => {
    const sortedAccountsWithMembers = getSortedAccountsWithMembers(accounts, members)

    dispatch(receiveAccounts(sortedAccountsWithMembers))
  })
}

const fetchUpdateAccount = account => dispatch => {
  return FireflyAPIUtils.saveAccount(account).then(account => dispatch(updateAccount(account)))
}

const fetchMergeAccounts = accountGuids => dispatch => {
  return FireflyAPIUtils.mergeAccounts(accountGuids).then(() => dispatch(loadAccounts(false)))
}

const markAccount = (account, action) => dispatch => {
  let updatedAccount = {}

  switch (action) {
    case 'close':
      updatedAccount = Object.assign({}, account, { is_closed: true })
      break
    case 'hide':
      updatedAccount = Object.assign({}, account, { is_hidden: true })
      break
    case 'unhide':
      updatedAccount = Object.assign({}, account, { is_hidden: false })
      break
    case 'exclude':
      updatedAccount = Object.assign({}, account, { is_excluded_from_debts: true })
      break
    case 'include':
      updatedAccount = Object.assign({}, account, { is_excluded_from_debts: false })
      break
    default:
      updatedAccount = Object.assign({}, account)
  }

  return FireflyAPIUtils.saveAccount(updatedAccount).then(acct =>
    dispatch(itemAction(ActionTypes.ACCOUNT_UPDATED, acct)),
  )
}

const fetchMonthlyAccountBalances = guid => dispatch =>
  FireflyAPIUtils.loadMonthlyAccountBalances(guid).then(balances =>
    dispatch(setupAction(ActionTypes.MONTHLY_ACCOUNT_BALANCES_LOADED, balances)),
  )

const deleteAccount = account => itemAction(ActionTypes.ACCOUNT_DELETED, account)

const fetchDeleteAccount = account => dispatch => {
  return FireflyAPIUtils.deleteAccount(account)
    .then(() => dispatch(deleteAccount(account)))
    .then(() => FireflyAPIUtils.loadMembers())
    .then(members => dispatch(itemsAction(MemberActionTypes.MEMBERS_LOADED, members)))
}

export const updateAccountFilterOptions = accounts => ({
  type: ActionTypes.UPDATE_FILTER_OPTIONS,
  payload: accounts,
})

/**
 * TODO: Remove 'accounts' default once we are persisting
 * widget specific account filter and caller is providing
 * widgetName argument.
 */
export const applyAccountFilter = (selectedAccounts, widgetName = 'accounts') => ({
  type: ActionTypes.APPLY_ACCOUNT_FILTER,
  payload: {
    selectedAccounts,
    widgetName,
  },
})

/**
 * TODO: Remove 'accounts' default once we are persisting
 * widget specific account filter and caller is providing
 * widgetName argument.
 */
export const applyAccountFilterAndLoadTotals = (selectedAccounts, widgetName = 'accounts') => ({
  type: ActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS,
  payload: {
    selectedAccounts,
    widgetName,
  },
})

export const addManualAccount = account => ({
  type: ActionTypes.ADD_MANUAL_ACCOUNT,
  payload: account,
})

export const openFilter = () => ({
  type: ActionTypes.OPEN_FILTER,
})

export const cancelSelectedFilters = () => ({
  type: ActionTypes.CANCEL_SELECTED_FILTERS,
})

export const updateAriaLiveRegion = msg => ({
  type: ActionTypes.UPDATE_ARIA_LIVE_REGION,
  payload: msg,
})

export const dispatcher = dispatch => ({
  addAccount: account => dispatch(addAccount(account)),
  addManualAccount: account => dispatch({ type: ActionTypes.ADD_MANUAL_ACCOUNT, payload: account }),
  applyAccountFilter: (selectedAccounts, widgetName) =>
    dispatch(applyAccountFilter(selectedAccounts, widgetName)),
  applyAccountFilterAndLoadTotals: (selectAccounts, widgetName) =>
    dispatch(applyAccountFilterAndLoadTotals(selectAccounts, widgetName)),
  cancelSelectedFilters: () => dispatch(cancelSelectedFilters()),
  deleteAccount: account => dispatch(fetchDeleteAccount(account)),
  loadAccounts: (showLoading = true) => dispatch(loadAccounts(showLoading)),
  loadMonthlyAccountBalances: guid => dispatch(fetchMonthlyAccountBalances(guid)),
  markAccount: (account, type) => dispatch(markAccount(account, type)),
  mergeAccounts: accountGuids => dispatch(fetchMergeAccounts(accountGuids)),
  selectAccount: account => dispatch(selectAccount(account)),
  selectFilterGroup: groupName => dispatch(setupAction(ActionTypes.SELECT_FILTER_GROUP, groupName)),
  selectFilterItem: guid => dispatch(setupAction(ActionTypes.SELECT_FILTER_ITEM, guid)),
  openFilter: () => dispatch(openFilter()),
  toggleAllFilters: () => dispatch(setupAction(ActionTypes.TOGGLE_ALL_FILTERS)),
  updateAccount: account => dispatch(fetchUpdateAccount(account)),
  //TODO: Remove once flux is gone
  updateAccountLocally: account => dispatch(updateAccount(account)),
  updateAccounts: accounts => dispatch(updateAccounts(accounts)),
  updateAccountFilterOptions: options => dispatch(updateAccountFilterOptions(options)),
  updateAriaLiveRegion: msg => dispatch(updateAriaLiveRegion(msg)),
})
