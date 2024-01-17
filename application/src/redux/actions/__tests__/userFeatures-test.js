import {
  ActionTypes,
  loadUserFeatures,
  loadUserFeaturesSuccess,
  loadUserFeaturesError,
} from 'reduxify/actions/UserFeatures'

describe('UserFeatures Actions', () => {
  describe('loadUserFeatures', () => {
    it('should emit LOAD_USER_FEATURES', () => {
      expect(loadUserFeatures()).toEqual({ type: ActionTypes.LOAD_USER_FEATURES })
    })
  })

  describe('loadUserFeaturesSuccess', () => {
    it('should return an payload of user features', () => {
      expect(loadUserFeaturesSuccess([])).toEqual({
        type: ActionTypes.LOAD_USER_FEATURES_SUCCESS,
        payload: [],
      })
    })
  })

  describe('loadUserFeaturesError', () => {
    it('should return an error on the payload', () => {
      expect(loadUserFeaturesError('Some Error Message')).toEqual({
        type: ActionTypes.LOAD_USER_FEATURES_ERROR,
        payload: 'Some Error Message',
      })
    })
  })
})
