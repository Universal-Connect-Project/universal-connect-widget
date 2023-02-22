import { getAccountFilterAppliedGuids } from '../selectors/Accounts'
import { itemsAction, initiateRequest } from '../../utils/ActionHelpers'
import FireflyAPIUtils from '../../utils/FireflyAPI'

export const ActionTypes = {
  MONTHLY_CATEGORY_TOTALS_LOADED: 'monthlycategorytotals/monthly_category_totals_loaded',
  MONTHLY_CATEGORY_TOTALS_LOADING: 'monthlycategorytotals/monthly_category_totals_loading',
}

const fetchMonthlyCategoryTotals = () => dispatch => {
  dispatch(initiateRequest(ActionTypes.MONTHLY_CATEGORY_TOTALS_LOADING))
  return FireflyAPIUtils.loadMonthlyCategoryTotals().then(({ monthly_category_totals }) =>
    dispatch(itemsAction(ActionTypes.MONTHLY_CATEGORY_TOTALS_LOADED, monthly_category_totals)),
  )
}

export const loadMonthlyCategoryTotalsByAppliedAccountGuids = (startDate, endDate) => (
  dispatch,
  getState,
) => {
  const appliedAccountFilterGuids = getAccountFilterAppliedGuids(getState())

  dispatch(initiateRequest(ActionTypes.MONTHLY_CATEGORY_TOTALS_LOADING))
  return FireflyAPIUtils.loadMonthlyCategoryTotalsByAccount(
    startDate,
    endDate,
    appliedAccountFilterGuids,
  ).then(({ monthly_category_totals }) =>
    dispatch(itemsAction(ActionTypes.MONTHLY_CATEGORY_TOTALS_LOADED, monthly_category_totals)),
  )
}

export const dispatcher = dispatch => ({
  loadMonthlyCategoryTotalsByAppliedAccountGuids: (startDate, endDate) =>
    dispatch(loadMonthlyCategoryTotalsByAppliedAccountGuids(startDate, endDate)),
  loadMonthlyCategoryTotals: (startDate, endDate) =>
    dispatch(fetchMonthlyCategoryTotals(startDate, endDate)),
})
