export const ActionTypes = {
  LOAD_TRANSACTIONS_BY_PAGINATION: 'transactionspaginated/load_transactions_by_pagination',
  LOADED_TRANSACTIONS_BY_PAGINATION: 'transactionspaginated/loaded_transactions_by_pagination',
  CHANGED_TRANSACTIONS_BY_PAGINATION_FILTER:
    'transactionspaginated/changed_transactions_by_pagination_filter',
  ERROR_LOADING_TRANSACTIONS_BY_PAGINATION:
    'transactionspaginated/error_loading_transactions_by_pagination',
}

export const loadTransactionsByPagination = (startDate, endDate) => ({
  type: ActionTypes.LOAD_TRANSACTIONS_BY_PAGINATION,
  payload: {
    startDate,
    endDate,
  },
})
