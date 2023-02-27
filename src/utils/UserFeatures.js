import _find from 'lodash/find'

export const findEnabledFeature = (userFeatures, featureName) => {
  return _find(userFeatures, { feature_name: featureName, is_enabled: true })
}

export const isFeatureEnabled = (userFeatures, featureName) => {
  return !!findEnabledFeature(userFeatures, featureName)
}

// chooses a feature that should be assigned to a user randomly and returns the feature
// features should include a `traffic_percentage` that indicates their weight
export const chooseExperimentFeatureRandomly = features => {
  let choice = Math.random()
  // make sure that the features coming are valid
  const validFeatures = features.filter(feature => feature.traffic_percentage)
  /* 
  The percentages coming in with the experiments won't necessarily add up to 100
  so they need to be normalized. They are normalized by adding all the percentages up
  and dividing each percentage by the total.

  if traffic_percentages coming in we 80, 100 and 30, `maxPercent` would be 210
  and the `percentBuckets` would be [.38, .48, .14] which add up to 1.
  */
  const maxPercent = validFeatures.reduce((acc, feature) => acc + feature.traffic_percentage, 0)
  const percentBuckets = validFeatures.map(feature => feature.traffic_percentage / maxPercent)

  /*
    if we move from left to right across the example buckets above and 
    subtract the percentage from the random choice. i.e `choice -= percentBuckets[i]`
    The choice will be < one of the buckets. This is the index in the features to choose.
  */
  for (let featureIndex = 0; featureIndex < percentBuckets.length; featureIndex++) {
    if (choice < percentBuckets[featureIndex]) {
      return validFeatures[featureIndex]
    }
    choice -= percentBuckets[featureIndex]
  }

  // there are 0 valid features
  return null
}
