import { merge } from 'rxjs'
import { debounceTime, map, pluck, share, take, scan, repeat } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { WSEventSubject$ } from '../Subjects'
import { transactionBatchUpdated } from '../../redux/actions/Transactions'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const TransactionCreated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.TRANSACTIONS_CREATED),
  pluck('payload'),
  share(),
)

export const TransactionDeleted$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.TRANSACTIONS_DELETED),
  pluck('payload'),
  share(),
)

export const TransactionUpdated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.TRANSACTIONS_UPDATED),
  pluck('payload'),
  share(),
)

export const TransactionUpdatedActions$ = TransactionUpdated$.pipe(
  scan((acc, updatedTransaction) => {
    return { ...acc, [updatedTransaction.guid]: updatedTransaction }
  }, {}),
  debounceTime(3000),
  take(1),
  repeat(),
  map(batch => transactionBatchUpdated(batch)),
)

export const TransactionActions$ = merge(TransactionUpdatedActions$)
