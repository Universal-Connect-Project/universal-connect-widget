import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/CashFlowWidget'

export const defaultState = {
  selectedEvent: null,
  showSkipConfirmation: false,
}

/**
 * Select the given cashflow event. We set the entire object instead of a guid
 * here since the  event may be a projected event, which don't have guids like
 * *actual* events.
 */
const selectCashFlowEvent = (state, action) => ({ ...state, selectedEvent: action.payload })

/**
 * Clear out the selectedEvent
 */
const clearSelectedCashFlowEvent = state => ({ ...state, selectedEvent: null })

/**
 * When a cashflow event is created, we need to update the selected event
 * because we then offer the user the chance to link a transaction to that new
 * event.
 */
const markAsPaidSuccess = (state, action) => ({ ...state, selectedEvent: action.payload })

/**
 * Show and hide the skip confirmation modal
 */
const showSkipConfirmation = state => ({ ...state, showSkipConfirmation: true })
const hideSkipConfirmation = state => ({ ...state, showSkipConfirmation: false })

export const cashFlowWidget = createReducer(defaultState, {
  [ActionTypes.SELECT_CASHFLOW_EVENT]: selectCashFlowEvent,
  [ActionTypes.CLEAR_SELECTED_CASHFLOW_EVENT]: clearSelectedCashFlowEvent,
  [ActionTypes.MARK_EVENT_AS_PAID_SUCCESS]: markAsPaidSuccess,
  [ActionTypes.SHOW_SKIP_CONFIRM_MODAL]: showSkipConfirmation,
  [ActionTypes.HIDE_SKIP_CONFIRM_MODAL]: hideSkipConfirmation,
  [ActionTypes.SKIP_EVENT_SUCCESS]: hideSkipConfirmation,
})
