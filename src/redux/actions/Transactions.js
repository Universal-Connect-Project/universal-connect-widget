import { initiateRequest, setupAction } from '../../utils/ActionHelpers'
import { updateObject } from '../../utils/Reducer'
import * as TransactionUtils from '../../utils/Transaction'
import FireflyAPI from '../../utils/FireflyAPI'

import categoryTotalsDispatcher from './CategoryTotals'

export const ActionTypes = {
  CREATE_MANUAL_TRANSACTION: 'transactions/create_manual_transaction',
  DEFAULT_MANUAL_TRANSACTION_SELECTED: 'transactions/default_manual_transaction_selected',
  EDIT_TRANSACTION: 'transactions/edit_transaction',
  EDIT_TRANSACTION_CATEGORY: 'transactions/edit_transaction_category',
  FAYE_TRANSACTIONS_UPDATED: 'transactions/faye_transactions_updated',
  LOAD_TRANSACTIONS_BY_PAGINATION: 'transactions/load_transactions_by_pagination',
  MANUAL_TRANSACTION_CREATED: 'transactions/manual_transaction_created',
  SET_TRANSACTION_ATTRIBUTES: 'transactions/set_transaction_attributes',
  TRANSACTION_DELETED: 'transactions/transaction_deleted',
  TRANSACTIONS_LOADED: 'transactions/transactions_loaded',
  TRANSACTION_SPLIT_CREATED: 'transactions/transaction_split_created',
  TRANSACTION_SPLIT_DELETED: 'transactions/transaction_split_deleted',
  TRANSACTIONS_LOADING: 'transactions/transactions_loading',
  TRANSACTION_SPLIT_SELECTED: 'transactions/transaction_split_selected',
  TRANSACTION_BATCH_UPDATED: 'transactions/transaction_batch_update',
  TRANSACTION_UPDATED: 'transactions/transaction_updated',
  TRANSACTIONS_UPDATED: 'transactions/transactions_updated',
  UPDATE_TRANSACTIONS_SEARCH: 'transactions/update_transactions_search',
  UPDATE_TRANSACTIONS_SORT: 'transactions/update_transactions_sort',
  RESET_TRANSACTION: 'transactions/reset_transaction',
}

export const manualTransactionCreated = item => ({
  type: ActionTypes.MANUAL_TRANSACTION_CREATED,
  payload: { item },
})

export const selectDefaultManualTransaction = () => ({
  type: ActionTypes.DEFAULT_MANUAL_TRANSACTION_SELECTED,
})

export const resetTransaction = () => ({ type: ActionTypes.RESET_TRANSACTION })

export const removeTransactionFromCollection = guid => dispatch =>
  dispatch(transactionDeleted(guid))

export const transactionAttributesSet = attributes => ({
  type: ActionTypes.SET_TRANSACTION_ATTRIBUTES,
  payload: { attributes },
})

export const transactionDeleted = guid => ({
  type: ActionTypes.TRANSACTION_DELETED,
  payload: { guid },
})

export const transactionUpdated = (item, children = []) => ({
  type: ActionTypes.TRANSACTION_UPDATED,
  payload: { item, children },
})

export const transactionBatchUpdated = batch => ({
  type: ActionTypes.TRANSACTION_BATCH_UPDATED,
  payload: batch,
})

export const transactionsLoaded = items => ({
  type: ActionTypes.TRANSACTIONS_LOADED,
  payload: { items },
})

export const transactionsLoading = () => initiateRequest(ActionTypes.TRANSACTIONS_LOADING)

export const searchTransactions = searchTerm => ({
  type: ActionTypes.UPDATE_TRANSACTIONS_SEARCH,
  payload: { searchTerm },
})

export const selectTransaction = payload => ({ type: ActionTypes.EDIT_TRANSACTION, payload })

export const sortTransactions = sortColumn => ({
  type: ActionTypes.UPDATE_TRANSACTIONS_SORT,
  payload: { sortColumn },
})

export const transactionSplitCreated = (parent, children = []) => ({
  type: ActionTypes.TRANSACTION_SPLIT_CREATED,
  payload: { parent, children },
})

export const transactionSplitDeleted = transactionGuid => ({
  type: ActionTypes.TRANSACTION_SPLIT_DELETED,
  payload: transactionGuid,
})

export const selectTransactionSplit = guid =>
  setupAction(ActionTypes.TRANSACTION_SPLIT_SELECTED, guid)

export const editTransactionCategory = edit =>
  setupAction(ActionTypes.EDIT_TRANSACTION_CATEGORY, edit)

export const createManualTransaction = transaction =>
  setupAction(ActionTypes.CREATE_MANUAL_TRANSACTION, transaction)

export const createTransactionSplit = (parent, childTransactions) => dispatch =>
  FireflyAPI.createTransactionSplit(parent, childTransactions).then(({ children }) => {
    const childTransactions = children.map(
      TransactionUtils.buildTransactionDetailsFromParent(parent),
    )
    const updatedTransaction = updateObject(parent, {
      has_been_split: true,
    })

    return dispatch(transactionSplitCreated(updatedTransaction, childTransactions))
  })

export const deleteTransaction = guid => dispatch =>
  FireflyAPI.deleteTransaction(guid).then(() => dispatch(transactionDeleted(guid)))

export const deleteTransactionSplit = parentGuid => dispatch => {
  return FireflyAPI.deleteTransactionSplit(parentGuid).then(() => {
    dispatch(transactionSplitDeleted(parentGuid))
  })
}

export const saveTransaction = transaction => dispatch =>
  FireflyAPI.updateTransaction(transaction).then(transaction => {
    return dispatch(transactionUpdated(TransactionUtils.buildTransactionDetails(transaction)))
  })

export const loadSuggestedTransactions = accounts => dispatch => {
  dispatch(transactionsLoading())
  return FireflyAPI.loadSuggestedTransactions(accounts).then(transactions =>
    dispatch(transactionsLoaded(transactions)),
  )
}

export const loadTransactionsByAccountGuid = (accountGuid, startDate, endDate) => dispatch => {
  dispatch(transactionsLoading())
  return FireflyAPI.loadTransactionsByAccount(accountGuid, startDate, endDate).then(transactions =>
    dispatch(transactionsLoaded(transactions)),
  )
}

export const loadTransactionsByCategoryGuids = (
  guids,
  startDate,
  endDate,
  accounts,
  categories,
) => dispatch => {
  dispatch(transactionsLoading())
  return FireflyAPI.loadTransactionsByCategoryGuids(
    guids,
    startDate,
    endDate,
    accounts,
    categories,
  ).then(transactions => dispatch(transactionsLoaded(transactions)))
}

export const loadTransactionsByDateRange = (startDate, endDate, dateRangeType) => dispatch => {
  dispatch(transactionsLoading())
  categoryTotalsDispatcher(dispatch).setDateRange(startDate, endDate, dateRangeType)
  return FireflyAPI.loadTransactionsByDateRange(startDate, endDate).then(transactions => {
    dispatch(transactionsLoaded(transactions))
  })
}

export const loadTransactionsByParentCategoryGuids = (
  parentGuids,
  startDate,
  endDate,
) => dispatch => {
  dispatch(transactionsLoading())
  FireflyAPI.loadTransactionsByParentCategoryGuids(
    parentGuids,
    startDate,
    endDate,
  ).then(transactions => dispatch(transactionsLoaded(transactions)))
}

export const loadTransactionsNearestCashFlowEvent = event => dispatch => {
  dispatch(transactionsLoading())
  FireflyAPI.loadTransactionsNearestCashflowEvent(event).then(transactions =>
    dispatch(transactionsLoaded(transactions)),
  )
}

export const massEditTransactionCategory = (feedDescription, categoryGuid) => () =>
  FireflyAPI.massEditTransactionCategory(feedDescription, categoryGuid).catch(response => response)

export default dispatch => ({
  createManualTransaction: transaction => dispatch(createManualTransaction(transaction)),
  createTransactionSplit: (parent, childTransactions) =>
    dispatch(createTransactionSplit(parent, childTransactions)),
  deleteTransaction: guid => dispatch(deleteTransaction(guid)),
  deleteTransactionSplit: parentGuid => dispatch(deleteTransactionSplit(parentGuid)),
  editTransactionCategory: edit => dispatch(editTransactionCategory(edit)),
  saveTransaction: transaction => dispatch(saveTransaction(transaction)),
  loadSuggestedTransactions: (accounts, categories) =>
    dispatch(loadSuggestedTransactions(accounts, categories)),
  loadTransactionsByDateRangeWithPagination: (startDate, endDate) =>
    dispatch({
      type: ActionTypes.LOAD_TRANSACTIONS_BY_PAGINATION,
      payload: { startDate, endDate },
    }),
  loadTransactionsByAccount: (accountGuid, startDate, endDate, accounts, categories) =>
    dispatch(loadTransactionsByAccountGuid(accountGuid, startDate, endDate, accounts, categories)),
  loadTransactionsByCategoryGuids: (guids, startdate, enddate, accounts, categories) =>
    dispatch(loadTransactionsByCategoryGuids(guids, startdate, enddate, accounts, categories)),
  loadTransactionsByDateRange: (startDate, endDate, dateRangeType) =>
    dispatch(loadTransactionsByDateRange(startDate, endDate, dateRangeType)),
  loadTransactionsByParentCategoryGuids: (parentGuids, startDate, endDate, accounts, categories) =>
    dispatch(
      loadTransactionsByParentCategoryGuids(parentGuids, startDate, endDate, accounts, categories),
    ),
  loadTransactionsNearestCashflowEvent: (event, accounts, categories) =>
    dispatch(loadTransactionsNearestCashFlowEvent(event, accounts, categories)),
  manualTransactionCreated: item => dispatch(manualTransactionCreated(item)),
  massEditTransactionCategory: (feedDescription, categoryGuid) =>
    dispatch(massEditTransactionCategory(feedDescription, categoryGuid)),
  removeTransactionFromCollection: guid => dispatch(removeTransactionFromCollection(guid)),
  resetTransaction: () => dispatch(resetTransaction()),
  selectDefaultManualTransaction: () => dispatch(selectDefaultManualTransaction()),
  setTransactionAttributes: attributes => dispatch(transactionAttributesSet(attributes)),
  searchTransactions: searchTerm => dispatch(searchTransactions(searchTerm)),
  selectTransaction: transaction => dispatch(selectTransaction(transaction)),
  sortTransactions: column => dispatch(sortTransactions(column)),
  selectTransactionSplit: guid => dispatch(selectTransactionSplit(guid)),
})
