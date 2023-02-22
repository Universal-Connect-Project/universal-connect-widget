export const ActionTypes = {
  WIDGET_PROFILE_LOADED: 'widgetprofile/widget_profile_loaded',
}

const widgetProfileLoaded = config => dispatch =>
  dispatch({
    type: ActionTypes.WIDGET_PROFILE_LOADED,
    payload: config,
  })

export const dispatcher = dispatch => ({
  widgetProfileLoaded: config => dispatch(widgetProfileLoaded(config)),
})
