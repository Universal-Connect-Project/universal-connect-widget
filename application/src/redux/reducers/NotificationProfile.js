import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/NotificationProfile'

const { LOAD_NOTIFICATION_PROFILES_SUCCESS, EDIT_NOTIFICATION_PROFILE_SUCCESS } = ActionTypes

const defaultState = {
  loading: true,
  items: [],
}

const notificationProfilesLoaded = (state, action) => ({
  ...state,
  loading: false,
  items: action.payload.profiles,
})

const notificationProfileEdit = (state, action) => ({
  ...state,
  items: state.items.map(item =>
    item.guid === action.payload.profile.guid ? action.payload.profile : item,
  ),
})

const notificationProfile = createReducer(defaultState, {
  [LOAD_NOTIFICATION_PROFILES_SUCCESS]: notificationProfilesLoaded,
  [EDIT_NOTIFICATION_PROFILE_SUCCESS]: notificationProfileEdit,
})

export { notificationProfile, defaultState }
