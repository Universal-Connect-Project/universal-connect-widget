import { createSelector } from 'reselect'

export const getExperiments = state => state.experiments.items
export const getActiveExperiments = createSelector(getExperiments, experiments =>
  experiments?.filter(experiment => experiment.is_active) || [],
)

/*
  This generates an object that references the name of each experiment to the experiments selected variant.
  { 
    "Experiment Name" : "Feature Name",
    ...
  }
*/
export const getExperimentNamesToUserVariantMap = createSelector(
  getActiveExperiments,
  experiments => {
    return experiments.reduce((acc, experiment) => {
      if (experiment.selected_variant) {
        const selectedVariantFeatureGuid = experiment.selected_variant.user_feature.feature_guid
        // get the variant name
        const feature = experiment.features.find(
          feature => feature.guid === selectedVariantFeatureGuid,
        )

        return { ...acc, [experiment.name]: feature.name }
      }
      return acc
    }, {})
  },
)
