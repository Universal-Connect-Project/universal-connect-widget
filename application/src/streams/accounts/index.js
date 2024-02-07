import { merge } from 'rxjs'
import { map, filter, pluck, scan, share, startWith } from 'rxjs/operators'

import { ActionTypes } from '../../redux/actions/Accounts'
import { WSEventSubject$ } from '../Subjects'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const AccountsCreated$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.ACCOUNTS_CREATED),
  pluck('payload'),
  share(),
)

export const AccountsCreatedCollection$ = AccountsCreated$.pipe(
  startWith([]),
  scan((acc, curr) => [...acc, curr]),
  share(),
)

export const AccountsDeleted$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.ACCOUNTS_DELETED),
  pluck('payload'),
  share(),
)

export const AccountsUpdated$ = WSEventSubject$.pipe(
  filter(e => e.type === BROKAW_EVENTS.ACCOUNTS_UPDATED),
  pluck('payload'),
  share(),
)

export const AccountsCreatedActions$ = AccountsCreated$.pipe(
  map(account => ({ type: ActionTypes.FAYE_ACCOUNTS_CREATED, payload: { item: account } })),
)

export const AccountsUpdatedActions$ = AccountsUpdated$.pipe(
  map(account => ({ type: ActionTypes.FAYE_ACCOUNTS_UPDATED, payload: { item: account } })),
)

export const AccountsDeletedActions$ = AccountsDeleted$.pipe(
  map(account => ({ type: ActionTypes.FAYE_ACCOUNTS_DELETED, payload: { item: account } })),
)

export const AccountsActions$ = merge(
  AccountsCreatedActions$,
  AccountsUpdatedActions$,
  AccountsDeletedActions$,
)
