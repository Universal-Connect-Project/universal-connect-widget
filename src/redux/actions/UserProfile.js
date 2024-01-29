export const ActionTypes = {
  UPDATE_USER_PROFILE: 'userprofile/update_user_profile',
  UPDATE_USER_PROFILE_SUCCESS: 'userprofile/update_user_profile_success',
  UPDATE_USER_PROFILE_ERROR: 'userprofile/update_user_profile_error',
}

export const updateUserProfile = userProfile => ({
  type: ActionTypes.UPDATE_USER_PROFILE,
  payload: userProfile,
})

export const updateUserProfileSuccess = data => ({
  type: ActionTypes.UPDATE_USER_PROFILE_SUCCESS,
  payload: data,
})

export const updateUserProfileError = err => ({
  type: ActionTypes.UPDATE_USER_PROFILE_ERROR,
  payload: err,
})
