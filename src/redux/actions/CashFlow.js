import { itemAction, itemsAction, setupAction } from '../../utils/ActionHelpers'
import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  CASH_FLOW_ACCOUNT_OPTION_FILTERS_UPDATED: 'cashflow/cash_flow_account_option_filters_updated',
  CASH_FLOW_DATE_RANGE_UPDATED: 'cashflow/cash_flow_date_range_updated',
  CASH_FLOW_DATE_RANGE_TWELVE_MONTHS_UPDATED: 'cashflow/cash_flow_date_range_twelve_months_updated',
  LOAD_CASH_FLOW_DATA: 'cashflow/load_cash_flow_data',
  LOAD_CASH_FLOW_DATA_SUCCESS: 'cashflow/load_cash_flow_data_success',
  LOAD_CASH_FLOW_DATA_ERROR: 'cashflow/load_cash_flow_data_error',
  LOAD_CASH_FLOW_DATA_TWELVE_MONTHS: 'cashflow/load_cash_flow_data_twelve_months',
  LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_SUCCESS: 'cashflow/load_cash_flow_data_twelve_months_success',
  LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_ERROR: 'cashflow/load_cash_flow_data_twelve_months_error',
  CLEAR_CASH_FLOW_SEQUENCE: 'cashflow/clear_cash_flow_sequence',
  EDIT_CASH_FLOW_SEQUENCE: 'cashflow/edit_cash_flow_sequence',
  SET_CASH_FLOW_SEQUENCE_ATTRIBUTES: 'cashflow/set_cash_flow_sequence_attributes',
}

const clearCashflowSequence = () => ({
  type: ActionTypes.CLEAR_CASH_FLOW_SEQUENCE,
})

const editCashFlowSequence = sequence => itemAction(ActionTypes.EDIT_CASH_FLOW_SEQUENCE, sequence)

export const loadCashFlowData = (accounts, dateRange) =>
  setupAction(ActionTypes.LOAD_CASH_FLOW_DATA, { accounts, dateRange })

const createCashFlowEvent = event => () => {
  return FireflyAPI.createCashflowEvent(event)
}

const createCashFlowSequence = sequence => () => {
  return FireflyAPI.createCashflowSequence(sequence)
}

const deleteCashFlowEvent = eventGuid => () => {
  return FireflyAPI.deleteCashflowEvent(eventGuid)
}

const deleteCashFlowSequence = sequenceGuid => () => {
  return FireflyAPI.deleteCashflowSequence(sequenceGuid)
}

const endCashflowSequence = sequence => () => {
  return FireflyAPI.endCashflowSequence(sequence)
}

const saveCashFlowSequence = sequence => () => {
  return FireflyAPI.saveCashflowSequence(sequence)
}

const updateCashFlowEvent = event => () => {
  return FireflyAPI.updateCashflowEvent(event)
}

const updateCashFlowSequence = sequence => () => {
  return FireflyAPI.updateCashflowSequence(sequence)
}

const setCashFlowSequenceAttributes = attributes =>
  itemAction(ActionTypes.SET_CASH_FLOW_SEQUENCE_ATTRIBUTES, attributes)

const updateAccountOptionFilters = accountOptionFilters =>
  itemsAction(ActionTypes.CASH_FLOW_ACCOUNT_OPTION_FILTERS_UPDATED, accountOptionFilters)

const updateCashFlowDateRange = range => ({
  type: ActionTypes.CASH_FLOW_DATE_RANGE_UPDATED,
  payload: { item: range },
})

const updateCashFlowDateRangeTwelveMonths = range => ({
  type: ActionTypes.CASH_FLOW_DATE_RANGE_TWELVE_MONTHS_UPDATED,
  payload: range,
})

const loadCashFlowDataTwelveMonths = () => ({
  type: ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS,
})

const loadCashFlowDataTwelveMonthsSuccess = responses => ({
  type: ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_SUCCESS,
  payload: responses,
})

const loadCashFlowDataTwelveMonthsError = err => ({
  type: ActionTypes.LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_ERROR,
  payload: err,
})

export default dispatch => ({
  clearCashFlowSequence: () => dispatch(clearCashflowSequence()),
  createCashFlowEvent: event => dispatch(createCashFlowEvent(event)),
  createCashFlowSequence: (accounts, dateRange, sequence, transaction) =>
    dispatch(createCashFlowSequence(accounts, dateRange, sequence, transaction)),
  deleteCashFlowEvent: eventGuid => dispatch(deleteCashFlowEvent(eventGuid)),
  deleteCashFlowSequence: sequenceGuid => dispatch(deleteCashFlowSequence(sequenceGuid)),
  editCashFlowSequence: sequence => dispatch(editCashFlowSequence(sequence)),
  endCashFlowSequence: sequence => dispatch(endCashflowSequence(sequence)),
  loadCashFlowWidgetDataForDateRange: (accounts, categories, dateRange) =>
    dispatch(loadCashFlowData(accounts, categories, dateRange)),
  saveCashFlowSequence: sequence => dispatch(saveCashFlowSequence(sequence)),
  setCashFlowSequenceAttributes: attributes => dispatch(setCashFlowSequenceAttributes(attributes)),
  updateAccountOptionFilters: accountOptionFilters =>
    dispatch(updateAccountOptionFilters(accountOptionFilters)),
  updateCashFlowDateRange: range => dispatch(updateCashFlowDateRange(range)),
  updateCashFlowDateRangeTwelveMonths: range =>
    dispatch(updateCashFlowDateRangeTwelveMonths(range)),
  updateCashFlowEvent: event => dispatch(updateCashFlowEvent(event)),
  updateCashFlowSequence: sequence => dispatch(updateCashFlowSequence(sequence)),
  loadCashFlowDataTwelveMonths: () => dispatch(loadCashFlowDataTwelveMonths()),
  loadCashFlowDataTwelveMonthsSuccess: responses =>
    dispatch(loadCashFlowDataTwelveMonthsSuccess(responses)),
  loadCashFlowDataTwelveMonthsError: error => dispatch(loadCashFlowDataTwelveMonthsError(error)),
})
