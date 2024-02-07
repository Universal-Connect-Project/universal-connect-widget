import { from, of, defer } from 'rxjs'
import { catchError, flatMap, map, mergeMap, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _get from 'lodash/get'

import FireflyAPI from '../../utils/FireflyAPI'

import { ActionTypes } from '../actions/Categories'
import { itemAction } from '../../utils/ActionHelpers'

export const loadCategories = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.CATEGORIES_LOAD),
    flatMap(() =>
      from(FireflyAPI.loadCategories()).pipe(
        map(items => {
          if (!items || !items.length) {
            return { type: ActionTypes.LOAD_CATEGORIES_ERROR }
          } else {
            return { type: ActionTypes.CATEGORIES_LOADED, payload: { items } }
          }
        }),
        catchError(error => {
          if (_get(error, 'response.status') === 304) {
            return of({ type: ActionTypes.LOAD_CATEGORIES_NO_CHANGE })
          } else {
            return of({ type: ActionTypes.LOAD_CATEGORIES_ERROR })
          }
        }),
      ),
    ),
  )

export const deleteCategory = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.CATEGORY_DELETE),
    pluck('payload'),
    flatMap(category =>
      from(FireflyAPI.deleteCategory(category)).pipe(
        map(() => itemAction(ActionTypes.CATEGORY_DELETED, category)),
        catchError(err => of({ type: ActionTypes.CATEGORY_DELETED_ERROR, payload: err })),
      ),
    ),
  )

export const saveCategory = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.CATEGORY_SAVE),
    pluck('payload'),
    flatMap(category =>
      from(FireflyAPI.saveCategory(category)).pipe(
        map(newCategory => itemAction(ActionTypes.CATEGORY_SAVED, newCategory)),
        catchError(err => of({ type: ActionTypes.CATEGORY_SAVED_ERROR, payload: err })),
      ),
    ),
  )

export const editCategory = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.CATEGORY_EDIT),
    pluck('payload'),
    mergeMap(category => {
      return defer(() => FireflyAPI.updateCategory(category)).pipe(
        map(newCategory => itemAction(ActionTypes.CATEGORY_EDIT_SUCCESS, newCategory)),
        catchError(err => of({ type: ActionTypes.CATEGORY_EDIT_ERROR, payload: err })),
      )
    }),
  )
