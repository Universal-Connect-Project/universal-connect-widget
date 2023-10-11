import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Connections'

export const defaultState = {
  isConnectionsLoading: true,
  isConnectionsMounted: false,
}

const connectionsUnmounted = state => ({ ...state, isConnectionsMounted: false })

const loadConnections = state => ({
  ...state,
  isConnectionsLoading: true,
  isConnectionsMounted: true,
})
const loadConnectionsSuccess = state => ({ ...state, isConnectionsLoading: false })

export const connections = createReducer(defaultState, {
  [ActionTypes.CONNECTIONS_UNMOUNTED]: connectionsUnmounted,
  [ActionTypes.LOAD_CONNECTIONS]: loadConnections,
  [ActionTypes.LOAD_CONNECTIONS_SUCCESS]: loadConnectionsSuccess,
})
