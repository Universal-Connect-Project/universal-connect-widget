import { TestScheduler } from 'rxjs/testing'
import { sec } from '../../../utils/testing/rx'

import { ActionTypes } from '../../actions/miniSpending'
import { ActionTypes as AccountActionTypes } from '../../actions/Accounts'
import { miniSpending } from '../../epics/MiniSpending'

describe('miniSpending debounce', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })

  it('should wait for six seconds of silence then emit', () => {
    scheduler.run(({ hot, expectObservable }) => {
      const e1 = sec`^a-b------`
      const ex = sec`^--------a`

      const actions$ = hot(e1, {
        a: { type: ActionTypes.FAYE_MONTHLY_CATEGORY_TOTALS_UPDATED },
        b: { type: AccountActionTypes.FAYE_ACCOUNTS_UPDATED },
      })

      const output = {
        a: { type: ActionTypes.NEW_SPENDING_DATA_AVAILABLE },
      }

      const ret$ = miniSpending(actions$, null, { scheduler })

      expectObservable(ret$).toBe(ex, output)
    })
  })
})
