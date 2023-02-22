export const ActionTypes = {
  UPDATE_USER_COMMUNICATION_PROFILE: 'usercommunicationprofile/update_user_communication_profile',
  UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS:
    'usercommunicationprofile/update_user_communication_profile_success',
  UPDATE_USER_COMMUNICATION_PROFILE_ERROR:
    'usercommunicationprofile/update_user_communication_profile_error',
}

/*
  userCommunicationProfile should be an object with all the elements of the profile that need to be updated
  and their associated value.
  i.e. { opted_out_of_sms_notifications: false,
         opted_out_of_email_notifications: true }
*/
export const updateUserCommunicationProfile = userCommunicationProfile => ({
  type: ActionTypes.UPDATE_USER_COMMUNICATION_PROFILE,
  payload: userCommunicationProfile,
})
