export const ActionTypes = {
  LOAD_MONTHLY_CASH_FLOW: 'monthlycashflowprofile/load_monthly_cash_flow',
  LOAD_MONTHLY_CASH_FLOW_SUCCESS: 'monthlycashflowprofile/load_monthly_cash_flow_success',
  LOAD_MONTHLY_CASH_FLOW_ERROR: 'monthlycashflowprofile/load_monthly_cash_flow_error',
  UPDATE_MONTHLY_CASH_FLOW: 'monthlycashflowprofile/update_monthly_cash_flow',
  UPDATE_MONTHLY_CASH_FLOW_SUCCESS: 'monthlycashflowprofile/update_monthly_cash_flow_success',
  UPDATE_MONTHLY_CASH_FLOW_ERROR: 'monthlycashflowprofile/update_monthly_cash_flow_error',
}

export const loadMonthlyCashFlowProfile = () => ({
  type: ActionTypes.LOAD_MONTHLY_CASH_FLOW,
})

export const updateMonthlyCashFlowProfile = monthlyCashFlow => ({
  type: ActionTypes.UPDATE_MONTHLY_CASH_FLOW,
  payload: monthlyCashFlow,
})

export const dispatcher = dispatch => ({
  loadMonthlyCashFlowProfile: () => dispatch(loadMonthlyCashFlowProfile()),
  updateMonthlyCashFlowProfile: profile => dispatch(updateMonthlyCashFlowProfile(profile)),
})
