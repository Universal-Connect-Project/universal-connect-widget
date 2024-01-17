// jest.mock('src/connect/services/api')
// jest.mock('reduxify/Store')
//
// import connectAPI from 'src/connect/services/api'
// import { dispatcher as connectionsDispatcher, ActionTypes } from 'reduxify/actions/Connections'
// import { createReduxActionUtils } from 'src/connect/utilities/Test'
// import Store from 'reduxify/Store'
//
// const { actions, expectDispatch, resetDispatch } = createReduxActionUtils(
//   connectionsDispatcher,
//   Store.getState(),
// )

describe('Connections placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Connections Actions', () => {
//   beforeEach(() => {
//     resetDispatch()
//   })
//   describe('Connections Dispatcher', () => {
//     it('should dispatch connections unmounted', () => {
//       actions.connectionsUnmounted()
//       expectDispatch({ type: ActionTypes.CONNECTIONS_UNMOUNTED })
//     })
//   })
//
//   describe('.syncMember', () => {
//     const member = { guid: 1 }
//
//     it('should call aggregate via connectAPI', () => {
//       expect(connectAPI.aggregate).not.toHaveBeenCalled()
//       actions.syncMember(member.guid)
//       expect(connectAPI.aggregate).toHaveBeenCalled()
//     })
//     it('should fetch member after call', () => {
//       expect.assertions(1)
//       return actions.syncMember(member.guid).then(() => {
//         expectDispatch({
//           type: ActionTypes.MEMBER_LOADED,
//           payload: { item: member },
//         })
//       })
//     })
//   })
// })
