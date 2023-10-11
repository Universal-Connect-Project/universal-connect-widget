jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

jest.mock('streams/members')

import { of } from 'rxjs'

import { ActionTypes } from '../../actions/Members'
import { mfaModalSubmit, fetchMemberByGuid } from '../../epics/Members'
import { createPromise, expectRx } from '../../../utils/Test'

describe('mfaModalSubmit Epic', () => {
  it('should dispatch the MEMBER_LOADED action', done => {
    const payload = { guid: 321 }
    const state$ = { value: { app: { humanEvent: true } } }

    FireflyAPI.updateMember = jest.fn(() => createPromise(payload))
    expect.assertions(2)

    mfaModalSubmit(of({ type: ActionTypes.MFA_MODAL_SUBMIT }), state$, { FireflyAPI }).subscribe(
      ret => {
        expect(FireflyAPI.updateMember).toHaveBeenCalled()
        expect(ret).toMatchObject({
          type: ActionTypes.MEMBER_LOADED,
          payload: { item: payload },
        })
        done()
      },
    )
  })
})

describe('fetchMemberByGuid', () => {
  it('should dispatch MEMBER_LOADED upon success', () => {
    const memberGuid = 'MBR-1'

    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const ctx = {
        FireflyAPI: {
          loadMemberByGuid: () => of({ guid: memberGuid }),
        },
      }
      const actions$ = hot('a', { a: { type: ActionTypes.MEMBER_LOADING, payload: memberGuid } })
      const epic$ = fetchMemberByGuid(actions$, {}, ctx)

      expectObservable(epic$).toBe('b', {
        b: {
          type: ActionTypes.MEMBER_LOADED,
          payload: { item: { guid: memberGuid } },
        },
      })
    })
  })
})
