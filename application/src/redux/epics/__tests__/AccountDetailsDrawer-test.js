import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'
import * as actions from '../../actions/AccountDetailsDrawer'
import { ActionTypes } from '../../actions/AccountDetailsDrawer'
import { saveEditForm } from '../../epics/AccountDetailsDrawer'

describe('AccountDetailsDrawer', () => {
  it('should emit SAVE_EDIT_FORM_SUCCESS', () => {
    expect.assertions(1)
    const formattedAccount = {
      acccount_type: 1,
      feed_name: 'Gringotts Checking',
      guid: 'testGUID',
      name: 'gringotts checking 1',
      user_name: 'gringotts checking 3',
    }

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.saveEditForm({}) })
      const ctx = { FireflyAPI: { saveAccount: () => of(formattedAccount) } }

      expectObservable(saveEditForm(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.SAVE_EDIT_FORM_SUCCESS, payload: { item: formattedAccount } },
      })
    })
  })
  it('should emit SAVE_EDIT_FORM_ERROR', () => {
    expect.assertions(1)
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.saveEditForm({}) })
      const ctx = { FireflyAPI: { saveAccount: () => throwError('saveEditForm TEST FAIL') } }

      expectObservable(saveEditForm(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.SAVE_EDIT_FORM_ERROR, payload: 'saveEditForm TEST FAIL' },
      })
    })
  })
})
