import { initiateRequest, itemAction, setupAction } from '../../utils/ActionHelpers'
import moment from 'moment'

export const ActionTypes = {
  ACCOUNT_CLEARED: 'accountdetailsdrawer/account_cleared',
  ACCOUNT_SELECTED: 'accountdetailsdrawer/account_selected',
  ACCOUNT_UPDATED: 'accountdetailsdrawer/account_updated',
  INITIAL_TRANSACTIONS_LOADING: 'accountdetailsdrawer/initial_transactions_loading',
  MONTHLY_ACCOUNT_BALANCES_LOADED: 'accountdetailsdrawer/monthly_account_balances_loaded',
  MORE_TRANSACTIONS_LOADING: 'accountdetailsdrawer/more_transactions_loading',
  MORE_TRANSACTIONS_LOADED_FOR_ACCOUNT: 'accountdetailsdrawer/more_transactions_loaded_for_account',
  SAVE_EDIT_FORM: 'accountdetailsdrawer/save_edit_form',
  SAVE_EDIT_FORM_SUCCESS: 'accountdetailsdrawer/save_edit_form_success',
  SAVE_EDIT_FORM_ERROR: 'accountdetailsdrawer/save_edit_form_error',
  SELECTED_HISTORY_BAR_TRANSACTIONS_LOADING:
    'accountdetailsdrawer/selected_history_bar_transactions_loading',
  SHOW_EDIT_VIEW: 'accountdetailsdrawer/show_edit_view',
  SHOW_DETAIL_VIEW: 'accountdetailsdrawer/show_detail_view',
  SHOW_HISTORY_VIEW: 'accountdetailsdrawer/show_history_view',
  SHOW_FIELD_SELECT: 'accountdetailsdrawer/show_field_select',
  HIDE_FIELD_SELECT: 'accountdetailsdrawer/hide_field_select',
  TRANSACTIONS_LOADED_BY_ACCOUNT: 'accountdetailsdrawer/transactions_loaded_by_account',
  TRANSACTIONS_LOADED_FOR_SELECTED_HISTORY_BAR:
    'accountdetailsdrawer/transactions_loaded_for_selected_history_bar',
  UPDATE_EDIT_FORM: 'accountdetailsdrawer/update_edit_form',
  VALIDATE_EDIT_FORM: 'accountdetailsdrawer/validate_edit_form',
}
import FireflyAPI from '../../utils/FireflyAPI'

const clearAccount = () => ({
  type: ActionTypes.ACCOUNT_CLEARED,
})
const selectAccount = account => itemAction(ActionTypes.ACCOUNT_SELECTED, account)
const updateAccount = account => itemAction(ActionTypes.ACCOUNT_UPDATED, account)
const transactionsLoadedForAccount = items => ({
  type: ActionTypes.TRANSACTIONS_LOADED_BY_ACCOUNT,
  payload: { items },
})
const moreTransactionsLoadedForAccount = (transactions, start, end) => ({
  type: ActionTypes.MORE_TRANSACTIONS_LOADED_FOR_ACCOUNT,
  payload: { items: transactions, start, end },
})

const transactionsLoadedForSelectedHistoryBar = items => ({
  type: ActionTypes.TRANSACTIONS_LOADED_FOR_SELECTED_HISTORY_BAR,
  payload: { items },
})

const fetchInitialTransactionsByAccountGuid = accountGuid => (dispatch, getState) => {
  const state = getState()
  const startDate = state.accountDetailsDrawer.transactionDateRange.start
  const endDate = state.accountDetailsDrawer.transactionDateRange.end

  dispatch(initiateRequest(ActionTypes.INITIAL_TRANSACTIONS_LOADING))
  return FireflyAPI.loadTransactionsByAccount(accountGuid, startDate, endDate).then(transactions =>
    dispatch(transactionsLoadedForAccount(transactions)),
  )
}

const fetchMonthlyAccountBalances = guid => dispatch =>
  FireflyAPI.loadMonthlyAccountBalances(guid).then(balances =>
    dispatch(setupAction(ActionTypes.MONTHLY_ACCOUNT_BALANCES_LOADED, balances)),
  )

const fetchMoreTransactionsForAccount = accountGuid => (dispatch, getState) => {
  const state = getState()
  const startDate = moment
    .unix(state.accountDetailsDrawer.transactionDateRange.start)
    .startOf('day')
    .add(-1, 'months')
    .unix()
  const endDate = state.accountDetailsDrawer.transactionDateRange.start

  dispatch(initiateRequest(ActionTypes.MORE_TRANSACTIONS_LOADING))
  return FireflyAPI.loadTransactionsByAccount(accountGuid, startDate, endDate).then(transactions =>
    dispatch(moreTransactionsLoadedForAccount(transactions, startDate, endDate)),
  )
}

const fetchTransactionsForSelectedHistoryBar = (accountGuid, startDate, endDate) => dispatch => {
  dispatch(initiateRequest(ActionTypes.SELECTED_HISTORY_BAR_TRANSACTIONS_LOADING))
  return FireflyAPI.loadTransactionsByAccount(accountGuid, startDate, endDate).then(transactions =>
    dispatch(transactionsLoadedForSelectedHistoryBar(transactions)),
  )
}

const fetchUpdateAccount = account => dispatch => {
  // To prevent a flicker in the UI, optimistically set the state to the
  // updated account while we wait for the server response.
  dispatch(updateAccount(account))
  return FireflyAPI.saveAccount(account).then(account =>
    // update with the final server response
    dispatch(updateAccount(account)),
  )
}

export const showEditView = () => setupAction(ActionTypes.SHOW_EDIT_VIEW)
export const showDetailView = () => setupAction(ActionTypes.SHOW_DETAIL_VIEW)
export const updateEditForm = data => setupAction(ActionTypes.UPDATE_EDIT_FORM, data)
export const validateEditForm = () => setupAction(ActionTypes.VALIDATE_EDIT_FORM)
export const saveEditForm = form => setupAction(ActionTypes.SAVE_EDIT_FORM, form)
export const showFieldSelect = fieldName => setupAction(ActionTypes.SHOW_FIELD_SELECT, fieldName)
export const showHistoryView = () => setupAction(ActionTypes.SHOW_HISTORY_VIEW)
export const hideFieldSelect = () => ({
  type: ActionTypes.HIDE_FIELD_SELECT,
})

export const dispatcher = dispatch => ({
  clearAccount: () => dispatch(clearAccount()),
  selectAccount: account => dispatch(selectAccount(account)),
  updateAccount: account => dispatch(fetchUpdateAccount(account)),
  loadMonthlyAccountBalances: guid => dispatch(fetchMonthlyAccountBalances(guid)),
  loadMoreTransactionsForAccount: accountGuid =>
    dispatch(fetchMoreTransactionsForAccount(accountGuid)),
  loadInitialTransactionsByAccount: accountGuid =>
    dispatch(fetchInitialTransactionsByAccountGuid(accountGuid)),
  loadTransactionsForSelectedHistoryBar: (accountGuid, startDate, endDate) =>
    dispatch(fetchTransactionsForSelectedHistoryBar(accountGuid, startDate, endDate)),
})
