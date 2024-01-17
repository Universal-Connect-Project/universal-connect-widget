import { experiments as reducer, defaultState } from 'reduxify/reducers/Experiments'
import * as actions from 'reduxify/actions/Experiments'

describe('Experiments reducers', () => {
  const experiments = [
    {
      guid: 'EXP-1',
      name: 'TESTING_SOME_THING',
      features: [{}, {}],
      selected_variant: { user_feature: {} },
      is_active: true,
      assign_variant_immediately: true,
    },
  ]

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('should have a LOAD_EXPERIMENTS reducer that loads the experiments and sets loading to false', () => {
    expect(reducer(defaultState, actions.loadExperiments(experiments))).toEqual({
      loading: false,
      items: experiments,
    })
  })
})
