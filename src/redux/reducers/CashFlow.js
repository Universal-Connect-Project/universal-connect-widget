import moment from 'moment'
import _isNil from 'lodash/isNil'
import getUnixTime from 'date-fns/getUnixTime'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'

import { ActionTypes } from '../actions/CashFlow'
import { createReducer, updateObject } from '../../utils/Reducer'

const {
  CASH_FLOW_ACCOUNT_OPTION_FILTERS_UPDATED,
  CASH_FLOW_DATE_RANGE_UPDATED,
  CASH_FLOW_DATE_RANGE_TWELVE_MONTHS_UPDATED,
  CLEAR_CASH_FLOW_SEQUENCE,
  EDIT_CASH_FLOW_SEQUENCE,
  LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_SUCCESS,
  LOAD_CASH_FLOW_DATA,
  LOAD_CASH_FLOW_DATA_TWELVE_MONTHS,
  LOAD_CASH_FLOW_DATA_SUCCESS,
  SET_CASH_FLOW_SEQUENCE_ATTRIBUTES,
} = ActionTypes

const defaultSequence = {
  account_guid: null,
  amount: '',
  category_guid: null,
  description: null,
  end_date: null,
  name: '',
  repeat_day: moment().format('D'),
  repeat_interval: null,
  repeat_month: null,
  repeat_week: null,
  repeat_weekday: null,
  repeat_year: null,
  start_date: moment().unix(),
  transaction_type: 2,
}

export const defaultState = {
  accountOptionFilters: [],
  actualEvents: [],
  cashFlowDailyAccountBalances: {},
  cashFlowDataTwelveMonthsLoading: false,
  cashFlowEvents: [],
  cashFlowProjectedEvents: [],
  cashFlowSequences: [],
  dateRange: {
    direction: 'next',
    selectedEndDate: moment()
      .utc()
      .endOf('day')
      .add(15, 'days')
      .unix(),
    selectedStartDate: moment()
      .utc()
      .startOf('day')
      .subtract(15, 'days')
      .unix(),
  },
  historicalAccountBalances: [],
  loading: true,
  projectedEvents: [],
  selectedStartDateTwelveMonths: getUnixTime(startOfMonth(new Date())),
  selectedEndDateTwelveMonths: getUnixTime(endOfMonth(new Date())),
  sequence: updateObject({}, defaultSequence),
  sequences: [],
}

const cashFlowAccountOptionFiltersUpdated = (state, action) => ({
  ...state,
  ...action.payload.items,
})

const cashFlowDateRangeUpdated = (state, action) => ({ ...state, dateRange: action.payload.item })

const cashFlowDateRangeTwelveMonthsUpdated = (state, action) => ({
  ...state,
  selectedStartDateTwelveMonths: action.payload.selectedStartDateTwelveMonths,
  selectedEndDateTwelveMonths: action.payload.selectedEndDateTwelveMonths,
})

const cashFlowLoading = state => ({ ...state, loading: true })

const cashFlowWidgetDataLoaded = (state, action) => ({
  ...state,
  ...action.payload.items,
  loading: false,
  dateRange: _isNil(action.payload.dateRange) ? state.dateRange : action.payload.dateRange,
})

const clearCashFlowSequence = state => updateObject(state, { sequence: defaultSequence })

const editCashFlowSequence = (state, action) =>
  updateObject(state, { sequence: action.payload.item })

const setCashFlowSequenceAttributes = (state, action) =>
  updateObject(state, { sequence: updateObject(state.sequence, action.payload.item) })

const loadCashFlowDataTwelveMonths = state => ({
  ...state,
  cashFlowDataTwelveMonthsLoading: true,
})

const loadCashFlowDataTwelveMonthsSuccess = (state, action) => ({
  ...state,
  cashFlowDataTwelveMonthsLoading: false,
  cashFlowDailyAccountBalances: action.payload.cashFlowDailyAccountBalances,
  cashFlowEvents: action.payload.cashFlowEvents,
  cashFlowProjectedEvents: action.payload.cashFlowProjectedEvents,
  cashFlowSequences: action.payload.cashFlowSequences,
})

export const cashFlow = createReducer(defaultState, {
  [CASH_FLOW_ACCOUNT_OPTION_FILTERS_UPDATED]: cashFlowAccountOptionFiltersUpdated,
  [CASH_FLOW_DATE_RANGE_UPDATED]: cashFlowDateRangeUpdated,
  [CASH_FLOW_DATE_RANGE_TWELVE_MONTHS_UPDATED]: cashFlowDateRangeTwelveMonthsUpdated,
  [CLEAR_CASH_FLOW_SEQUENCE]: clearCashFlowSequence,
  [EDIT_CASH_FLOW_SEQUENCE]: editCashFlowSequence,
  [LOAD_CASH_FLOW_DATA]: cashFlowLoading,
  [LOAD_CASH_FLOW_DATA_TWELVE_MONTHS]: loadCashFlowDataTwelveMonths,
  [LOAD_CASH_FLOW_DATA_SUCCESS]: cashFlowWidgetDataLoaded,
  [LOAD_CASH_FLOW_DATA_TWELVE_MONTHS_SUCCESS]: loadCashFlowDataTwelveMonthsSuccess,
  [SET_CASH_FLOW_SEQUENCE_ATTRIBUTES]: setCashFlowSequenceAttributes,
})
