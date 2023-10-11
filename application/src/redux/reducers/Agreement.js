import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Agreement'

const { AGREEMENT_LOADED, AGREEMENT_ERROR } = ActionTypes

const defaultState = {
  details: {},
  error: false,
  loading: true,
}

const agreementLoaded = (state, action) => ({
  ...state,
  details: action.payload.agreement,
  error: false,
  loading: false,
})

const agreementError = state => ({
  ...state,
  error: true,
  loading: false,
})

const agreement = createReducer(defaultState, {
  [AGREEMENT_LOADED]: agreementLoaded,
  [AGREEMENT_ERROR]: agreementError,
})

export { agreement, defaultState }
