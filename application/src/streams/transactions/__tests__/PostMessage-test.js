import { BROKAW_EVENTS } from '../../../constants/Brokaw'
import PostMessages$ from '../../transactions/PostMessages'
import { WSEventSubject$ } from '../../Subjects'
import * as TransactionUtils from '../../../utils/Transaction'

describe('Transaction PostMessage streams', () => {
  const TRANSACTION = {
    val: 'before',
  }

  beforeEach(() => {
    TransactionUtils.getPostMessagePayload = jest.fn().mockReturnValue({ val: 'after' })
  })

  afterEach(() => {
    TransactionUtils.getPostMessagePayload.mockReset()
  })

  describe('Transation post messages$', () => {
    const createEvent = {
      type: BROKAW_EVENTS.TRANSACTIONS_CREATED,
      payload: TRANSACTION,
    }

    it('should map to the correct payload', () => {
      expect.assertions(3)

      const sub = PostMessages$.subscribe(next => {
        expect(next.type).toBe('created')
        expect(next.payload).toEqual({ val: 'after' })
        expect(TransactionUtils.getPostMessagePayload).toHaveBeenCalledWith(TRANSACTION)
      })

      WSEventSubject$.next(createEvent)
      sub.unsubscribe()
    })
  })

  describe('TransactionDeletedPostMsg$', () => {
    const deleteEvent = {
      type: BROKAW_EVENTS.TRANSACTIONS_DELETED,
      payload: TRANSACTION,
    }

    it('should map to the correct payload', () => {
      expect.assertions(3)

      const sub = PostMessages$.subscribe(next => {
        expect(next.type).toBe('deleted')
        expect(next.payload).toEqual({ val: 'after' })
        expect(TransactionUtils.getPostMessagePayload).toHaveBeenCalledWith(TRANSACTION)
      })

      WSEventSubject$.next(deleteEvent)
      sub.unsubscribe()
    })
  })

  describe('TransactionUpdatedPostMsg$', () => {
    const updateEvent = {
      type: BROKAW_EVENTS.TRANSACTIONS_UPDATED,
      payload: TRANSACTION,
    }

    it('should map to the correct payload', () => {
      expect.assertions(3)

      const sub = PostMessages$.subscribe(next => {
        expect(next.type).toBe('updated')
        expect(next.payload).toEqual({ val: 'after' })
        expect(TransactionUtils.getPostMessagePayload).toHaveBeenCalledWith(TRANSACTION)
      })

      WSEventSubject$.next(updateEvent)
      sub.unsubscribe()
    })
  })
})
