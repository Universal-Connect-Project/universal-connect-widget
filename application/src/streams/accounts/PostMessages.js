import { from, merge } from 'rxjs'
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'

import {
  AccountsCreated$,
  AccountsCreatedCollection$,
  AccountsDeleted$,
  AccountsUpdated$,
} from '../accounts'
import { MembersSuccessfulAggregation$ } from '../members'
import * as AccountUtils from '../../utils/Account'

/**
 * PostMessages of created accounts
 */
const AccountsCreatedPostMsg$ = AccountsCreated$.pipe(
  map(account => ({ type: 'created', payload: AccountUtils.getPostMessageObject(account) })),
)

const AccountsSuccesfulAggregationsPostMsg$ = MembersSuccessfulAggregation$.pipe(
  withLatestFrom(AccountsCreatedCollection$),
  map(([member, accounts]) => accounts.filter(account => account.member_guid === member.guid)),
  filter(accounts => accounts.length > 0),
  mergeMap(accounts =>
    from(
      accounts.map(account => ({
        type: 'agg_success',
        payload: AccountUtils.getPostMessageObject(account),
      })),
    ),
  ),
)

/**
 * PostMessages of deleted accounts
 */
const AccountsDeletedPostMsg$ = AccountsDeleted$.pipe(
  map(account => ({ type: 'deleted', payload: AccountUtils.getPostMessageObject(account) })),
)

/**
 * PostMessages of updated accounts
 */
const AccountsUpdatedPostMsg$ = AccountsUpdated$.pipe(
  map(account => ({ type: 'updated', payload: AccountUtils.getPostMessageObject(account) })),
)

export default merge(
  AccountsCreatedPostMsg$,
  AccountsDeletedPostMsg$,
  AccountsSuccesfulAggregationsPostMsg$,
  AccountsUpdatedPostMsg$,
)
