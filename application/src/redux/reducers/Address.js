import { createReducer } from '../../utils/Reducer'

import { ActionTypes as AppActionTypes } from '../actions/App'

const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes

const masterDataLoaded = (state, action) =>
  action.payload.address ? { ...state, ...action.payload.address } : state

export const address = createReducer(
  {},
  {
    [LOAD_MASTER_DATA_SUCCESS]: masterDataLoaded,
  },
)
