export const ActionTypes = {
  LOAD_MASTER_DATA: 'app/load_master_data',
  LOAD_MASTER_DATA_SUCCESS: 'app/load_master_data_success',
  LOAD_MASTER_DATA_ERROR: 'app/load_master_data_error',
  SESSION_IS_TIMED_OUT: 'app/session_is_timed_out',
  HUMAN_EVENT_HAPPENED: 'app/human_event_happened',
}

export const loadMasterData = () => ({
  type: ActionTypes.LOAD_MASTER_DATA,
})

export const loadMasterDataSuccess = response => ({
  type: ActionTypes.LOAD_MASTER_DATA_SUCCESS,
  payload: response,
})

export const loadMasterDataError = err => ({
  type: ActionTypes.LOAD_MASTER_DATA_ERROR,
  payload: err,
})

export const dispatcher = dispatch => ({
  loadMasterData: () => dispatch(loadMasterData()),
  markSessionTimedOut: () => dispatch({ type: ActionTypes.SESSION_IS_TIMED_OUT }),
  handleHumanEvent: () => dispatch({ type: ActionTypes.HUMAN_EVENT_HAPPENED }),
})
