import { defer, from, of } from 'rxjs'
import { catchError, map, mergeMap, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import getUnixTime from 'date-fns/getUnixTime'
import subMonths from 'date-fns/subMonths'

import FireflyAPI from '../../utils/FireflyAPI'

import { ActionTypes } from '../actions/SpendingPlan'
import { ActionTypes as TransactionActionTypes } from '../actions/Transactions'

import { deleteCategory } from '../actions/Categories'

export const loadSpendingPlan = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_SPENDING_PLAN),
    pluck('payload'),
    mergeMap(guid =>
      defer(() => FireflyAPI.fetchSpendingPlan(guid)).pipe(
        map(data => ({ type: ActionTypes.LOAD_SPENDING_PLAN_SUCCESS, payload: data })),
        catchError(err => of({ type: ActionTypes.LOAD_SPENDING_PLAN_ERROR, payload: err })),
      ),
    ),
  )

export const loadSpendingPlanMonthlyCategoryTotals = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_MONTHLY_CATEGORY_TOTALS),
    pluck('payload'),
    mergeMap(accountGuids =>
      defer(() =>
        FireflyAPI.loadMonthlyCategoryTotalsByAccount(
          getUnixTime(subMonths(new Date(), 5)),
          getUnixTime(new Date()),
          accountGuids,
        ),
      ).pipe(
        map(data => ({ type: ActionTypes.LOAD_MONTHLY_CATEGORY_TOTALS_SUCCESS, payload: data })),
        catchError(err =>
          of({ type: ActionTypes.LOAD_MONTHLY_CATEGORY_TOTALS_ERROR, payload: err }),
        ),
      ),
    ),
  )

export const loadSpendingPlans = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_SPENDING_PLANS),
    mergeMap(() =>
      defer(() => FireflyAPI.fetchSpendingPlans()).pipe(
        map(data => {
          return { type: ActionTypes.LOAD_SPENDING_PLANS_SUCCESS, payload: data }
        }),
        catchError(err => of({ type: ActionTypes.LOAD_SPENDING_PLANS_ERROR, payload: err })),
      ),
    ),
  )

export const loadSpendingPlanIteration = (actions$, state$) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_SPENDING_PLAN_ITERATION),
    mergeMap(() => {
      const guid = state$.value.spendingPlan.currentSpendingPlan.guid
      const iterationNumber = state$.value.spendingPlan.currentSpendingPlan.current_iteration_number

      return defer(() => FireflyAPI.fetchSpendingPlanIteration(guid, iterationNumber)).pipe(
        map(data => ({ type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION_SUCCESS, payload: data })),
        catchError(err =>
          of({ type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION_ERROR, payload: err }),
        ),
      )
    }),
  )

export const loadScheduledPayments = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_SCHEDULED_PAYMENTS),
    mergeMap(() =>
      defer(() => FireflyAPI.fetchScheduledPayments()).pipe(
        map(scheduledPayments => ({
          type: ActionTypes.LOAD_SCHEDULED_PAYMENTS_SUCCESS,
          payload: scheduledPayments,
        })),
        catchError(err =>
          of({
            type: ActionTypes.LOAD_SCHEDULED_PAYMENTS_ERROR,
            payload: err,
          }),
        ),
      ),
    ),
  )

export const loadSpendingPlanTransactions = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_SPENDING_PLAN_TRANSACTIONS),
    pluck('payload'),
    mergeMap(({ guids }) =>
      defer(() => FireflyAPI.fetchSpendingPlanTransactions(guids)).pipe(
        map(transactions => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_TRANSACTIONS_SUCCESS,
          payload: transactions,
        })),
        catchError(err =>
          of({
            type: ActionTypes.LOAD_SPENDING_PLAN_TRANSACTIONS_ERROR,
            payload: err,
          }),
        ),
      ),
    ),
  )

export const loadIterationDataAfterTransactionUpdate = (actions$, state$) =>
  actions$.pipe(
    ofType(TransactionActionTypes.TRANSACTION_UPDATED),
    mergeMap(() => {
      const actions = state$.value.spendingPlan.currentSpendingPlan
        ? [
            {
              type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
            },
          ]
        : []

      return actions
    }),
  )

export const addPlannedExpense = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.ADD_PLANNED_EXPENSE),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, categoryGuid, amount, oneTime }) =>
      defer(() =>
        FireflyAPI.addPlannedExpenseToSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          categoryGuid,
          amount,
          oneTime,
        ),
      ).pipe(
        map(() => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          payload: { guid: spendingPlanGuid, iterationNumber },
        })),
        catchError(err => {
          return of({ type: ActionTypes.ADD_PLANNED_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )

export const addRecurringExpense = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.ADD_RECURRING_EXPENSE),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, scheduledPaymentGuid }) =>
      defer(() =>
        FireflyAPI.addRecurringExpenseToSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          scheduledPaymentGuid,
        ),
      ).pipe(
        map(() => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          payload: { guid: spendingPlanGuid, iterationNumber },
        })),
        catchError(err => {
          return of({ type: ActionTypes.ADD_RECURRING_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )

export const addSpendingPlan = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.ADD_SPENDING_PLAN),
    pluck('payload'),
    mergeMap(({ iterationInterval }) =>
      defer(() => FireflyAPI.addSpendingPlan(iterationInterval)).pipe(
        map(({ spending_plan }) => ({
          type: ActionTypes.ADD_SPENDING_PLAN_SUCCESS,
          payload: spending_plan,
        })),
        catchError(err => {
          return of({ type: ActionTypes.ADD_SPENDING_PLAN_ERROR, payload: err })
        }),
      ),
    ),
  )

export const addSpendingPlanAccount = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.ADD_SPENDING_PLAN_ACCOUNT),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, accountGuid }) =>
      defer(() => FireflyAPI.addAccountToSpendingPlan(spendingPlanGuid, accountGuid)).pipe(
        map(spending_plan_account => ({
          type: ActionTypes.ADD_SPENDING_PLAN_ACCOUNT_SUCCESS,
          payload: spending_plan_account,
        })),
        catchError(err => {
          return of({ type: ActionTypes.ADD_SPENDING_PLAN_ACCOUNT_ERROR, payload: err })
        }),
      ),
    ),
  )

export const changeSpendingPlanAccount = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.CHANGE_SPENDING_PLAN_ACCOUNT),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, currentSpendingPlanAccountGuid, newAccountGuid }) =>
      defer(() =>
        FireflyAPI.removeAccountFromSpendingPlan(spendingPlanGuid, currentSpendingPlanAccountGuid),
      ).pipe(
        mergeMap(() =>
          defer(() => FireflyAPI.addAccountToSpendingPlan(spendingPlanGuid, newAccountGuid)).pipe(
            map(data => ({
              type: ActionTypes.CHANGE_SPENDING_PLAN_ACCOUNT_SUCCESS,
              payload: data.spending_plan_account,
            })),
            catchError(err => {
              return of({ type: ActionTypes.CHANGE_SPENDING_PLAN_ACCOUNT_ERROR, payload: err })
            }),
          ),
        ),
        catchError(err => {
          return of({ type: ActionTypes.CHANGE_SPENDING_PLAN_ACCOUNT_ERROR, payload: err })
        }),
      ),
    ),
  )

export const removePlannedExpense = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.REMOVE_PLANNED_EXPENSE),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, plannedExpenseGuid }) =>
      defer(() =>
        FireflyAPI.removePlannedExpenseFromSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          plannedExpenseGuid,
        ),
      ).pipe(
        map(() => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          payload: { guid: spendingPlanGuid, iterationNumber },
        })),
        catchError(err => {
          return of({ type: ActionTypes.REMOVE_PLANNED_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )

export const removePlannedExpenseAndCategory = action$ =>
  action$.pipe(
    ofType(ActionTypes.REMOVE_PLANNED_EXPENSE_AND_CATEGORY),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, plannedExpenseGuid, category }) =>
      defer(() => {
        return FireflyAPI.removePlannedExpenseFromSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          plannedExpenseGuid,
        )
      }).pipe(
        mergeMap(() => {
          const loadIterationAction = {
            type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
            payload: { guid: spendingPlanGuid, iterationNumber },
          }
          const removeCategoryAction = deleteCategory(category)

          return from([loadIterationAction, removeCategoryAction])
        }),
        catchError(err => {
          return of({ type: ActionTypes.REMOVE_PLANNED_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )

export const removeRecurringExpense = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.REMOVE_RECURRING_EXPENSE),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, recurringExpenseGuid }) =>
      defer(() =>
        FireflyAPI.removeRecurringExpenseFromSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          recurringExpenseGuid,
        ),
      ).pipe(
        map(() => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          payload: { guid: spendingPlanGuid, iterationNumber },
        })),
        catchError(err => {
          return of({ type: ActionTypes.REMOVE_RECURRING_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )

export const removeSpendingPlanAccount = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.REMOVE_SPENDING_PLAN_ACCOUNT),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, spendingPlanAccountGuid }) =>
      defer(() =>
        FireflyAPI.removeAccountFromSpendingPlan(spendingPlanGuid, spendingPlanAccountGuid),
      ).pipe(
        map(() => ({
          type: ActionTypes.REMOVE_SPENDING_PLAN_ACCOUNT_SUCCESS,
          payload: spendingPlanAccountGuid,
        })),
        catchError(err => {
          return of({ type: ActionTypes.REMOVE_SPENDING_PLAN_ACCOUNT_ERROR, payload: err })
        }),
      ),
    ),
  )

export const updatePlannedExpense = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.UPDATE_PLANNED_EXPENSE),
    pluck('payload'),
    mergeMap(({ spendingPlanGuid, iterationNumber, plannedExpenseGuid, amount }) =>
      defer(() =>
        FireflyAPI.updatePlannedExpenseInSpendingPlan(
          spendingPlanGuid,
          iterationNumber,
          plannedExpenseGuid,
          amount,
        ),
      ).pipe(
        map(() => ({
          type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
          payload: { guid: spendingPlanGuid, iterationNumber },
        })),
        catchError(err => {
          return of({ type: ActionTypes.UPDATE_PLANNED_EXPENSE_ERROR, payload: err })
        }),
      ),
    ),
  )
