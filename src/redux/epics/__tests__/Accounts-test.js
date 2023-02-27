import { of, throwError } from 'rxjs'

import { ActionTypes, addManualAccountSuccess } from '../../actions/Accounts'
import * as epics from '../../epics/Accounts'
import { expectRx } from '../../../utils/Test'

describe('addManualAccount', () => {
  it('should create an account and emit success if there is already a manual member', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const newAccount = { name: 'shibby', amount: 300 }
      const ctx = { FireflyAPI: { createAccount: () => of({ ...newAccount, guid: 'ACT-2' }) } }
      const state$ = {
        value: { members: { items: [{ guid: 'ACT-1', institution_guid: 'INS-MANUAL' }] } },
      }
      const actions$ = hot('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT, payload: newAccount },
      })

      expectObservable(epics.addManualAccount(actions$, state$, ctx)).toBe('a', {
        a: addManualAccountSuccess({ ...newAccount, guid: 'ACT-2' }),
      })
    })
  })

  it('should error if the createAccount request fails', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const newAccount = { name: 'shibby', amount: 300 }
      const ctx = { FireflyAPI: { createAccount: () => throwError('ERROR') } }

      const actions$ = hot('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT, payload: newAccount },
      })

      expectObservable(epics.addManualAccount(actions$, {}, ctx)).toBe('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT_ERROR, payload: 'ERROR' },
      })
    })
  })

  it('should do a follow up fetch of member and institution if there is no manual member', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const newAccount = { name: 'shibby', amount: 300 }
      const savedAccount = {
        ...newAccount,
        guid: 'ACT-2',
        member_guid: 'MBR-1',
        institution_guid: 'INS-MANUAL',
      }
      const member = { guid: 'MBR-1' }
      const institution = { guid: 'INS-MANUAL' }
      const ctx = {
        FireflyAPI: {
          createAccount: () => of(savedAccount),
          loadMemberByGuid: () => of(member),
          loadInstitutionByGuid: () => of(institution),
        },
      }
      const state$ = {
        value: { members: { items: [{ guid: 'ACT-1' }] } },
      }
      const actions$ = hot('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT, payload: newAccount },
      })

      expectObservable(epics.addManualAccount(actions$, state$, ctx)).toBe('a', {
        a: addManualAccountSuccess(savedAccount, member, institution),
      })
    })
  })

  it('should error if the follow up requests fail', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const newAccount = { name: 'shibby', amount: 300 }
      const ctx = {
        FireflyAPI: {
          createAccount: () => of({}),
          loadMemberByGuid: () => throwError('ERROR'),
          loadInstitutionByGuid: () => of({}),
        },
      }

      const actions$ = hot('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT, payload: newAccount },
      })

      expectObservable(epics.addManualAccount(actions$, {}, ctx)).toBe('a', {
        a: { type: ActionTypes.ADD_MANUAL_ACCOUNT_ERROR, payload: 'ERROR' },
      })
    })
  })
})
