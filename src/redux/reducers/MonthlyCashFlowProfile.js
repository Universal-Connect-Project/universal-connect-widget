import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/MonthlyCashFlowProfile'

const {
  LOAD_MONTHLY_CASH_FLOW_SUCCESS,
  LOAD_MONTHLY_CASH_FLOW,
  UPDATE_MONTHLY_CASH_FLOW_SUCCESS,
} = ActionTypes

export const defaultState = {
  loading: true,
  item: {},
}

const loadMonthlyCashFlowProfile = state => ({ ...state, loading: true })

const loadMonthlyCashFlowProfileSuccess = (state, action) => ({
  ...state,
  item: action.payload,
  loading: false,
})

const updateMonthyCashFlowProfileSuccess = (state, action) => ({
  ...state,
  item: action.payload,
  loading: false,
})

export const monthlyCashFlowProfile = createReducer(defaultState, {
  [LOAD_MONTHLY_CASH_FLOW]: loadMonthlyCashFlowProfile,
  [LOAD_MONTHLY_CASH_FLOW_SUCCESS]: loadMonthlyCashFlowProfileSuccess,
  [UPDATE_MONTHLY_CASH_FLOW_SUCCESS]: updateMonthyCashFlowProfileSuccess,
})
