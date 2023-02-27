import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'

import { concat, from, of } from 'rxjs'
import { catchError, filter, flatMap, map, mapTo, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes as CategoryTotalsActionTypes } from '../actions/CategoryTotals'

import FireflyAPI from '../../utils/FireflyAPI'
import { itemsAction, setupAction } from '../../utils/ActionHelpers'

import { appendCategoryDetailsToBudget } from '../../utils/Budget'
import { ActionTypes as BudgetsWidgetActionTypes } from '../actions/BudgetsWidget'

import {
  ActionTypes,
  fetchBudgets,
  saveBudgets as actionSaveBudgets,
} from '../actions/Budgets'
import { ActionTypes as ActionTypesWidget } from '../actions/BudgetsWidget'
import { ActionTypes as CategoryActionTypes } from '../actions/Categories'
import { getBudgetedCategories, getNestedBudgets } from '../selectors/Budgets'
import { getBudgetCategories, getNestedCategories } from '../selectors/Categories'
import { getBudgetBeingViewed } from '../selectors/BudgetsWidget'

export const loadBudgets = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_LOAD),
    flatMap(() =>
      from(FireflyAPI.loadBudgets()).pipe(
        map(({ budgets }) => itemsAction(ActionTypes.BUDGETS_LOADED, budgets)),
        catchError(() => of({ type: ActionTypes.BUDGETS_LOADED_ERROR })),
      ),
    ),
  )

export const saveBudget = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGET_SAVE),
    pluck('payload'),
    flatMap(({ newBudget, options }) =>
      from(FireflyAPI.saveBudget(newBudget)).pipe(
        map(({ budget }) =>
          setupAction(ActionTypes.BUDGET_SAVED, {
            item: { ...newBudget, ...budget },
            options,
          }),
        ),
        catchError(() => of({ type: ActionTypes.BUDGET_SAVE_ERROR })),
      ),
    ),
  )

export const saveBudgets = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_SAVE),
    pluck('payload'),
    flatMap(budgets =>
      from(FireflyAPI.saveBudgets(budgets)).pipe(
        map(({ budgets }) => itemsAction(ActionTypes.BUDGETS_SAVED, budgets)),
        catchError(() => of({ type: ActionTypes.BUDGETS_SAVE_ERROR })),
      ),
    ),
  )

export const generateBudgets = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_GENERATE),
    flatMap(() =>
      from(FireflyAPI.generateBudgets()).pipe(
        map(({ budgets }) => itemsAction(ActionTypes.BUDGETS_GENERATED, budgets)),
        catchError(() => of({ type: ActionTypes.BUDGETS_GENERATED_ERROR })),
      ),
    ),
  )

export const deleteBudget = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.BUDGET_DELETE),
    pluck('payload'),
    flatMap(item =>
      from(FireflyAPI.deleteBudget(item)).pipe(
        mapTo({ type: ActionTypes.BUDGET_DELETED, payload: { item } }),
        catchError(() => of({ type: ActionTypes.BUDGET_DELETED_ERROR })),
      ),
    ),
  )

export const clearOrReset = (actions$, store$) =>
  actions$.pipe(
    ofType(ActionTypes.BUDGET_DELETED),
    pluck('payload'),
    flatMap(() => {
      const spendingBudgets = getBudgetedCategories(store$.value)
      const generated = store$.value.budgets.generated
      const actions = []

      if (!spendingBudgets.length && generated) {
        actions.push(ActionTypes.BUDGET_GENERATION_CLEARED)
      }
      if (!spendingBudgets.length) {
        actions.push(ActionTypesWidget.RESET_BUDGET)
      }

      return concat(...actions.map(type => of({ type })))
    }),
  )

export const deleteBudgets = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_DELETE),
    pluck('payload'),
    flatMap(budgets =>
      from(FireflyAPI.deleteBudgets(budgets)).pipe(
        map(payload => ({ type: ActionTypes.BUDGETS_DELETED_SUCCESS, payload })),
        catchError(() => of({ type: ActionTypes.BUDGETS_DELETED_ERROR })),
      ),
    ),
  )

export const deleteBudgetsThenGenerate = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_DELETE_THEN_GENERATE),
    pluck('payload'),
    flatMap(budgets =>
      from(FireflyAPI.deleteBudgets(budgets)).pipe(
        flatMap(() => from(FireflyAPI.generateBudgets())),
        map(({ budgets }) => ({
          type: ActionTypes.BUDGETS_DELETED_THEN_GENERATED_SUCCESS,
          payload: { items: budgets },
        })),
        catchError(() => of({ type: ActionTypes.BUDGETS_DELETED_THEN_GENERATED_ERROR })),
      ),
    ),
  )

export const saveRecalculatedBudgets = (actions$, store$) =>
  actions$.pipe(
    ofType(ActionTypes.BUDGETS_SAVE_RECALCULATE),
    flatMap(() => {
      const state = store$.value
      const spendingCategories = getBudgetCategories(state)
      const budgets = getNestedBudgets(state)
      const unusedCategoryGuids = spendingCategories
        .filter(category => !category.average)
        .map(category => category.guid)
      const recalculatedBudgets = spendingCategories
        .filter(category => category.average)
        .map(category => {
          const budget = _find(budgets, budget => budget.category_guid === category.guid) || {
            category_guid: category.guid,
          }

          return { ...budget, amount: Math.max(0, category.average) }
        })
      const budgetsToDelete = budgets.filter(
        budget => unusedCategoryGuids.indexOf(budget.category_guid) >= 0,
      )

      return from(FireflyAPI.deleteBudgets(budgetsToDelete)).pipe(
        mapTo(actionSaveBudgets(recalculatedBudgets)),
        catchError(() => of({ type: ActionTypes.BUDGETS_SAVE_RECALCULATED_ERROR })),
      )
    }),
  )

export const syncBudgetsWithCategories = actions$ =>
  actions$.pipe(
    ofType(CategoryActionTypes.CATEGORY_DELETED),
    flatMap(() => {
      return of(fetchBudgets())
    }),
  )

export const updateBudgetBeingViewed = (actions$, state$) =>
  actions$.pipe(
    ofType(CategoryTotalsActionTypes.CATEGORY_TOTALS_LOADED),
    flatMap(() =>
      of(getBudgetBeingViewed(state$.value)).pipe(
        filter(budgetBeingViewed => !_isEmpty(budgetBeingViewed)),
        map(budgetBeingViewed => {
          const categories = getNestedCategories(state$.value)
          const updatedBudgetBeingViewed = appendCategoryDetailsToBudget(
            budgetBeingViewed,
            categories,
          )

          return {
            type: BudgetsWidgetActionTypes.VIEW_BUDGET,
            payload: { item: updatedBudgetBeingViewed },
          }
        }),
      ),
    ),
  )
