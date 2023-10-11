import { merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { TransactionCreated$, TransactionDeleted$, TransactionUpdated$ } from '../transactions'
import * as TransactionUtils from '../../utils/Transaction'

/**
 * PostMessages of created transactions
 */
const TransactionCreatedPostMsg$ = TransactionCreated$.pipe(
  map(transaction => ({
    type: 'created',
    payload: TransactionUtils.getPostMessagePayload(transaction),
  })),
)

/**
 * PostMessages of deleted transactions
 */
const TransactionDeletedPostMsg$ = TransactionDeleted$.pipe(
  map(transaction => ({
    type: 'deleted',
    payload: TransactionUtils.getPostMessagePayload(transaction),
  })),
)

/**
 * PostMessages of updated transactions
 */
const TransactionUpdatedPostMsg$ = TransactionUpdated$.pipe(
  map(transaction => ({
    type: 'updated',
    payload: TransactionUtils.getPostMessagePayload(transaction),
  })),
)

export default merge(
  TransactionCreatedPostMsg$,
  TransactionDeletedPostMsg$,
  TransactionUpdatedPostMsg$,
)
