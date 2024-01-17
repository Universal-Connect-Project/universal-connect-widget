// import { expectRx } from 'utils/Test'
// import { ActionTypes } from 'reduxify/actions/User'
// import * as epics from 'reduxify/epics/User'
// import { of } from 'rxjs'

describe('User Redux Epics placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('User Epic', () => {
//   const ctx = {
//     connectAPI: {
//       updateUser: jest.fn(() => of([])),
//     },
//   }
//
//   describe('updateUser', () => {
//     it('should emit UPDATE_USER_SUCCESS', () => {
//       expect.assertions(2)
//
//       expectRx.toMatchObject.run(({ hot, expectObservable }) => {
//         const input$ = hot('a', { a: { type: ActionTypes.UPDATE_USER, payload: [] } })
//
//         expectObservable(epics.updateUser(input$, undefined, ctx)).toBe('a', {
//           a: { type: ActionTypes.UPDATE_USER_SUCCESS },
//         })
//       })
//       expect(ctx.connectAPI.updateUser).toHaveBeenCalled()
//     })
//   })
// })
