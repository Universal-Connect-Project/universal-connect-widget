import { createReducer } from '../../utils/Reducer'

import { ActionTypes } from '../actions/WidgetProfile'

const { WIDGET_PROFILE_LOADED } = ActionTypes

const widgetProfileLoaded = (state, action) => {
  return { ...state, ...action.payload }
}

export const widgetProfile = createReducer(
  {},
  {
    [WIDGET_PROFILE_LOADED]: widgetProfileLoaded,
  },
)
