export const ActionTypes = {
  LOAD_EXPERIMENTS: 'experiments/load_experiments',
}

export const loadExperiments = experiments => ({
  type: ActionTypes.LOAD_EXPERIMENTS,
  payload: experiments,
})
