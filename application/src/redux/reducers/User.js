import { createReducer } from 'utils/Reducer'
import { ActionTypes } from 'reduxify/actions/User'
import { ActionTypes as AppActionTypes } from 'reduxify/actions/App'
import { ActionTypes as UserProfileActionTypes } from 'reduxify/actions/UserProfile'

const { UPDATE_USER, UPDATE_USER_SUCCESS } = ActionTypes

const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes

const defaultState = {
  details: {},
  emailVerificationStep: null,
  healthScoreError: null,
  loading: true,
  healthScoreLoading: false,
  passwordMessage: null,
  passworUpdating: false,
  phoneVerificationStep: null,
  settings: {},
  updating: false,
}

const masterDataLoaded = (state, action) =>
  action.payload.user ? { ...state, details: action.payload.user } : state
const updateUser = state => ({ ...state, updating: true })
const updateUserSuccess = (state, action) => ({
  ...state,
  loading: false,
  updating: false,
  details: action.payload,
})

const user = createReducer(defaultState, {
  [UPDATE_USER]: updateUser,
  [UPDATE_USER_SUCCESS]: updateUserSuccess,
  [LOAD_MASTER_DATA_SUCCESS]: masterDataLoaded,
})

const userProfile = (state = {}, action) => {
  switch (action.type) {
    case UserProfileActionTypes.UPDATE_USER_PROFILE_SUCCESS:
      return action.payload.user_profile

    case AppActionTypes.LOAD_MASTER_DATA_SUCCESS:
      return action.payload.user_profile ? { ...state, ...action.payload.user_profile } : state

    default:
      return state
  }
}

export { defaultState, user, userProfile }
