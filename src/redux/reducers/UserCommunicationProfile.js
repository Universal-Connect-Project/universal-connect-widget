import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/UserCommunicationProfile'
import { ActionTypes as AppActionTypes } from '../actions/App'
const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes
const { UPDATE_USER_COMMUNICATION_PROFILE, UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS } = ActionTypes

const defaultState = {}

const masterDataLoaded = (state, action) => ({
  ...state,
  ...action.payload?.user_communication_profile,
})
const updateUserCommunicationProfile = (state, action) => ({ ...state, ...action.payload })
const updateUserCommunicationProfileSuccess = (state, action) => ({ ...state, ...action.payload })

const userCommunicationProfile = createReducer(defaultState, {
  [LOAD_MASTER_DATA_SUCCESS]: masterDataLoaded,
  [UPDATE_USER_COMMUNICATION_PROFILE]: updateUserCommunicationProfile,
  [UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS]: updateUserCommunicationProfileSuccess,
})

export { defaultState, userCommunicationProfile }
