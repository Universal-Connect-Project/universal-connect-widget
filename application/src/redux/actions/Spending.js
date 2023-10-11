import { setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  APPLY_SPENDING_ACCOUNT_FILTER: 'spending/apply_spending_account_filter',
  RELOAD_CATEGORY_TOTALS: 'spending/reload_category_totals',
}

/**
 * TODO: Remove 'accounts' default once we are persisting
 * widget specific account filter and caller is providing
 * widgetName argument.
 */
export const spendingApplyAccountFilter = (selectedAccounts, widgetName = 'accounts') => ({
  type: ActionTypes.APPLY_SPENDING_ACCOUNT_FILTER,
  payload: {
    selectedAccounts,
    widgetName,
  },
})

export default dispatch => ({
  applyAccountFilter: (selectedAccounts, widgetName) =>
    dispatch(spendingApplyAccountFilter(selectedAccounts, widgetName)),
  reloadCategoryTotals: () => dispatch(setupAction(ActionTypes.RELOAD_CATEGORY_TOTALS)),
})
