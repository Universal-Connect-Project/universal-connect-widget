import _filter from 'lodash/filter'
import _get from 'lodash/get'
import _orderBy from 'lodash/orderBy'
import _partition from 'lodash/partition'
import * as CategoryConstants from '../../constants/Category'
import { createSelector } from 'reselect'
import { getAccounts, getAccountFilterAppliedGuids } from './Accounts'
import { getCategories } from './Categories'
import * as TransactionUtils from '../../utils/Transaction'
import { buildTransactionDetails, includeTransactionInFilter, buildSplits } from '../../utils/Transaction'

export const getTransaction = state => state.transactions.details

export const getConfigSelectedAccountGuid = state =>
  _get(state, 'initializedClientConfig.transactions.selected_account_guid', null)

export const getTransactionSearchTerm = state => state.transactions.searchTerm

export const getTransactionsLoading = state => state.transactions.loading

export const getTransactionSchema = state => state.transactions.schema

const getTags = state => state.tags.items

const getTaggings = state => state.taggings.items

export const getTransactionErrors = state => state.transactions.errors

export const getTransactions = state => state.transactions.items

export const getPaginatedTransactions = state => {
  const values = state.transactionsPaginated.transactions
    ? Object.values(state.transactionsPaginated.transactions).filter(transaction => {
        return (
          transaction.date >= state.transactionsPaginated.startDateFilter &&
          transaction.date <= state.transactionsPaginated.endDateFilter
        )
      })
    : []

  return values
}

export const getSortColumn = state => state.transactions.sortColumn

export const getSortDirection = state => state.transactions.sortDirection

export const getSelectedSplits = state => state.transactions.selectedSplits

const getTransactionsWithSplits = createSelector(getTransactions, buildSplits)

export const sortDetailedTransactions = (
  sortColumn,
  sortDirection,
  items,
  accounts,
  categories,
) => {
  const transactions = items.map(transaction => {
    const childTransactions =
      transaction.childTransactions && transaction.childTransactions.length
        ? transaction.childTransactions.map(childTransaction => {
            return buildTransactionDetails(childTransaction, accounts, categories)
          })
        : []

    if (childTransactions.length) {
      return buildTransactionDetails(
        Object.assign({}, transaction, { childTransactions }),
        accounts,
        categories,
      )
    }
    return buildTransactionDetails(transaction, accounts, categories)
  })

  const stringColumns = ['account', 'payee', 'category']
  const column =
    stringColumns.indexOf(sortColumn) >= 0
      ? transaction => transaction[sortColumn].toLowerCase()
      : sortColumn
  const sort = ['isPending', column, 'external_guid', 'guid']
  const direction = ['desc', sortDirection, 'desc', 'asc']

  if (!accounts || !accounts.length || !categories || !categories.length) return []

  if (sortColumn === 'amount') {
    return _orderBy(transactions, ['transaction_type'].concat(sort), ['asc'].concat(direction))
  } else {
    return _orderBy(transactions, sort, direction)
  }
}

export const removeChildrenUnlessSelected = (transactions, selectedSplits = []) => {
  const [splits, parents] = _partition(transactions, TransactionUtils.isASplit)

  if (selectedSplits.length > 0) {
    // logic to add splits below their parent.
    return parents.reduce((acc, transaction) => {
      if (selectedSplits.includes(transaction.guid)) {
        const children = splits.filter(split => split.parent_guid === transaction.guid)

        return [...acc, transaction, ...children]
      }

      return [...acc, transaction]
    }, [])
  }

  return parents
}

/**
 * This returns an array of Transactions that is sorted and has nested children.
 *
 * In regards to the transaction tables, you probably don't want to use this
 * directly, but use one of the other more specific selectors branched off of
 * this. This is very generic and should stay that way.
 */
export const getDetailedTransactions = createSelector(
  getSortColumn,
  getSortDirection,
  getTransactionsWithSplits,
  getAccounts,
  getCategories,
  sortDetailedTransactions,
)

/**
 * Get a list of detailed transactions from the getDetailedTransactions selector,
 * but without any child (splits) transactions.  However, if there are selected
 * splits, add them to the list *below* their parent
 */
export const getDetailedTransactionsWithoutChildren = createSelector(
  getDetailedTransactions,
  getSelectedSplits,
  removeChildrenUnlessSelected,
)

/**
 * Get a list of transactions, but without any parents.
 */
export const getDetailedTransactionsWithoutParents = createSelector(
  getDetailedTransactions,
  TransactionUtils.filterOutParentsOfSplits,
)

export const getFilteredTransactionsForBudgets = createSelector(
  getDetailedTransactionsWithoutParents,
  getAccountFilterAppliedGuids,
  (transactions, appliedFilter) => {
    return TransactionUtils.filterTransactionsBySelectedFilters(transactions, appliedFilter)
  },
)

export const getFilteredTransactions = createSelector(
  getDetailedTransactionsWithoutChildren,
  getTransactionSearchTerm,
  getTags,
  getTaggings,
  getConfigSelectedAccountGuid,
  getAccountFilterAppliedGuids,
  (transactions, searchTerm, tags, taggings, selectedAccountGuid, appliedFilter) => {
    let filteredTransactions = transactions

    if (searchTerm.length >= 3) {
      filteredTransactions = transactions.filter(transaction =>
        includeTransactionInFilter(searchTerm, taggings, tags, transaction),
      )
    }

    return TransactionUtils.filterTransactionsBySelectedFilters(
      filteredTransactions,
      appliedFilter,
      selectedAccountGuid,
    )
  },
)

export const getUncategorizedTransactions = createSelector(
  getFilteredTransactions,
  transactions => {
    return (
      _filter(transactions, {
        category_guid: CategoryConstants.Guid.UNCATEGORIZED,
        is_hidden: false,
        has_been_split: false,
      }) || []
    )
  },
)
