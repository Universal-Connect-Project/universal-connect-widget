import { setupAction, itemAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  END_TOUR: 'tour/end_tour',
  INCREMENT_TOUR: 'tour/increment_tour',
  SET_STEPS_IN_TOUR: 'tour/set_steps_in_tour',
  START_TOUR: 'tour/start_tour',
}

export const dispatcher = dispatch => ({
  endTour: () => dispatch(setupAction(ActionTypes.END_TOUR)),
  incrementTour: () => dispatch(setupAction(ActionTypes.INCREMENT_TOUR)),
  setStepsInTour: steps => dispatch(itemAction(ActionTypes.SET_STEPS_IN_TOUR, { steps })),
  startTour: () => dispatch(setupAction(ActionTypes.START_TOUR)),
})
