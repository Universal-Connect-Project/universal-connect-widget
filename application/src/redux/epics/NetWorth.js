import { EMPTY, defer, of } from 'rxjs'
import { catchError, mergeMap, map, pluck, throttleTime } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../actions/NetWorth'
import { ActionTypes as MembersActions } from '../actions/Members'
import { ActionTypes as AccountsActions } from '../actions/Accounts'

import { getExperimentNamesToUserVariantMap } from '../selectors/Experiments'

import { formatAccountFieldsForSaving } from '../../components/accounts/utils/AccountDetailsFields'

import { getSortedAccountsWithMembers } from '../../utils/Account'

import { EXP_USE_HISTORICAL_ACCOUNT_BALANCES } from '../../constants/Experiments'

const NET_WORTH_DATA_SOURCES = ['networth', 'master/networth', 'mini-networth']

export const saveAccountAndLoadMonthlyAccountBalances = (action$, state$, { FireflyAPI }) =>
  action$.pipe(
    ofType(ActionTypes.NET_WORTH_SAVE_ACCOUNT),
    pluck('payload'),
    map(formatAccountFieldsForSaving),
    mergeMap(formattedAccount =>
      defer(() => FireflyAPI.saveAccount(formattedAccount)).pipe(
        mergeMap(savedAccount =>
          defer(() => FireflyAPI.loadMonthlyAccountBalances(savedAccount.guid)),
        ),
        map(updatedMonthlyAccountBalances => {
          const existingFilteredBalances = state$.value.netWorth.monthlyAccountBalances.filter(
            balance => balance.account_guid !== formattedAccount.guid,
          )
          const monthlyAccountBalances = [
            ...existingFilteredBalances,
            ...updatedMonthlyAccountBalances,
          ]

          return {
            type: ActionTypes.NET_WORTH_SAVE_ACCOUNT_SUCCESS,
            payload: monthlyAccountBalances,
          }
        }),
        catchError(err => of({ type: ActionTypes.NET_WORTH_SAVE_ACCOUNT_ERROR, payload: err })),
      ),
    ),
  )

export const updateNetWorthDataOnWebSocket = (action$, state$, { FireflyAPI }) =>
  action$.pipe(
    ofType(
      ...[
        AccountsActions.FAYE_ACCOUNTS_CREATED,
        AccountsActions.FAYE_ACCOUNTS_DELETED,
        AccountsActions.FAYE_ACCOUNTS_UPDATED,
        MembersActions.FAYE_MEMBERS_AGGREGATED,
        MembersActions.FAYE_MEMBERS_CREATED,
        MembersActions.FAYE_MEMBERS_DELETED,
        MembersActions.FAYE_MEMBERS_UPDATED,
      ],
    ),
    // it's possible for a number of these events to be published in succession so only allowing the request to come through every 500ms
    throttleTime(500),
    mergeMap(() => {
      const isNetWorth = NET_WORTH_DATA_SOURCES.includes(state$.value?.analytics?.dataSource)

      if (!isNetWorth) {
        return EMPTY
      }
      const experiments = getExperimentNamesToUserVariantMap(state$.value)

      return defer(() =>
        FireflyAPI.loadNetWorthData(!!experiments[EXP_USE_HISTORICAL_ACCOUNT_BALANCES]),
      ).pipe(
        map(({ accounts, members, monthlyAccountBalances }) => {
          return {
            type: ActionTypes.NET_WORTH_DATA_LOADED,
            payload: {
              accounts: getSortedAccountsWithMembers(accounts, members),
              members,
              monthlyAccountBalances,
            },
          }
        }),
        catchError(err => of({ type: ActionTypes.NET_WORTH_DATA_ERROR, payload: err })),
      )
    }),
  )
