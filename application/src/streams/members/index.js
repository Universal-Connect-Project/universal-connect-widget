import { merge } from 'rxjs'
import { map, filter, pluck, scan, share, startWith } from 'rxjs/operators'

import { WSEventSubject$ } from '../Subjects'
import { successfulAggregationScan } from '../members/selectors/Aggregation'
import { ActionTypes } from '../../redux/actions/Members'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const MembersCreated$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.MEMBERS_CREATED),
  pluck('payload'),
  share(),
)

export const MembersUpdated$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.MEMBERS_UPDATED),
  pluck('payload'),
  share(),
)

export const MembersDeleted$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.MEMBERS_DELETED),
  pluck('payload'),
  share(),
)

export const MembersSuccessfulAggregation$ = MembersUpdated$.pipe(
  startWith({ member: {}, isAggregationSuccessfull: false }),
  scan(successfulAggregationScan),
  filter(({ isAggregationSuccessfull }) => isAggregationSuccessfull),
  pluck('member'),
  share(),
)

export const MembersUpdatedActions$ = MembersUpdated$.pipe(
  map(updatedMember => ({
    type: ActionTypes.FAYE_MEMBERS_UPDATED,
    payload: { item: updatedMember },
  })),
)

export const MembersDeletedActions$ = MembersDeleted$.pipe(
  map(deletedMember => ({
    type: ActionTypes.FAYE_MEMBERS_DELETED,
    payload: { item: deletedMember },
  })),
)

export const MembersCreatedAction$ = MembersCreated$.pipe(
  map(member => ({
    type: ActionTypes.FAYE_MEMBERS_CREATED,
    payload: { item: member },
  })),
)

export const MembersAggregatedAction$ = MembersSuccessfulAggregation$.pipe(
  map(member => ({
    type: ActionTypes.FAYE_MEMBERS_AGGREGATED,
    payload: { item: member },
  })),
)

export const MembersActions$ = merge(
  MembersAggregatedAction$,
  MembersCreatedAction$,
  MembersUpdatedActions$,
  MembersDeletedActions$,
)
