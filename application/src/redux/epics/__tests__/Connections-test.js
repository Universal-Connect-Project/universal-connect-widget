import { of, throwError } from 'rxjs'

import { ActionTypes } from '../../actions/Connections'
import * as epics from '../../epics/Connections'

import { expectRx } from '../../../connect/utilities/Test'
import FireflyAPI from '../../../utils/FireflyAPI'

jest.mock('utils/FireflyAPI')

describe('loadConnections epic', () => {
  it('should load accounts and members with a success response', () => {
    expect.assertions(1)

    const members = [{ guid: 'MBR-1' }]
    const accounts = [{ guid: 'ACT-1', member_guid: 'MBR-1' }]

    FireflyAPI.loadAccounts = jest.fn(() => of({ members, accounts }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECTIONS, payload: 'MBR-1' } })

      expectObservable(epics.loadConnections(actions$, {}, { FireflyAPI })).toBe('a', {
        a: {
          type: ActionTypes.LOAD_CONNECTIONS_SUCCESS,
          payload: { members, accounts, selectedMemberGuid: 'MBR-1' },
        },
      })
    })
  })

  it('should return the error response action when an error happens', () => {
    expect.assertions(1)

    FireflyAPI.loadAccounts = jest.fn(() => throwError('ERROR'))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECTIONS, payload: 'MBR-1' } })

      expectObservable(epics.loadConnections(actions$, {}, { FireflyAPI })).toBe('a', {
        a: {
          type: ActionTypes.LOAD_CONNECTIONS_ERROR,
          payload: 'ERROR',
        },
      })
    })
  })
})
