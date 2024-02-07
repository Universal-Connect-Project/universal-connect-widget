import _get from 'lodash/get'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/Members'
import { itemsAction } from '../../utils/ActionHelpers'

export const fetchMembers = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.MEMBERS_LOADING),
    mergeMap(() =>
      from(FireflyAPI.loadMembers()).pipe(
        map(members => itemsAction(ActionTypes.MEMBERS_LOADED, members)),
        catchError(err => {
          return of({ type: ActionTypes.MEMBERS_LOADED_ERROR, payload: err })
        }),
      ),
    ),
  )

export const fetchMemberByGuid = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.MEMBER_LOADING),
    pluck('payload'),
    mergeMap(guid =>
      from(FireflyAPI.loadMemberByGuid(guid)).pipe(
        map(member => ({
          type: ActionTypes.MEMBER_LOADED,
          payload: { item: member },
        })),
      ),
    ),
  )

export const mfaModalSubmit = (actions$, state$, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.MFA_MODAL_SUBMIT),
    pluck('payload'),
    mergeMap(member => {
      const isHuman = _get(state$, 'value.app.humanEvent', false)
      const connectConfig = _get(state$, 'value.initializedClientConfig.connect', {})

      return from(FireflyAPI.updateMember(member, connectConfig, isHuman)).pipe(
        map(member => ({ type: ActionTypes.MEMBER_LOADED, payload: { item: member } })),
        catchError(() => {
          return of({ type: ActionTypes.MFA_MODAL_ERROR, payload: member })
        }),
      )
    }),
  )
