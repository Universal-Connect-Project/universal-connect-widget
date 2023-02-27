import { from, of } from 'rxjs'
import { catchError, mergeMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/Connections'
import { getSortedAccountsWithMembers } from '../../utils/Account'

export const loadConnections = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_CONNECTIONS),
    pluck('payload'),
    mergeMap(selectedMemberGuid => {
      return from(FireflyAPI.loadAccounts()).pipe(
        map(({ members, accounts }) => {
          const sortedAccountsWithMembers = getSortedAccountsWithMembers(accounts, members)

          return {
            type: ActionTypes.LOAD_CONNECTIONS_SUCCESS,
            payload: {
              members,
              accounts: sortedAccountsWithMembers,
              selectedMemberGuid,
            },
          }
        }),
        catchError(error => {
          return of({ type: ActionTypes.LOAD_CONNECTIONS_ERROR, payload: error })
        }),
      )
    }),
  )
