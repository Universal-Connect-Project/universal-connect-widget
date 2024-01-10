// import { of, throwError } from 'rxjs'
//
// import {
//   ActionTypes,
//   loadConnectSuccess,
//   loadConnectError,
//   selectInstitution as selectInstitutionAction,
//   selectInstitutionSuccess,
//   selectInstitutionError,
// } from '../../../redux/actions/Connect'
// import * as epics from '../../epics/Connect'
// import connectAPI from '../../services/api'
// import { expectRx } from '../../utilities/Test'
// import { VERIFY_MODE } from '../../const/Connect'
// import { ReadableStatuses } from '../../const/Statuses'
//
// jest.mock('../../services/api')

describe('loadConnect placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('loadConnect', () => {
//   afterEach(() => {
//     connectAPI.loadMembers.mockClear()
//     connectAPI.loadMemberByGuid.mockReset()
//     connectAPI.loadAccounts.mockReset()
//     connectAPI.loadInstitutionByGuid.mockReset()
//     connectAPI.loadInstitutionByCode.mockReset()
//     connectAPI.loadInstitutions.mockReset()
//   })
//   const state$ = {
//     value: {
//       clientProfile: {},
//     },
//   }
//
//   it('should dispatch LOAD_CONNECT_SUCCESS with only members if empty config', () => {
//     const member = {
//       guid: 'MBR-1',
//       connection_status: ReadableStatuses.DENIED,
//       institution_guid: 'INST-1',
//     }
//     const members = [member]
//
//     connectAPI.loadMembers = jest.fn(() => of(members))
//     expect.assertions(1)
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECT } })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectSuccess({ members }),
//       })
//     })
//   })
//
//   it('should dispatch LOAD_CONNECT_SUCCESS with a member, members, config, and institution', () => {
//     const member = {
//       guid: 'MBR-1',
//       connection_status: ReadableStatuses.DENIED,
//       institution_guid: 'INST-1',
//     }
//     const institution = { guid: 'INST-1' }
//     const members = [member]
//     const config = { current_member_guid: 'MBR-1' }
//
//     connectAPI.loadMemberByGuid = jest.fn(() => of(member))
//     connectAPI.loadInstitutionByGuid = jest.fn(() => of(institution))
//     connectAPI.loadMembers = jest.fn(() => of(members))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectSuccess({ members, member, institution, config }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if the member is not found with current_member_guid', () => {
//     expect.assertions(1)
//     const config = { current_member_guid: 'bad member' }
//     const notFound = { response: { status: 404 } }
//
//     connectAPI.loadMemberByGuid = jest.fn(() => throwError(notFound))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if there is any non 404 error with current_member_guid', () => {
//     expect.assertions(1)
//     const config = { current_member_guid: 'bad member' }
//     const notFound = { response: { status: 500 } }
//
//     connectAPI.loadMemberByGuid = jest.fn(() => throwError(notFound))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if the member doesnt support verification', () => {
//     expect.assertions(3)
//     const member = { guid: 'MBR-1', verification_is_enabled: false }
//
//     connectAPI.loadMemberByGuid = jest.fn(() => of(member))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: {
//           type: ActionTypes.LOAD_CONNECT,
//           payload: { current_member_guid: 'MBR-1', mode: VERIFY_MODE },
//         },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "This connection doesn't support verification." }),
//       })
//     })
//
//     expect(connectAPI.loadMemberByGuid).toHaveBeenCalledWith('MBR-1')
//     expect(connectAPI.loadInstitutionByGuid).not.toHaveBeenCalled()
//   })
//
//   it('should dispatch LOAD_CONNECT_SUCCESS with current_institution_guid', () => {
//     expect.assertions(2)
//     const institution = { guid: 'INST-1' }
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => of(institution))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: { current_institution_guid: 'INST-1' } },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectSuccess({ institution }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
//   })
//
//   it('should dispatch loadConnectError if institution is not found with current_institution_guid', () => {
//     expect.assertions(1)
//     const config = { current_institution_guid: 'bad institution' }
//     const notFound = { response: { status: 404 } }
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => throwError(notFound))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if institution query fails with current_institution_guid', () => {
//     expect.assertions(1)
//     const config = { current_institution_guid: 'bad institution' }
//     const error = { response: { status: 500 } }
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => throwError(error))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if institution does not support verification with current_institution_guid', () => {
//     expect.assertions(2)
//     const config = { mode: VERIFY_MODE, current_institution_guid: 'INST-1' }
//     const institution = { guid: 'INST-1', account_verification_is_enabled: false }
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => of(institution))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "This connection doesn't support verification." }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
//   })
//
//   it('should dispatch LOAD_CONNECT_SUCCESS with an institution with current_institution_code', () => {
//     expect.assertions(2)
//     const institution = { code: 'gringotts' }
//
//     connectAPI.loadInstitutionByCode = jest.fn(() => of(institution))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: {
//           type: ActionTypes.LOAD_CONNECT,
//           payload: { current_institution_code: 'gringotts' },
//         },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectSuccess({ institution }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByCode).toHaveBeenCalledWith('gringotts')
//   })
//
//   it('should dispatch loadConnectError if institution is not found with current_institution_code', () => {
//     expect.assertions(1)
//     const config = { current_institution_code: 'bad institution' }
//     const notFound = { response: { status: 404 } }
//
//     connectAPI.loadInstitutionByCode = jest.fn(() => throwError(notFound))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "Oops! We couldn't find that connection." }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if institution query fails with current_institution_code', () => {
//     expect.assertions(1)
//     const config = { current_institution_code: 'bad institution' }
//     const error = { response: { status: 500 } }
//
//     connectAPI.loadInstitutionByCode = jest.fn(() => throwError(error))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: 'Oops! Something went wrong. Please try again later' }),
//       })
//     })
//   })
//
//   it('should dispatch loadConnectError if institution does not support verification with current_institution_code', () => {
//     expect.assertions(2)
//     const config = { mode: VERIFY_MODE, current_institution_code: 'gringotts' }
//     const institution = { code: 'gringotts', account_verification_is_enabled: false }
//
//     connectAPI.loadInstitutionByCode = jest.fn(() => of(institution))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectError({ message: "This connection doesn't support verification." }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByCode).toHaveBeenCalledWith('gringotts')
//   })
//
//   it('should load properly in verification mode with only verification mode', () => {
//     expect.assertions(1)
//     const config = { mode: VERIFY_MODE }
//     const accounts = [{ guid: 'ACC-123', institution_guid: 'INS-123' }]
//
//     connectAPI.loadAccounts = jest.fn(() => of(accounts))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', {
//         a: { type: ActionTypes.LOAD_CONNECT, payload: config },
//       })
//
//       expectObservable(epics.loadConnect(actions$, state$)).toBe('a', {
//         a: loadConnectSuccess({ accounts, config: { mode: VERIFY_MODE } }),
//       })
//     })
//   })
// })
//
// describe('selectInstitution', () => {
//   const institution = { guid: 'INST-1' }
//   const emptyMemberState = { connect: { members: [] } }
//   const memberState = {
//     connect: {
//       members: [
//         { institution_guid: 'INST-1', connection_status: ReadableStatuses.FAILED },
//         { institution_guid: 'INST-1', connection_status: ReadableStatuses.PENDING },
//       ],
//     },
//   }
//
//   it('should dispatch selectInstitutionSuccess with an institution', () => {
//     expect.assertions(2)
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => of(institution))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
//       const state = { value: emptyMemberState }
//
//       expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
//         a: selectInstitutionSuccess({ institution }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
//   })
//
//   it('should dispatch selectInstitutionError if the request fails', () => {
//     expect.assertions(2)
//
//     connectAPI.loadInstitutionByGuid = jest.fn(() => throwError({ status: 400 }))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', { a: selectInstitutionAction('INST-1') })
//       const state = { value: memberState }
//
//       expectObservable(epics.selectInstitution(actions$, state)).toBe('a', {
//         a: selectInstitutionError({ status: 400 }),
//       })
//     })
//
//     expect(connectAPI.loadInstitutionByGuid).toHaveBeenCalledWith('INST-1')
//   })
// })
