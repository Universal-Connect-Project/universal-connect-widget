import { ActionTypes } from '../actions/Subscriptions'
import { createReducer } from '../../utils/Reducer'

const {
  SUBSCRIPTION_CLEARED,
  SUBSCRIPTIONS_LOADED,
  SUBSCRIPTIONS_LOADING,
  SUBSCRIPTION_SELECTED,
} = ActionTypes

export const defaultState = {
  details: null,
  items: [],
  loading: false,
}

const subscriptionSelected = (state, action) => ({
  ...state,
  details: action.payload.item,
})

const subscriptionCleared = state => ({
  ...state,
  details: null,
})

const subscriptionsLoading = state => ({ ...state, loading: true })

const subscriptionsLoaded = (state, action) => ({
  ...state,
  loading: false,
  items: action.payload.items,
})

export default createReducer(defaultState, {
  [SUBSCRIPTION_CLEARED]: subscriptionCleared,
  [SUBSCRIPTION_SELECTED]: subscriptionSelected,
  [SUBSCRIPTIONS_LOADED]: subscriptionsLoaded,
  [SUBSCRIPTIONS_LOADING]: subscriptionsLoading,
})
