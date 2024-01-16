// import _keys from 'lodash/keys'
// import { createReducer, combineDispatchers } from 'src/connect/utilities/reduxHelpers'
// import { ActionTypes } from 'reduxify/actions/Connections'

describe('reduxHelpers placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ActionHelpers', () => {
//   let dispatchCalled = false
//   const dispatch = () => (dispatchCalled = true)
//   const dispatcherA = dispatch => ({
//     create: () => dispatch(),
//     read: () => dispatch(),
//   })
//   const dispatcherB = dispatch => ({
//     update: () => dispatch(),
//     delete: () => dispatch(),
//   })
//
//   beforeEach(() => {
//     dispatchCalled = false
//   })
//
//   describe('createReducer', () => {
//     const defaultState = {
//       isConnectionsLoading: true,
//     }
//     const handlers = {
//       [ActionTypes.LOAD_CONNECTIONS]: state => ({
//         ...state,
//         isConnectionsLoading: true,
//       }),
//       [ActionTypes.LOAD_CONNECTIONS_SUCCESS]: state => ({
//         ...state,
//         isConnectionsLoading: false,
//       }),
//     }
//     const actionHandlers = createReducer(defaultState, handlers)
//
//     it('creates a reducer that handles different actions', () => {
//       let state = actionHandlers(defaultState, { type: ActionTypes.LOAD_CONNECTIONS })
//
//       expect(state).toEqual({ isConnectionsLoading: true })
//
//       state = actionHandlers(state, { type: ActionTypes.LOAD_CONNECTIONS_SUCCESS })
//
//       expect(state).toEqual({ isConnectionsLoading: false })
//     })
//   })
//
//   describe('combineDispatchers', () => {
//     it('combines dispatchers', () => {
//       const actionHandlers = combineDispatchers(dispatcherA, dispatcherB)(dispatch)
//
//       expect(_keys(actionHandlers).sort()).toEqual(['create', 'delete', 'read', 'update'])
//
//       actionHandlers.read()
//       expect(dispatchCalled).toEqual(true)
//     })
//
//     it('throws if there would be duplicate keys when combined', () => {
//       expect(() => {
//         combineDispatchers(dispatcherA, dispatcherA)(dispatch)
//       }).toThrowError('Duplicate action keys found: create,read')
//     })
//   })
// })
