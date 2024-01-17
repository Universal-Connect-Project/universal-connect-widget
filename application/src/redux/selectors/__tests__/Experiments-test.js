import {
  getExperiments,
  getActiveExperiments,
  getExperimentNamesToUserVariantMap,
} from 'reduxify/selectors/Experiments'

describe('Experiment Selectors', () => {
  const experiment1Features = [
    {
      guid: 'FTR-1',
      name: 'VARIANT_A',
    },
    {
      guid: 'FTR-2',
      name: 'VARIANT_B',
    },
    {
      guid: 'FTR-3',
      name: 'VARIANT_C',
    },
  ]

  const experiment2Features = [
    {
      guid: 'FTR-4',
      name: 'VARIANT_A',
    },
  ]

  const experiments = [
    {
      guid: 'EXP-1',
      features: experiment1Features,
      name: 'EXPERIMENT_1',
      selected_variant: {
        user_feature: { guid: 'URF-1', feature_guid: 'FTR-1' },
      },
      is_active: true,
    },
    {
      guid: 'EXP-2',
      features: experiment2Features,
      selected_variant: {
        user_feature: { guid: 'URF-2', feature_guid: 'FTR-4' },
      },
      is_active: false,
    },
  ]

  const state = {
    experiments: {
      items: experiments,
    },
  }

  describe('getExperiments', () => {
    it('should get the experiments', () => {
      expect(getExperiments(state)).toEqual(experiments)
    })
  })

  describe('getActiveExperiments', () => {
    it('should get the active experiments', () => {
      expect(getActiveExperiments(state)).toEqual([experiments[0]])
    })
  })

  describe('getExperimentNamesToUserVariantMap', () => {
    const ExperimentNamesToVariantMap = {
      EXPERIMENT_1: 'VARIANT_A',
    }

    it('should return an object that maps each Experiment to its Selected Variant', () => {
      expect(getExperimentNamesToUserVariantMap(state)).toEqual(ExperimentNamesToVariantMap)
    })
  })
})
