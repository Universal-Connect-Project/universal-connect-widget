import { from, of, zip } from 'rxjs'
import { catchError, flatMap, mergeMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _some from 'lodash/some'
import _get from 'lodash/get'
import _startsWith from 'lodash/startsWith'

import { ActionTypes, addManualAccountSuccess } from '../actions/Accounts'
import { ActionTypes as SpendingActionTypes } from '../actions/Spending'

import { widgetNameToExcludedPropertyMap } from '../../constants/Account'

/**
 * Apply Account Filter
 *
 * Sets the is_excluded_from_widgetName flag on accounts
 * based upon the applied account filter and then saves
 * them.
 */
export const updateAccountsExcludedStateForAppliedAccountFilter = (
  actions$,
  state$,
  { FireflyAPI },
) =>
  actions$.pipe(
    ofType(
      ActionTypes.APPLY_ACCOUNT_FILTER,
      ActionTypes.APPLY_ACCOUNT_FILTER_AND_LOAD_TOTALS,
      SpendingActionTypes.APPLY_SPENDING_ACCOUNT_FILTER,
    ),
    pluck('payload'),
    flatMap(({ selectedAccounts, widgetName }) => {
      const accounts = _get(state$, 'value.accounts.items', [])
      const filterOptions = _get(state$, 'value.accounts.filter.options', [])
      const accountsToSave = accounts
        // Filter out accounts that are NOT in the filter options
        .filter(account => {
          return filterOptions.includes(account.guid)
        })
        // Update the excluded state of each account based upon selectedAccounts
        .map(account => {
          if (widgetNameToExcludedPropertyMap[widgetName]) {
            return {
              ...account,
              [widgetNameToExcludedPropertyMap[widgetName]]: !selectedAccounts.includes(
                account.guid,
              ),
            }
          }

          return account
        })

      return from(FireflyAPI.saveAccounts(accountsToSave)).pipe(
        map(responses => ({
          type: ActionTypes.ACCOUNTS_UPDATED,
          payload: responses.reduce(
            (accounts, response) => [...accounts, response.data.account],
            [],
          ),
        })),
        catchError(error => of({ type: ActionTypes.ACCOUNTS_UPDATED_ERROR, error })),
      )
    }),
  )

/**
 * Add a manual account to the app.
 * If this account the first manual account to be added, refetch the member
 * and institution
 */
export const addManualAccount = (actions$, state$, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.ADD_MANUAL_ACCOUNT),
    pluck('payload'),
    mergeMap(newAccount => {
      return from(FireflyAPI.createAccount(newAccount)).pipe(
        mergeMap(savedAccount => {
          const members = _get(state$.value, 'members.items')
          const alreadyHasManualMember = _some(members, member =>
            _startsWith(member.institution_guid, 'INS-MANUAL'),
          )

          // If we already have a manual account member just update the account
          if (alreadyHasManualMember) {
            return of(addManualAccountSuccess(savedAccount))
          }

          // Otherwise go get the newly created account's member and institution
          return zip(
            from(FireflyAPI.loadMemberByGuid(savedAccount.member_guid)),
            from(FireflyAPI.loadInstitutionByGuid(savedAccount.institution_guid)),
          ).pipe(
            map(([loadedMember, loadedInstitution]) => {
              return addManualAccountSuccess(savedAccount, loadedMember, loadedInstitution)
            }),
          )
        }),
        catchError(err => of({ type: ActionTypes.ADD_MANUAL_ACCOUNT_ERROR, payload: err })),
      )
    }),
  )
