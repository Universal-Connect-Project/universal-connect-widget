import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Tour'

const { END_TOUR, INCREMENT_TOUR, SET_STEPS_IN_TOUR, START_TOUR } = ActionTypes

export const defaultState = {
  step: 0,
}

const startTour = state => updateObject(state, { step: 1 })

const endTour = state => updateObject(state, { step: 0 })

const setStepsInTour = (state, action) =>
  updateObject(state, { stepsInTour: action.payload.item.steps })

const incrementTour = state =>
  updateObject(state, { step: state.step < state.stepsInTour ? state.step + 1 : 0 })

export const tour = createReducer(defaultState, {
  [END_TOUR]: endTour,
  [INCREMENT_TOUR]: incrementTour,
  [SET_STEPS_IN_TOUR]: setStepsInTour,
  [START_TOUR]: startTour,
})
