import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Notifications'

const {
  ALL_NOTIFICATIONS_MARKED_AS_READ,
  NOTIFICATION_SAVED,
  NOTIFICATIONS_LOADED,
  NOTIFICATIONS_LOADED_ERROR,
  NOTIFICATIONS_LOADING,
} = ActionTypes

export const defaultState = {
  items: [],
  loading: true,
  loadingError: null,
}

const markAllNotificationsAsRead = state => {
  return {
    ...state,
    items: state.items.map(notification => ({ ...notification, has_been_viewed: true })),
  }
}

const notificationsLoading = state => ({
  ...state,
  loading: true,
  loadingError: null,
})

const notificationsLoaded = (state, action) =>
  updateObject(state, { items: action.payload.items, loading: false })

const notificationsLoadedError = (state, action) => ({
  ...state,
  loading: false,
  loadingError: action.payload.loadingError,
})

const notificationSaved = (state, action) => {
  return updateObject(state, {
    items: [
      ...state.items.filter(({ guid }) => guid !== action.payload.item.guid),
      action.payload.item,
    ],
  })
}

export const notifications = createReducer(defaultState, {
  [ALL_NOTIFICATIONS_MARKED_AS_READ]: markAllNotificationsAsRead,
  [NOTIFICATION_SAVED]: notificationSaved,
  [NOTIFICATIONS_LOADED]: notificationsLoaded,
  [NOTIFICATIONS_LOADED_ERROR]: notificationsLoadedError,
  [NOTIFICATIONS_LOADING]: notificationsLoading,
})
