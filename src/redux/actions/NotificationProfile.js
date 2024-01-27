export const ActionTypes = {
  LOAD_NOTIFICATION_PROFILES: 'notificationprofile/load_notification_profiles',
  LOAD_NOTIFICATION_PROFILES_SUCCESS: 'notificationprofile/load_notification_profiles_success',
  LOAD_NOTIFICATION_PROFILES_ERROR: 'notificationprofile/load_notification_profiles_error',
  EDIT_NOTIFICATION_PROFILE: 'notificationprofile/edit_notification_profile',
  EDIT_NOTIFICATION_PROFILE_SUCCESS: 'notificationprofile/edit_notification_profile_success',
  EDIT_NOTIFICATION_PROFILE_ERROR: 'notificationprofile/edit_notification_profile_error',
}

export const loadNotificationProfiles = () => ({ type: ActionTypes.LOAD_NOTIFICATION_PROFILES })
export const editNotificationProfile = profile => ({
  type: ActionTypes.EDIT_NOTIFICATION_PROFILE,
  payload: { profile },
})
