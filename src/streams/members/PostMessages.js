import { merge } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'

import {
  MembersCreated$,
  MembersUpdated$,
  MembersDeleted$,
  MembersSuccessfulAggregation$,
} from '.'
import { AccountsCreatedCollection$ } from '../accounts'
import MemberUtils from '../../utils/Member'

/**
 * PostMessages of created members
 */
const MembersCreatedPostMsg$ = MembersCreated$.pipe(
  map(member => ({ type: 'created', payload: MemberUtils.getPostMessageObject(member) })),
)

/**
 * PostMessages of updated members
 */
const MembersUpdatedPostMsg$ = MembersUpdated$.pipe(
  map(member => ({ type: 'updated', payload: MemberUtils.getPostMessageObject(member) })),
)

/**
 * PostMessages of deleted members
 */
const MembersDeletedPostMsg$ = MembersDeleted$.pipe(
  map(member => ({ type: 'deleted', payload: MemberUtils.getPostMessageObject(member) })),
)

const MembersSuccessfulAggregationsPostMsg$ = MembersSuccessfulAggregation$.pipe(
  withLatestFrom(AccountsCreatedCollection$),
  map(([member, accounts]) => ({
    type: 'agg_success',
    payload: MemberUtils.getPostMessageObject(
      member,
      accounts.filter(account => account.member_guid === member.guid).length,
    ),
  })),
)

export default merge(
  MembersCreatedPostMsg$,
  MembersUpdatedPostMsg$,
  MembersDeletedPostMsg$,
  MembersSuccessfulAggregationsPostMsg$,
)
