import { setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  SELECT_CASHFLOW_EVENT: 'cashflowwidget/select_cashflow_event',
  CLEAR_SELECTED_CASHFLOW_EVENT: 'cashflowwidget/clear_selected_cashflow_event',
  MARK_EVENT_AS_PAID: 'cashflowwidget/mark_event_as_paid',
  MARK_EVENT_AS_PAID_SUCCESS: 'cashflowwidget/mark_event_as_paid_success',
  MARK_EVENT_AS_PAID_ERROR: 'cashflowwidget/mark_event_as_paid_error',
  SHOW_SKIP_CONFIRM_MODAL: 'cashflowwidget/show_skip_confirm_modal',
  HIDE_SKIP_CONFIRM_MODAL: 'cashflowwidget/hide_skip_confirm_modal',
  SKIP_EVENT: 'cashflowwidget/skip_event',
  SKIP_EVENT_SUCCESS: 'cashflowwidget/skip_event_success',
  SKIP_EVENT_ERROR: 'cashflowwidget/skip_event_error',
}

export const markAsPaid = event => setupAction(ActionTypes.MARK_EVENT_AS_PAID, event)

export const skipEvent = event => setupAction(ActionTypes.SKIP_EVENT, event)

export const dispatcher = dispatch => ({
  clearSelectedCashFlowEvent: () =>
    dispatch(setupAction(ActionTypes.CLEAR_SELECTED_CASHFLOW_EVENT)),
  markAsPaid: event => dispatch(markAsPaid(event)),
  selectCashFlowEvent: event => dispatch(setupAction(ActionTypes.SELECT_CASHFLOW_EVENT, event)),
  showSkipConfirmModal: () => dispatch(setupAction(ActionTypes.SHOW_SKIP_CONFIRM_MODAL)),
  hideSkipConfirmModal: () => dispatch(setupAction(ActionTypes.HIDE_SKIP_CONFIRM_MODAL)),
  skipEvent: event => dispatch(skipEvent(event)),
})
