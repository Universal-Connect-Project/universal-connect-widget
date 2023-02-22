import _pick from 'lodash/pick'
import moment from 'moment'
import { ActionTypes } from '../actions/AccountDetailsDrawer'
import { ActionTypes as AccountActionTypes } from '../actions/Accounts'
import { ActionTypes as TransactionActionTypes } from '../actions/Transactions'
import { ActionTypes as NetWorthActionTypes } from '../actions/NetWorth'

import { createReducer, updateObject } from '../../utils/Reducer'
import Validation from '../../utils/Validation'
import {
  getEditFormFields,
  EDIT_ACCOUNT_FORM_SCHEMA,
} from '../../components/accounts/utils/AccountDetailsFields'

export const DETAIL_VIEW = 'details'
export const HISTORY_VIEW = 'history'
export const EDIT_VIEW = 'edit'

export const defaultState = {
  account: {},
  activeView: DETAIL_VIEW,
  form: {},
  formIsSaving: false,
  formErrors: null,
  fieldSelect: null,
  initialTransactionsLoading: true,
  moreTransactionsLoading: false,
  monthlyAccountBalances: [],
  selectedHistoryBarTransactions: [],
  selectedHistoryBarTransactionsLoading: false,
  transactions: [],
  transactionDateRange: {
    end: moment()
      .endOf('day')
      .unix(),
    start: moment()
      .startOf('day')
      .add(-1, 'months')
      .unix(),
  },
}

const clearAccount = () => defaultState

const selectAccount = (state, action) => ({
  ...state,
  account: action.payload.item,
  form: defaultState.form,
})

const setInitialTransactionsLoading = state => ({ ...state, initialTransactionsLoading: true })

const setMoreTransactionsLoading = state => ({ ...state, moreTransactionsLoading: true })

const setSelectedHistoryBarTransactionsLoading = state => ({
  ...state,
  selectedHistoryBarTransactionsLoading: true,
})

const updateAccount = (state, action) => {
  const updatedAccount = state.account.guid === action.payload.item.guid ? action.payload.item : {}

  return { ...state, account: { ...state.account, ...updatedAccount } }
}

const updateTransaction = (state, action) => {
  const updatedTransactionGuid = action.payload.item.guid
  const selectedHistoryBarTransactions = state.selectedHistoryBarTransactions.map(transaction => {
    return transaction.guid === updatedTransactionGuid
      ? { ...transaction, ...action.payload.item }
      : transaction
  })
  const transactions = state.transactions.map(transaction => {
    return transaction.guid === updatedTransactionGuid
      ? { ...transaction, ...action.payload.item }
      : transaction
  })

  return { ...state, selectedHistoryBarTransactions, transactions }
}

const loadMonthlyAccountBalances = (state, action) => ({
  ...state,
  monthlyAccountBalances: action.payload,
})

const loadMoreTransactions = (state, action) => ({
  ...state,
  moreTransactionsLoading: false,
  transactions: [...state.transactions, ...action.payload.items],
  transactionDateRange: {
    start: action.payload.start,
    end: action.payload.end,
  },
})

const loadTransactionsForSelectedHistoryBar = (state, action) => ({
  ...state,
  selectedHistoryBarTransactionsLoading: false,
  selectedHistoryBarTransactions: action.payload.items,
})

const loadTransactions = (state, action) => ({
  ...state,
  initialTransactionsLoading: false,
  moreTransactionsLoading: false,
  transactions: action.payload.items,
})

/**
 * Update the new incoming value and validate it. Never change original value
 */
const updateEditForm = (state, action) => {
  // If they are changing the account type, we have to change the set of fields
  // they are editing. The result is a combination of existing account fields,
  // preserving any fields changed by the form, and the updated account_type.
  // Hence all of the object spreading.
  if (action.payload.hasOwnProperty('account_type')) {
    const editedAccountData = { ...state.account, ...state.form, ...action.payload }

    return {
      ...state,
      form: _pick(editedAccountData, getEditFormFields(editedAccountData)),
    }
  }

  return {
    ...state,
    form: {
      ...state.form,
      ...action.payload,
    },
  }
}

const validateEditForm = state => {
  return {
    ...state,
    formErrors: Validation.validate(EDIT_ACCOUNT_FORM_SCHEMA, state.form),
  }
}

/**
 * Show the drawer and build form data based on the selected account
 */
const showEditView = state => ({
  ...state,
  activeView: EDIT_VIEW,
  form: _pick(state.account, getEditFormFields(state.account)),
  formErrors: Validation.validate(
    EDIT_ACCOUNT_FORM_SCHEMA,
    _pick(state.account, getEditFormFields(state.account)),
  ),
})

/**
 * Change to detail view, remember to clear all form data
 */
const showDetailView = state => ({
  ...state,
  activeView: DETAIL_VIEW,
  form: defaultState.form,
  formErrors: defaultState.formErrors,
})

/**
 * Change to hisotry view, remember to clear all form data
 */
const showHistoryView = state => ({
  ...state,
  activeView: HISTORY_VIEW,
  form: defaultState.form,
  formErrors: defaultState.formErrors,
})

const saveEditForm = state => ({ ...state, formIsSaving: true })

/**
 * Should clear the form, update account and close the drawer
 */
const saveEditFormSuccess = (state, action) => ({
  ...state,
  account: action.payload.item,
  form: defaultState.form,
  formIsSaving: false,
  activeView: DETAIL_VIEW,
})

const saveEditFormError = state => ({ ...state, formIsSaving: false })

const showFieldSelect = (state, action) => ({
  ...state,
  fieldSelect: action.payload,
})

const hideFieldSelect = state => ({
  ...state,
  fieldSelect: null,
})

const splitCreated = (state, { payload }) => {
  const updatedTransaction = payload.parent
  const newChildren = payload.children

  const transactions = state.transactions
    .map(transaction => {
      if (transaction.guid === updatedTransaction.guid) {
        return updateObject(transaction, updatedTransaction)
      }

      return transaction
    })
    .concat(newChildren)

  return updateObject(state, { transactions })
}

const splitDeleted = (state, { payload }) => {
  const transactions = state.transactions.reduce((acc, transaction) => {
    if (transaction.parent_guid === payload) {
      return acc
    } else if (transaction.guid === payload) {
      return [...acc, { ...transaction, has_been_split: false }]
    } else {
      return [...acc, transaction]
    }
  }, [])

  return { ...state, transactions }
}

const deleteTransaction = (state, action) => {
  return {
    ...state,
    transactions: state.transactions.filter(item => item.guid !== action.payload.guid),
  }
}

const editManualNetWorthAccount = (state, action) => {
  return {
    ...state,
    account: action.payload,
    activeView: EDIT_VIEW,
    form: _pick(action.payload, getEditFormFields(action.payload)),
    formErrors: Validation.validate(
      EDIT_ACCOUNT_FORM_SCHEMA,
      _pick(action.payload, getEditFormFields(action.payload)),
    ),
  }
}

export const accountDetailsDrawer = createReducer(defaultState, {
  [ActionTypes.ACCOUNT_CLEARED]: clearAccount,
  [ActionTypes.ACCOUNT_SELECTED]: selectAccount,
  [ActionTypes.ACCOUNT_UPDATED]: updateAccount,
  [ActionTypes.MONTHLY_ACCOUNT_BALANCES_LOADED]: loadMonthlyAccountBalances,
  [ActionTypes.HIDE_FIELD_SELECT]: hideFieldSelect,
  [ActionTypes.INITIAL_TRANSACTIONS_LOADING]: setInitialTransactionsLoading,
  [ActionTypes.MORE_TRANSACTIONS_LOADING]: setMoreTransactionsLoading,
  [ActionTypes.MORE_TRANSACTIONS_LOADED_FOR_ACCOUNT]: loadMoreTransactions,
  [ActionTypes.SAVE_EDIT_FORM]: saveEditForm,
  [ActionTypes.SAVE_EDIT_FORM_SUCCESS]: saveEditFormSuccess,
  [ActionTypes.SAVE_EDIT_FORM_ERROR]: saveEditFormError,
  [ActionTypes.SELECTED_HISTORY_BAR_TRANSACTIONS_LOADING]: setSelectedHistoryBarTransactionsLoading,
  [ActionTypes.SHOW_DETAIL_VIEW]: showDetailView,
  [ActionTypes.SHOW_EDIT_VIEW]: showEditView,
  [ActionTypes.SHOW_HISTORY_VIEW]: showHistoryView,
  [ActionTypes.SHOW_FIELD_SELECT]: showFieldSelect,
  [ActionTypes.TRANSACTIONS_LOADED_BY_ACCOUNT]: loadTransactions,
  [ActionTypes.TRANSACTIONS_LOADED_FOR_SELECTED_HISTORY_BAR]: loadTransactionsForSelectedHistoryBar,
  [ActionTypes.UPDATE_EDIT_FORM]: updateEditForm,
  [ActionTypes.VALIDATE_EDIT_FORM]: validateEditForm,
  [AccountActionTypes.FAYE_ACCOUNTS_UPDATED]: updateAccount,
  [NetWorthActionTypes.NET_WORTH_EDIT_MANUAL_ACCOUNT]: editManualNetWorthAccount,
  [TransactionActionTypes.TRANSACTION_DELETED]: deleteTransaction,
  [TransactionActionTypes.TRANSACTION_UPDATED]: updateTransaction,
  [TransactionActionTypes.TRANSACTION_SPLIT_CREATED]: splitCreated,
  [TransactionActionTypes.TRANSACTION_SPLIT_DELETED]: splitDeleted,
})
