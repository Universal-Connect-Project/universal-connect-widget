import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/MobileToken'

const { MOBILE_TOKEN_GENERATED, MOBILE_TOKEN_ERROR, MOBILE_TOKEN_RESET } = ActionTypes

const defaultState = {
  details: {},
  error: false,
  loading: true,
}

const mobileTokenGenerated = (state, action) => ({
  ...state,
  details: action.payload.token,
  error: false,
  loading: false,
})

const mobileTokenError = state => ({
  ...state,
  error: true,
  loading: false,
})

const mobileTokenReset = () => ({
  details: {},
  error: false,
  loading: true,
})

const mobileToken = createReducer(defaultState, {
  [MOBILE_TOKEN_GENERATED]: mobileTokenGenerated,
  [MOBILE_TOKEN_ERROR]: mobileTokenError,
  [MOBILE_TOKEN_RESET]: mobileTokenReset,
})

export { mobileToken, defaultState }
