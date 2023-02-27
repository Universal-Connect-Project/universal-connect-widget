import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/Subscriptions'
import { ActionTypes } from '../../actions/Subscriptions'
import { fetchSubscriptionsByDateRange } from '../../epics/Subscriptions'

describe('Subscription test, fetchSubscriptionsByDateRange', () => {
  it('should emit SUBSCRIPTIONS_LOADED when it is successfull', () => {
    expect.assertions(1)
    const subscriptions = [
      {
        start_date: '02/05/2019',
        end_date: '05/06/2019',
        name: 'NetFlix',
      },
      {
        start_date: '02/05/2019',
        end_date: '05/06/2019',
        name: 'Hulu',
      },
      {
        start_date: '02/05/2019',
        end_date: '05/06/2019',
        name: 'Xbox',
      },
    ]

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.loadSubscriptionsByDateRange({}) })
      const ctx = { FireflyAPI: { loadSubscriptionsByDateRange: () => of(subscriptions) } }

      expectObservable(fetchSubscriptionsByDateRange(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.SUBSCRIPTIONS_LOADED, payload: { items: subscriptions } },
      })
    })
  })
  it('should emit SUBSCRIPTIONS_LOADED_ERROR when it fails', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.loadSubscriptionsByDateRange({}) })
      const ctx = {
        FireflyAPI: {
          loadSubscriptionsByDateRange: () =>
            throwError('loadSubscriptionsByDateRange TEST FAILURE'),
        },
      }

      expectObservable(fetchSubscriptionsByDateRange(action$, undefined, ctx)).toBe('a', {
        a: {
          type: ActionTypes.SUBSCRIPTIONS_LOADED_ERROR,
          payload: 'loadSubscriptionsByDateRange TEST FAILURE',
        },
      })
    })
  })
})
