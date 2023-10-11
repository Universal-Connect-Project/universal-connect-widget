import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'
import { ActionTypes } from '../../actions/DebtsWidget'
import { saveDebtForm } from '../../epics/DebtsWidget'

describe('DebtsWidget', () => {
  it('should emit DEBT_FORM_SAVED ', () => {
    expect.assertions(1)
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: { type: ActionTypes.SAVE_DEBT_FORM },
      })
      const ctx = { FireflyAPI: { updateGoal: () => of('SUCCESS') } }

      expectObservable(saveDebtForm(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.DEBT_FORM_SAVED },
      })
    })
  })
  it('should emit DEBT_FORM_SAVE_ERROR', () => {
    expect.assertions(1)
    const debtForm = { monthly_payment: '45.00', interest_rate: '5.6', account_guid: 'testAccount' }

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: { type: ActionTypes.SAVE_DEBT_FORM, payload: { item: debtForm } },
      })
      const ctx = { FireflyAPI: { updateGoal: () => throwError('saveDebtForm TEST FAILURE') } }

      expectObservable(saveDebtForm(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.DEBT_FORM_SAVE_ERROR, payload: 'saveDebtForm TEST FAILURE' },
      })
    })
  })
})
