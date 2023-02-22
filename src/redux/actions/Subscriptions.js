export const ActionTypes = {
  SUBSCRIPTION_CLEARED: 'subscriptions/subscription_cleared',
  SUBSCRIPTION_SELECTED: 'subscriptions/subscription_selected',
  SUBSCRIPTIONS_LOADED: 'subscriptions/subscriptions_loaded',
  SUBSCRIPTIONS_LOADED_ERROR: 'subscriptions/subscriptions_loaded_error',
  SUBSCRIPTIONS_LOADING: 'subscriptions/subscriptions_loading',
}

export const loadSubscriptionsByDateRange = (startDate, endDate) => ({
  type: ActionTypes.SUBSCRIPTIONS_LOADING,
  payload: { startDate, endDate },
})

export const selectSubscription = subscription => ({
  type: ActionTypes.SUBSCRIPTION_SELECTED,
  payload: { item: subscription },
})

export const clearSubscription = () => ({
  type: ActionTypes.SUBSCRIPTION_CLEARED,
})
