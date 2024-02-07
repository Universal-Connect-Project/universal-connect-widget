import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  FAYE_ACCOUNTS_UPDATED: 'minispending/faye_accounts_updated',
  FAYE_MONTHLY_CATEGORY_TOTALS_UPDATED: 'minispending/faye_monthly_category_totals_updated',
  NEW_SPENDING_DATA_AVAILABLE: 'minispending/new_spending_data_available',
  SPENDING_DATA_SYNC_COMPLETE: 'minispending/spending_data_sync_complete',
  SYNC_MINI_SPENDING_DATA: 'minispending/sync_mini_spending_data',
}

const spendingDataSyncComplete = (items, startDate, endDate) => ({
  type: ActionTypes.SPENDING_DATA_SYNC_COMPLETE,
  payload: {
    dateRange: { endDate, startDate },
    items,
  },
})

const syncData = (startDate, endDate) => dispatch => {
  dispatch({ type: ActionTypes.SYNC_MINI_SPENDING_DATA })
  FireflyAPI.loadCategoryTotals(startDate, endDate).then(categoryTotals =>
    dispatch(spendingDataSyncComplete(categoryTotals, startDate, endDate)),
  )
}

export const dispatcher = dispatch => ({
  syncData: (startDate, endDate) => dispatch(syncData(startDate, endDate)),
})
