import _get from 'lodash/get'
import _find from 'lodash/find'
import { from, of, defer } from 'rxjs'
import {
  catchError,
  flatMap,
  map,
  pluck,
  filter,
  pairwise,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/TransactionsPaginated'
import {
  ActionTypes as TransactionActionTypes,
  manualTransactionCreated,
} from '../actions/Transactions'
import { getDateRange } from '../selectors/CategoryTotals'
import { loadCategoryTotals } from '../actions/CategoryTotals'
import { ActionTypes as TagActionTypes } from '../actions/Tags'

import FireflyAPI from '../../utils/FireflyAPI'

/**
 * @param  {} acc object of accumulated normalized transactions by guid { 'TRN-123': { guid: 'TRN-123', amount: 50 }}
 * @param  {} curr current transactions object { transaction: { guid: 'TRN-123', amount: 50 } }
 * @returns {} normalized transactions by guid { 'TRN-123': { guid: 'TRN-123', amount 50} }
 */
export const normalizePage = (acc, curr) => ({ ...acc, [curr.transaction.guid]: curr.transaction })

export const getDateRanges = ({ storedStartDate, storedEndDate, startDate, endDate }) => {
  //if start date and end date are the same, don't fetch
  if (storedEndDate === endDate && storedStartDate === startDate) {
    return []
  }

  //if storedStartDate or stored endDate are null fetch from startDate to endDate
  if (storedEndDate === null || storedEndDate === null) {
    return [{ startDate, endDate }]
  }

  let dateRanges = []

  //if start date is before stored start date, fetch from new start date to stored start date
  if (startDate < storedStartDate) {
    dateRanges = [{ startDate, endDate: storedStartDate }]
  }
  //if end date is after stored end date, fetch from stored end date to new endDate
  if (endDate > storedEndDate) {
    dateRanges = [...dateRanges, { startDate: storedEndDate, endDate }]
  }

  return dateRanges
}

/**
 * @param  {} acc normalized transactions by guid { 'TRN-123': { }}
 * @param  { data: [{ transaction: { guid: 'TRN-123', amount: 50 } }] } curr current object with data key and page of nested transactions
 * @returns { string: {}} normalized transactions by guid { 'TRN-123': { guid: 'TRN-123', amount 50} }
 */
export const normalizePages = (acc, curr) => ({ ...acc, ...curr.data.reduce(normalizePage, {}) })

/**
 * @param  {} action$ stream of all actions
 * @param  {} state$ stream of the redux store value
 * @param  {} {from} from operator to avoid catching top level stream
 */
export const loadTransactionsByDateRangeWithPagination = (action$, state$) => {
  return action$.pipe(
    ofType(ActionTypes.LOAD_TRANSACTIONS_BY_PAGINATION),
    pluck('payload'),
    flatMap(({ startDate, endDate }) => {
      const storedStartDate = _get(state$, ['value', 'transactionsPaginated', 'startDate'], null)
      const storedEndDate = _get(state$, ['value', 'transactionsPaginated', 'endDate'], null)
      const dates = { storedStartDate, storedEndDate, startDate, endDate }
      const dateRangesToFetch = getDateRanges(dates)
      const dateRangeToStore = {
        endDate: storedEndDate === null ? endDate : Math.max(endDate, storedEndDate),
        startDate: storedStartDate === null ? startDate : Math.min(startDate, storedStartDate),
      }

      if (dateRangesToFetch.length === 0) {
        return of({
          type: ActionTypes.CHANGED_TRANSACTIONS_BY_PAGINATION_FILTER,
          payload: {
            endDateFilter: endDate,
            startDateFilter: startDate,
          },
        })
      }
      return from(
        Promise.all(
          dateRangesToFetch.map(({ startDate, endDate }) => {
            return FireflyAPI.loadTransactionsPagesByDateRange(startDate, endDate)
          }),
        ),
      ).pipe(
        flatMap(responses => responses.map(response => response.data.pages)),
        flatMap(pages =>
          Promise.all(
            pages.map(page => ({ page, startDate, endDate }.map(FireflyAPI.loadTransactionsPage))),
          ),
        ),
        map(response => response.reduce(normalizePages, {})),
        map(transactions => ({
          type: ActionTypes.LOADED_TRANSACTIONS_BY_PAGINATION,
          payload: {
            transactions,
            startDate: dateRangeToStore.startDate,
            endDate: dateRangeToStore.endDate,
            endDateFilter: endDate,
            startDateFilter: startDate,
          },
        })),
        catchError(error => {
          return of({
            type: ActionTypes.ERROR_LOADING_TRANSACTIONS_BY_PAGINATION,
            payload: {
              error,
              startDate,
              endDate,
            },
          })
        }),
      )
    }),
  )
}

export const reloadCategoryTotalsOnTransactionChange = (action$, state$) => {
  // Returns an array of references to the previous and current transactions
  // Used to determine if a change has been made to a transaction that requires category totals to be reloaded
  const transactionsPair$ = state$.pipe(pluck('transactions', 'items'), pairwise())

  return action$.pipe(
    ofType(
      TransactionActionTypes.TRANSACTION_UPDATED,
      TransactionActionTypes.TRANSACTION_SPLIT_CREATED,
      TransactionActionTypes.TRANSACTION_SPLIT_DELETED,
      TransactionActionTypes.TRANSACTION_DELETED,
      TransactionActionTypes.MANUAL_TRANSACTION_CREATED,
      TransactionActionTypes.TRANSACTIONS_UPDATED,
    ),
    pluck('payload', 'item'),
    withLatestFrom(transactionsPair$),
    mergeMap(([item, [oldTransactions]]) => {
      const { startDate, endDate } = getDateRange(state$.value)

      return of(item).pipe(
        filter(item => {
          /*
            By default, reload the category totals when the following actions have been emitted:
              - TRANSACTION_SPLIT_CREATED
              - TRANSACTION_SPLIT_DELETED
              - TRANSACTION_DELETED
              - TRANSACTIONS_UPDATED
            None of the payloads with these actions contain 'items'
          */
          if (!item) {
            return true
          }

          // Get the previous transaction
          // Will be undefined if the transaction was manually created
          const storedTransaction = _find(oldTransactions, { guid: item.guid })

          /*
            Reload transactions if the following conditions are true:
              - There was no previous transaction
              - The transaction amount has been changed
              - The transaction category has been changed
              - The transaction date has been changed to outside the current date range
              - The transaction has been hidden
          */
          return (
            !storedTransaction ||
            item.amount !== storedTransaction.amount ||
            item.category_guid !== storedTransaction.category_guid ||
            item.date < startDate ||
            item.date > endDate ||
            item.is_hidden !== storedTransaction.is_hidden
          )
        }),
        map(() => loadCategoryTotals(startDate, endDate)),
      )
    }),
  )
}

// Creates a manual transaction then checks if it should be added to the
// transaction list. Only adds the transaction if it is within the current date range
export const createManualTransaction = (action$, state$, { FireflyAPI }) =>
  action$.pipe(
    ofType(TransactionActionTypes.CREATE_MANUAL_TRANSACTION),
    pluck('payload'),
    mergeMap(transaction => {
      const { startDate, endDate } = getDateRange(state$.value)

      return defer(() => FireflyAPI.createManualTransaction(transaction)).pipe(
        mergeMap(item => {
          // Filter out transactions that are outside the current date range
          const manualTransactionCreatedAction =
            item.date > startDate && item.date < endDate ? [manualTransactionCreated(item)] : []
          const taggingActions =
            transaction.tags?.map(tagGuid => ({
              type: TagActionTypes.CREATE_TAGGING,
              payload: { tag_guid: tagGuid, transaction_guid: item.guid },
            })) ?? []

          return from([...manualTransactionCreatedAction, ...taggingActions])
        }),
      )
    }),
  )
