import { of, throwError } from 'rxjs'

import {
  ActionTypes,
  loadConnectSuccess,
  loadConnectError,
  selectInstitution as selectInstitutionAction,
  selectInstitutionSuccess,
  selectInstitutionError,
} from 'reduxify/actions/Connect'
import * as epics from '../../../connect/epics/Connect.js'
import FireflyAPI from '../../../utils/FireflyAPI'
import { expectRx } from '../../../connect/utilities/Test'
import { VERIFY_MODE } from '../../../connect/const/Connect'
import { ReadableStatuses } from '../../../connect/const/Statuses'

jest.mock('utils/FireflyAPI')

describe('loadConnect', () => {
  afterEach(() => {
    FireflyAPI.loadMembers.mockClear()
    FireflyAPI.loadMemberByGuid.mockReset()
    FireflyAPI.loadInstitutionByGuid.mockReset()
    FireflyAPI.loadInstitutionByCode.mockReset()
    FireflyAPI.loadAccounts.mockReset()
    FireflyAPI.loadInstitutions.mockReset()
  })
  const state$ = {
    value: {
      clientProfile: {},
    },
  }

  it('should dispatch LOAD_CONNECT_SUCCESS with only members if empty config', () => {
    const member = {
      guid: 'MBR-1',
      connection_status: ReadableStatuses.DENIED,
      institution_guid: 'INST-1',
    }
    const members = [member]

    FireflyAPI.loadMembers = jest.fn(() => of(members))
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECT } })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectSuccess({ members }),
      })
    })
  })

  it('should dispatch LOAD_CONNECT_SUCCESS with a member, members, config, and institution', () => {
    const member = {
      guid: 'MBR-1',
      connection_status: ReadableStatuses.DENIED,
      institution_guid: 'INST-1',
    }
    const institution = { guid: 'INST-1' }
    const members = [member]
    const config = { current_member_guid: 'MBR-1' }

    FireflyAPI.loadMemberByGuid = jest.fn(() => of(member))
    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))
    FireflyAPI.loadMembers = jest.fn(() => of(members))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectSuccess({ members, member, institution, config }),
      })
    })
  })

  it('should dispatch loadConnectError if the member is not found with current_member_guid', () => {
    expect.assertions(1)
    const config = { current_member_guid: 'bad member' }
    const notFound = { response: { status: 404 } }

    FireflyAPI.loadMemberByGuid = jest.fn(() => throwError(notFound))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
      })
    })
  })

  it('should dispatch loadConnectError if there is any non 404 error with current_member_guid', () => {
    expect.assertions(1)
    const config = { current_member_guid: 'bad member' }
    const notFound = { response: { status: 500 } }

    FireflyAPI.loadMemberByGuid = jest.fn(() => throwError(notFound))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
      })
    })
  })

  it('should dispatch loadConnectError if the member doesnt support verification', () => {
    expect.assertions(3)
    const member = { guid: 'MBR-1', verification_is_enabled: false }

    FireflyAPI.loadMemberByGuid = jest.fn(() => of(member))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: {
          type: ActionTypes.LOAD_CONNECT,
          payload: { current_member_guid: 'MBR-1', mode: VERIFY_MODE },
        },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "This connection doesn't support verification." }),
      })
    })

    expect(FireflyAPI.loadMemberByGuid).toHaveBeenCalledWith('MBR-1')
    expect(FireflyAPI.loadInstitutionByGuid).not.toHaveBeenCalled()
  })

  it('should dispatch LOAD_CONNECT_SUCCESS with current_institution_guid', () => {
    expect.assertions(2)
    const institution = { guid: 'INST-1' }

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: { current_institution_guid: 'INST-1' } },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectSuccess({ institution }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })

  it('should dispatch loadConnectError if institution is not found with current_institution_guid', () => {
    expect.assertions(1)
    const config = { current_institution_guid: 'bad institution' }
    const notFound = { response: { status: 404 } }

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => throwError(notFound))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
      })
    })
  })

  it('should dispatch loadConnectError if institution query fails with current_institution_guid', () => {
    expect.assertions(1)
    const config = { current_institution_guid: 'bad institution' }
    const error = { response: { status: 500 } }

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => throwError(error))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
      })
    })
  })

  it('should dispatch loadConnectError if institution does not support verification with current_institution_guid', () => {
    expect.assertions(2)
    const config = { mode: VERIFY_MODE, current_institution_guid: 'INST-1' }
    const institution = { guid: 'INST-1', account_verification_is_enabled: false }

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "This connection doesn't support verification." }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })

  it('should dispatch LOAD_CONNECT_SUCCESS with an institution with current_institution_code', () => {
    expect.assertions(2)
    const institution = { code: 'gringotts' }

    FireflyAPI.loadInstitutionByCode = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: {
          type: ActionTypes.LOAD_CONNECT,
          payload: { current_institution_code: 'gringotts' },
        },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectSuccess({ institution }),
      })
    })

    expect(FireflyAPI.loadInstitutionByCode).toHaveBeenCalledWith('gringotts')
  })

  it('should dispatch loadConnectError if institution is not found with current_institution_code', () => {
    expect.assertions(1)
    const config = { current_institution_code: 'bad institution' }
    const notFound = { response: { status: 404 } }

    FireflyAPI.loadInstitutionByCode = jest.fn(() => throwError(notFound))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
      })
    })
  })

  it('should dispatch loadConnectError if institution query fails with current_institution_code', () => {
    expect.assertions(1)
    const config = { current_institution_code: 'bad institution' }
    const error = { response: { status: 500 } }

    FireflyAPI.loadInstitutionByCode = jest.fn(() => throwError(error))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
      })
    })
  })

  it('should dispatch loadConnectError if institution does not support verification with current_institution_code', () => {
    expect.assertions(2)
    const config = { mode: VERIFY_MODE, current_institution_code: 'gringotts' }
    const institution = { code: 'gringotts', account_verification_is_enabled: false }

    FireflyAPI.loadInstitutionByCode = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectError({ message: "This connection doesn't support verification." }),
      })
    })

    expect(FireflyAPI.loadInstitutionByCode).toHaveBeenCalledWith('gringotts')
  })

  it('should load properly in verification mode with only verification mode', () => {
    expect.assertions(1)
    const config = { mode: VERIFY_MODE }
    const accounts = [{ guid: 'MBR-1' }]
    const institutions = [{ guid: 'INST-1' }]

    FireflyAPI.loadAccounts = jest.fn(() => of({ accounts: [{ guid: 'MBR-1' }] }))
    FireflyAPI.loadInstitutions = jest.fn(() => of([{ guid: 'INST-1' }]))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', {
        a: { type: ActionTypes.LOAD_CONNECT, payload: config },
      })

      expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
        a: loadConnectSuccess({ accounts, institutions, config: { mode: VERIFY_MODE } }),
      })
    })
  })
})

describe('selectInstitution', () => {
  const institution = { guid: 'INST-1' }
  const emptyMemberState = { connect: { members: [] } }
  const memberState = {
    connect: {
      members: [
        { institution_guid: 'INST-1', connection_status: ReadableStatuses.FAILED },
        { institution_guid: 'INST-1', connection_status: ReadableStatuses.PENDING },
      ],
    },
  }

  it('should dispatch selectInstitutionSuccess with showExistingMember and institution', () => {
    expect.assertions(2)

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
      const state = { value: emptyMemberState }

      expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
        a: selectInstitutionSuccess({ institution, showExistingMember: false }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })

  it('should dispatch selectInstitutionSuccess with showExistingMember true if members exist', () => {
    expect.assertions(2)

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
      const state = { value: memberState }

      expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
        a: selectInstitutionSuccess({ institution, showExistingMember: true }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })

  it('it should showExistingMember with a pending member and any other member', () => {
    const pendingState = {
      members: {
        items: [{ institution_guid: 'INST-1', connection_status: ReadableStatuses.PENDING }],
      },
    }

    expect.assertions(2)

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => of(institution))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
      const state = { value: pendingState }

      expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
        a: selectInstitutionSuccess({ institution, showExistingMember: false }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })

  it('should dispatch selectInstitutionError if the request fails', () => {
    expect.assertions(2)

    FireflyAPI.loadInstitutionByGuid = jest.fn(() => throwError({ status: 400 }))

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
      const state = { value: memberState }

      expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
        a: selectInstitutionError({ status: 400 }),
      })
    })

    expect(FireflyAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
  })
})
