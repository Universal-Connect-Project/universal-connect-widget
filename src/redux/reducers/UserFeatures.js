import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/UserFeatures'

const { LOAD_USER_FEATURES, LOAD_USER_FEATURES_SUCCESS } = ActionTypes

export const defaultState = {
  loading: false,
  items: [],
}

const loadUserFeatures = state => ({ ...state, loading: true })
const loadUserFeaturesSuccess = (state, action) => ({
  ...state,
  items: action.payload.user_features,
  loading: false,
})

export const userFeatures = createReducer(defaultState, {
  [LOAD_USER_FEATURES]: loadUserFeatures,
  [LOAD_USER_FEATURES_SUCCESS]: loadUserFeaturesSuccess,
})
