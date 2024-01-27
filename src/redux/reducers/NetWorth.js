import { ActionTypes } from '../actions/NetWorth'
import { createReducer } from '../../utils/Reducer'

const {
  NET_WORTH_ACCOUNT_SELECTED,
  NET_WORTH_DATA_LOADED,
  NET_WORTH_MONTH_OPTION_UPDATED,
  NET_WORTH_MONTH_HIGHLIGHTED,
  NET_WORTH_MONTH_SELECTED,
  NET_WORTH_DATA_LOADING,
  NET_WORTH_SAVE_ACCOUNT_SUCCESS,
} = ActionTypes

import { getSvgScale } from '../../utils/NetWorth'

export const defaultState = {
  loading: true,
  chartHeight: 310,
  dateFormat: 'MMM YYYY',
  highLightedMonth: null,
  margins: {
    bottom: 50,
    left: 65,
    offset: 20,
    right: 40,
    svgScale: getSvgScale(6, ''),
    top: 50,
  },
  members: [],
  numberFormat: '$0,0.00',
  monthlyAccountBalances: [],
  numberOfMonths: 6,
  selectedAccount: {},
  selectedMonth: null,
}

const loadNetWorthData = (state, action) => ({
  ...state,
  loading: false,
  monthlyAccountBalances: action.payload.monthlyAccountBalances,
})

const netWorthDataLoading = state => ({
  ...state,
  loading: true,
})

const updateNetWorthMonthOption = (state, action) => {
  const { margins, numberOfMonths } = action.payload

  return {
    ...state,
    margins,
    numberOfMonths,
  }
}

const updateHighLightedMonth = (state, action) => ({
  ...state,
  highLightedMonth: action.payload,
})

const updateSelectedAccount = (state, action) => ({
  ...state,
  selectedAccount: action.payload.selectedAccount,
})

const updateSelectedMonth = (state, action) => ({
  ...state,
  selectedMonth: action.payload.selectedMonth,
})

const updateAccountBalances = (state, action) => {
  return {
    ...state,
    monthlyAccountBalances: action.payload,
  }
}

export const netWorth = createReducer(defaultState, {
  [NET_WORTH_DATA_LOADED]: loadNetWorthData,
  [NET_WORTH_MONTH_OPTION_UPDATED]: updateNetWorthMonthOption,
  [NET_WORTH_ACCOUNT_SELECTED]: updateSelectedAccount,
  [NET_WORTH_MONTH_HIGHLIGHTED]: updateHighLightedMonth,
  [NET_WORTH_MONTH_SELECTED]: updateSelectedMonth,
  [NET_WORTH_DATA_LOADING]: netWorthDataLoading,
  [NET_WORTH_SAVE_ACCOUNT_SUCCESS]: updateAccountBalances,
})
