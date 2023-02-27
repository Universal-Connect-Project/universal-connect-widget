import _size from 'lodash/size'
import { from, of } from 'rxjs'
import {
  catchError,
  debounceTime,
  filter,
  flatMap,
  map,
  mergeMap,
  pluck,
  repeat,
  scan,
  take,
} from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { TransactionUpdated$ } from '../../streams/transactions'

import { ActionTypes } from '../actions/TransactionRules'
import { ActionTypes as TransactionActionTypes } from '../actions/Transactions'

export const loadTransactionRules = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.RULES_LOADING),
    flatMap(() =>
      from(FireflyAPI.loadTransactionRules()).pipe(
        map(items => ({ type: ActionTypes.RULES_LOADED, payload: { items } })),
        catchError(err => {
          return of({ type: ActionTypes.RULES_LOADED_ERROR, payload: err })
        }),
      ),
    ),
  )

export const createTransactionRule = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.CREATE_RULE),
    pluck('payload'),
    flatMap(rule =>
      from(FireflyAPI.createTransactionRule(rule)).pipe(
        map(({ transaction_rule }) => ({
          type: ActionTypes.RULE_CREATED,
          payload: { item: transaction_rule },
        })),
        catchError(err => {
          return of({ type: ActionTypes.RULE_CREATED_ERROR, payload: err })
        }),
      ),
    ),
  )

export const deleteTransactionRule = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.DELETE_RULE),
    pluck('payload'),
    flatMap(({ item }) =>
      from(FireflyAPI.deleteTransactionRule(item.guid)).pipe(
        map(() => ({ type: ActionTypes.RULE_DELETED, payload: { item } })),
        catchError(err => {
          return of({ type: ActionTypes.RULE_DELETED_ERROR, payload: err })
        }),
      ),
    ),
  )

export const saveTransactionRule = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.SAVE_RULE),
    pluck('payload'),
    flatMap(({ item }) =>
      from(FireflyAPI.saveTransactionRule({ transaction_rule: item })).pipe(
        map(({ transaction_rule }) => ({
          type: ActionTypes.RULE_SAVED,
          payload: { item: transaction_rule },
        })),
        catchError(err => {
          return of({ type: ActionTypes.RULE_SAVED_ERROR, payload: err })
        }),
      ),
    ),
  )

export const transactionRuleSaved = action$ =>
  action$.pipe(
    ofType(ActionTypes.RULE_SAVED),
    mergeMap(() => {
      return TransactionUpdated$.pipe(
        scan((acc, updatedTransaction) => {
          return { ...acc, [updatedTransaction.guid]: updatedTransaction }
        }, {}),
        debounceTime(5000),
        filter(transactions => _size(transactions) > 1),
        take(1),
        repeat(),
        map(() => ({
          type: TransactionActionTypes.TRANSACTIONS_UPDATED,
        })),
      )
    }),
    take(1),
    repeat(),
  )
