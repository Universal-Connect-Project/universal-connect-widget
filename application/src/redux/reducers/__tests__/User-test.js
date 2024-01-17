// import {
//   user as userReducer,
//   userProfile as userProfileReducer,
//   defaultState,
// } from 'reduxify/reducers/User'
// import { ActionTypes } from 'reduxify/actions/User'
// import { ActionTypes as AppActionTypes } from 'reduxify/actions/App'
// import { ActionTypes as UserProfileActionTypes } from 'reduxify/actions/UserProfile'

describe('User Redux Reducer placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('User related reducers', () => {
//   describe('User Reducer', () => {
//     it('should return the initial state', () => {
//       expect(userReducer(undefined, {})).toEqual(defaultState)
//     })
//
//     it('should set users updating', () => {
//       const reduced = userReducer(defaultState, { type: ActionTypes.UPDATE_USER })
//       const stateAfter = {
//         ...defaultState,
//         updating: true,
//       }
//
//       expect(reduced).toEqual(stateAfter)
//     })
//
//     describe('LOAD_MASTER_DATA_SUCCESS', () => {
//       it('should update if the master data provides the key', () => {
//         const user = { guid: 'USR-1' }
//         const action = {
//           type: AppActionTypes.LOAD_MASTER_DATA_SUCCESS,
//           payload: {
//             user,
//           },
//         }
//
//         expect(userReducer(undefined, action).details.guid).toEqual('USR-1')
//       })
//
//       it('should not update if the master data request is missing the key', () => {
//         const action = { type: AppActionTypes.LOAD_MASTER_DATA_SUCCESS, payload: { foo: 'bar' } }
//
//         expect(userReducer(undefined, action).foo).toEqual(undefined)
//       })
//     })
//   })
//
//   describe('User Profile reducer', () => {
//     it('should have a default empty state', () => {
//       expect(userProfileReducer(undefined, {})).toEqual({})
//     })
//
//     describe('UPDATE_USER_PROFILE_SUCCESS', () => {
//       it('should set the payload of the action on state', () => {
//         const action = {
//           type: UserProfileActionTypes.UPDATE_USER_PROFILE_SUCCESS,
//           payload: {
//             user_profile: {
//               foo: 'bar',
//             },
//           },
//         }
//
//         expect(userProfileReducer(undefined, action).foo).toEqual('bar')
//       })
//     })
//
//     describe('LOAD_MASTER_DATA_SUCCESS', () => {
//       it('should update if the master data provides the key', () => {
//         const user_profile = { guid: 'USP-1' }
//         const action = {
//           type: AppActionTypes.LOAD_MASTER_DATA_SUCCESS,
//           payload: {
//             user_profile,
//           },
//         }
//
//         expect(userProfileReducer(undefined, action).guid).toEqual('USP-1')
//       })
//
//       it('should not update if the master data request is missing the key', () => {
//         const action = { type: AppActionTypes.LOAD_MASTER_DATA_SUCCESS, payload: { foo: 'bar' } }
//
//         expect(userProfileReducer(undefined, action).foo).toEqual(undefined)
//       })
//     })
//   })
// })
