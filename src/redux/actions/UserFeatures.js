export const ActionTypes = {
  LOAD_USER_FEATURES: 'userfeatures/load_user_features',
  LOAD_USER_FEATURES_SUCCESS: 'userfeatures/load_user_features_success',
  LOAD_USER_FEATURES_ERROR: 'userfeatures/load_user_features_error',
}

export const loadUserFeatures = () => ({
  type: ActionTypes.LOAD_USER_FEATURES,
})

export const loadUserFeaturesSuccess = userFeatures => ({
  type: ActionTypes.LOAD_USER_FEATURES_SUCCESS,
  payload: userFeatures,
})

export const loadUserFeaturesError = err => ({
  type: ActionTypes.LOAD_USER_FEATURES_ERROR,
  payload: err,
})
