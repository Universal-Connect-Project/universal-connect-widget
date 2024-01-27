export const ActionTypes = {
  ALL_NOTIFICATIONS_MARKED_AS_READ: 'notifications/all_notifications_marked_as_read',
  NOTIFICATION_SAVED: 'notifications/notification_saved',
  NOTIFICATION_SAVE_ERROR: 'notifications/notification_save_error',
  NOTIFICATIONS_LOADED: 'notifications/notifications_loaded',
  NOTIFICATIONS_LOADED_ERROR: 'notifications/notifications_loaded_error',
  NOTIFICATIONS_LOADING: 'notifications/notifications_loading',
  MARK_ALL_NOTIFICATIONS_AS_READ: 'notifications/mark_all_notifications_as_read',
  MARK_ALL_NOTIFICATIONS_AS_READ_ERROR: 'notifications/mark_all_notifications_as_read_error',
  SAVE_NOTIFICATION: 'notifications/save_notification',
}

export const loadNotifications = () => ({ type: ActionTypes.NOTIFICATIONS_LOADING })

export const markAllAsRead = () => ({
  type: ActionTypes.MARK_ALL_NOTIFICATIONS_AS_READ,
})

export const saveNotification = notification => ({
  type: ActionTypes.SAVE_NOTIFICATION,
  payload: notification,
})

export default dispatch => ({
  loadNotifications: () => dispatch(loadNotifications()),
  markAllAsRead: () => dispatch(markAllAsRead()),
  saveNotification: notification => dispatch(saveNotification(notification)),
})
