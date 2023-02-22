import { ActionTypes } from '../actions/Banner'
import { createReducer, updateObject } from '../../utils/Reducer'

export const defaultState = {}

const campaignLoaded = (state, action) => updateObject(state, action.payload.item)

export const banner = createReducer(defaultState, {
  [ActionTypes.CAMPAIGN_LOADED]: campaignLoaded,
})
