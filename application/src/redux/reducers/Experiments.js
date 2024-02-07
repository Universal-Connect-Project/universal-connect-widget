import { createReducer } from '../../utils/Reducer'

import { ActionTypes } from '../actions/Experiments'

export const defaultState = {
  items: [],
  loading: true,
}

const loadExperiments = (state, action) => ({
  ...state,
  items: action.payload,
  loading: false,
})

export const experiments = createReducer(defaultState, {
  [ActionTypes.LOAD_EXPERIMENTS]: loadExperiments,
})
