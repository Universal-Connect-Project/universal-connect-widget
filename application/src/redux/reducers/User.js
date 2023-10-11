import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/User'
import { ActionTypes as AppActionTypes } from '../actions/App'
import { ActionTypes as UserProfileActionTypes } from '../actions/UserProfile'

const {
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  EMAIL_VERIFICATION_STEP,
  PHONE_VERIFICATION_STEP,
  PASSWORD_UPDATING,
  PASSWORD_UPDATED,
  PASSWORD_UPDATED_ERROR,
} = ActionTypes

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
const emailVerificationStep = (state, action) => ({
  ...state,
  emailVerificationStep: action.payload.step,
})
const phoneVerificationStep = (state, action) => ({
  ...state,
  phoneVerificationStep: action.payload.step,
})
const passwordUpdating = state => ({ ...state, passwordUpdating: true })
const passwordUpdated = state => ({ ...state, passwordMessage: null, passwordUpdating: false })
const passwordUpdatedError = (state, action) => ({
  ...state,
  passwordMessage: action.payload.error.message,
  passwordUpdating: false,
})

const user = createReducer(defaultState, {
  [UPDATE_USER]: updateUser,
  [UPDATE_USER_SUCCESS]: updateUserSuccess,
  [EMAIL_VERIFICATION_STEP]: emailVerificationStep,
  [LOAD_MASTER_DATA_SUCCESS]: masterDataLoaded,
  [PHONE_VERIFICATION_STEP]: phoneVerificationStep,
  [PASSWORD_UPDATING]: passwordUpdating,
  [PASSWORD_UPDATED]: passwordUpdated,
  [PASSWORD_UPDATED_ERROR]: passwordUpdatedError,
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
