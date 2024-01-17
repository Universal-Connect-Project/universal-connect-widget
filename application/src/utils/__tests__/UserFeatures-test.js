import * as UserFeatures from 'utils/UserFeatures'

describe('UserFeatures', () => {
  const disabledFeature = {
    guid: 'UFR-2',
    feature_guid: 'FTR-2',
    feature_name: 'MATCH',
    is_enabled: false,
    user_guid: 'USR-1',
  }
  const enabledFeature = {
    guid: 'UFR-1',
    feature_guid: 'FTR-1',
    feature_name: 'MATCH',
    is_enabled: true,
    user_guid: 'USR-1',
  }

  const enabledFeatureAlt = {
    guid: 'UFR-3',
    feature_guid: 'FTR-3',
    feature_name: 'ALT',
    is_enabled: true,
    user_guid: 'USR-1',
  }

  describe('findEnabledFeature', () => {
    it('should only find user features that are enabled and match the name', () => {
      expect(UserFeatures.findEnabledFeature([enabledFeature, disabledFeature], 'MATCH')).toEqual(
        enabledFeature,
      )
    })
  })

  describe('isFeatureEnabled', () => {
    it('should return true if the feature is found and enabled', () => {
      expect(UserFeatures.isFeatureEnabled([enabledFeatureAlt, disabledFeature], 'ALT')).toEqual(
        true,
      )
    })

    it('should return false if the feature is not found at all', () => {
      expect(
        UserFeatures.isFeatureEnabled([enabledFeatureAlt, disabledFeature], 'SOMETHING_ELSE'),
      ).toEqual(false)
    })

    it('should return false if the feature is found but not enabled', () => {
      expect(UserFeatures.isFeatureEnabled([enabledFeatureAlt, disabledFeature], 'MATCH')).toEqual(
        false,
      )
    })
  })

  describe('chooseExperimentFeatureRandomly', () => {
    const SET_RANDOM_VALUE_HIGH = 0.6
    const SET_RANDOM_VALUE_LOW = 0.4
    const feature = {
      guid: 'FTR-1',
      traffic_percentage: 50,
    }

    const feature_2 = {
      guid: 'FTR-2',
      traffic_percentage: 50,
    }

    const validFeatures = [feature, feature_2]

    afterEach(() => {
      global.Math.random.mockRestore()
    })
    it('should return the 1st feature if value is in bottom bucket', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(SET_RANDOM_VALUE_LOW)
      expect(UserFeatures.chooseExperimentFeatureRandomly(validFeatures)).toMatchObject(feature)
    })

    it('should return the 2nd feature if value is in top bucket', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(SET_RANDOM_VALUE_HIGH)
      expect(UserFeatures.chooseExperimentFeatureRandomly(validFeatures)).toMatchObject(feature_2)
    })

    it('should return null if no features are valid', () => {
      const invalidFeatures = [
        { ...feature, traffic_percentage: null },
        { ...feature_2, traffic_percentage: null },
      ]

      jest.spyOn(global.Math, 'random').mockReturnValue(SET_RANDOM_VALUE_LOW)
      expect(UserFeatures.chooseExperimentFeatureRandomly(invalidFeatures)).toBe(null)
    })

    it('should return valid feature if some features are valid', () => {
      const someValidFeatures = [{ ...feature, traffic_percentage: null }, feature_2]

      jest.spyOn(global.Math, 'random').mockReturnValue(SET_RANDOM_VALUE_LOW)
      expect(UserFeatures.chooseExperimentFeatureRandomly(someValidFeatures)).toMatchObject(
        feature_2,
      )
    })
  })
})
