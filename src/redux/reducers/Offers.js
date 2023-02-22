import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Offers'

const { OFFER_DISMISSED, OFFER_LOADED } = ActionTypes

export const defaultState = {
  items: [],
}

const offerLoaded = (state, action) => {
  const { offer, offerType } = action.payload
  const items = offer
    ? [...state.items.filter(item => item.campaign_type !== offerType), offer]
    : [...state.items.filter(item => item.campaign_type !== offerType)]

  return updateObject(state, {
    items,
  })
}

const offerDismissed = (state, action) =>
  updateObject(state, {
    items: state.items.filter(item => item.guid !== action.payload.item.guid),
  })

export const offers = createReducer(defaultState, {
  [OFFER_DISMISSED]: offerDismissed,
  [OFFER_LOADED]: offerLoaded,
})
