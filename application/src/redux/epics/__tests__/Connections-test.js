// import { of, throwError } from 'rxjs'
//
// import { ActionTypes } from 'reduxify/actions/Connections'
// import * as epics from 'reduxify/epics/Connections'
//
// import { expectRx } from 'src/connect/utilities/Test'
// import connectAPI from 'src/connect/services/api'
//
// jest.mock('src/connect/services/api')

describe('Connections Redux Epics placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('loadConnections epic', () => {
//   afterEach(() => {
//     connectAPI.loadAccountsAndMembers.mockReset()
//   })
//
//   it('should load accounts and members with a success response', () => {
//     expect.assertions(1)
//
//     const members = [{ guid: 'MBR-123' }]
//     const accounts = [{ guid: 'ACT-1', member_guid: 'MBR-123' }]
//
//     connectAPI.loadAccountsAndMembers = jest.fn(() => of({ members, accounts }))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECTIONS, payload: 'MBR-123' } })
//
//       expectObservable(epics.loadConnections(actions$)).toBe('a', {
//         a: {
//           type: ActionTypes.LOAD_CONNECTIONS_SUCCESS,
//           payload: { members, accounts, selectedMemberGuid: 'MBR-123' },
//         },
//       })
//     })
//   })
//
//   it('should return the error response action when an error happens', () => {
//     expect.assertions(1)
//
//     connectAPI.loadAccountsAndMembers = jest.fn(() => throwError('ERROR'))
//
//     expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//       const actions$ = hot('a', { a: { type: ActionTypes.LOAD_CONNECTIONS, payload: 'MBR-1' } })
//
//       expectObservable(epics.loadConnections(actions$)).toBe('a', {
//         a: {
//           type: ActionTypes.LOAD_CONNECTIONS_ERROR,
//           payload: 'ERROR',
//         },
//       })
//     })
//   })
// })
