import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Holdings'

const { HOLDING_SAVED, HOLDINGS_LOADING, HOLDINGS_LOADED } = ActionTypes

export const defaultState = {
  loading: true,
  items: [],
}

const holdingsLoading = state => updateObject(state, { loading: true })

const holdingsLoaded = (state, action) => {
  return updateObject(state, {
    items: action.payload.items.map(h => {
      if (h.name || h.description) {
        return h
      }

      //Name and Description should never both be empty,
      //bad agg data forces this update to be necessary
      return { ...h, name: 'Unknown', description: 'Unknown' }
    }),
    loading: false,
  })
}

const holdingSaved = (state, action) => {
  return updateObject(state, {
    items: [
      ...state.items.filter(({ guid }) => guid !== action.payload.details.guid),
      action.payload.details,
    ],
  })
}

export const holdings = createReducer(defaultState, {
  [HOLDING_SAVED]: holdingSaved,
  [HOLDINGS_LOADED]: holdingsLoaded,
  [HOLDINGS_LOADING]: holdingsLoading,
})
