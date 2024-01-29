export const ActionTypes = {
  LOAD_DISCOVERED_INSTITUTIONS: 'finstrong/load_discovered_institutions',
  LOAD_DISCOVERED_INSTITUTIONS_SUCCESS: 'finstrong/load_discovered_institutions_success',
  LOAD_DISCOVERED_INSTITUTIONS_ERROR: 'finstrong/load_discovered_institutions_error',
  FETCH_PEER_SCORE: 'finstrong/fetch_peer_score',
  FETCH_PEER_SCORE_SUCCESS: 'finstrong/fetch_peer_score_success',
  FETCH_PEER_SCORE_ERROR: 'finstrong/fetch_peer_score_error',
  FETCH_AVERAGE_HEALTH_SCORES: 'finstrong/fetch_average_health_scores',
  FETCH_AVERAGE_HEALTH_SCORES_SUCCESS: 'finstrong/fetch_average_health_scores_success',
  FETCH_AVERAGE_HEALTH_SCORES_ERROR: 'finstrong/fetch_average_health_scores_error',
  FETCH_HEALTH_SCORE: 'finstrong/fetch_health_score',
  FETCH_HEALTH_SCORE_SUCCESS: 'finstrong/fetch_health_score_success',
  FETCH_HEALTH_SCORE_ERROR: 'finstrong/fetch_health_score_error',
  CALCULATE_HEALTH_SCORE: 'finstrong/calculate_health_score',
  CALCULATE_HEALTH_SCORE_SUCCESS: 'finstrong/calculate_health_score_success',
  CALCULATE_HEALTH_SCORE_ERROR: 'finstrong/calculate_health_score_error',
  FETCH_DEBT_SPEND_TRANSACTIONS: 'finstrong/fetch_debt_spend_transactions',
  FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS: 'finstrong/fetch_debt_spend_transactions_success',
  FETCH_DEBT_SPEND_TRANSACTIONS_ERROR: 'finstrong/fetch_debt_spend_transactions_error',
  FETCH_STANDARD_SPEND_TRANSACTIONS: 'finstrong/fetch_standard_spend_transactions',
  FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS: 'finstrong/fetch_standard_spend_transactions_success',
  FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR: 'finstrong/fetch_standard_spend_transactions_error',
  FETCH_SPENDING_FEE_TRANSACTIONS: 'finstrong/fetch_spending_fee_transactions',
  FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS: 'finstrong/fetch_spending_fee_transactions_success',
  FETCH_SPENDING_FEE_TRANSACTIONS_ERROR: 'finstrong/fetch_spending_fee_transactions_error',
  FETCH_INCOME_TRANSACTIONS: 'finstrong/fetch_income_transactions',
  FETCH_INCOME_TRANSACTIONS_SUCCESS: 'finstrong/fetch_income_transactions_success',
  FETCH_INCOME_TRANSACTIONS_ERROR: 'finstrong/fetch_income_transactions_error',
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES: 'finstrong/fetch_monthy_health_score_summaries',
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS:
    'finstrong/fetch_monthy_health_score_summaries_success',
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR: 'finstrong/fetch_monthy_health_score_summaries_error',
  FETCH_HEALTH_SCORE_CHANGE_REPORTS: 'finstrong/fetch_health_score_change_reports',
  FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS: 'finstrong/fetch_health_score_change_reports_success',
  FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR: 'finstrong/fetch_health_score_change_reports_error',
  SET_HAS_JUST_FINISHED_ONBOARDING: 'finstrong/set_has_just_finished_onboarding',
  UPDATE_ARIA_LIVE_REGION: 'finstrong/update_aria_live_region',
}

export const loadDiscoveredInstitutions = () => ({
  type: ActionTypes.LOAD_DISCOVERED_INSTITUTIONS,
})

export const loadDiscoveredInstitutionsSuccess = institutions => ({
  type: ActionTypes.LOAD_DISCOVERED_INSTITUTIONS_SUCCESS,
  payload: institutions,
})

export const loadDiscoveredInstitutionsError = err => ({
  type: ActionTypes.LOAD_DISCOVERED_INSTITUTIONS_ERROR,
  payload: err,
})

export const fetchPeerScore = () => ({
  type: ActionTypes.FETCH_PEER_SCORE,
})

export const fetchPeerScoreSuccess = peerScore => ({
  type: ActionTypes.FETCH_PEER_SCORE_SUCCESS,
  payload: peerScore,
})

export const fetchPeerScoreError = err => ({
  type: ActionTypes.FETCH_PEER_SCORE_ERROR,
  payload: err,
})

export const fetchAverageHealthScores = () => ({
  type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES,
})

export const fetchAverageHealthScoresSuccess = healthScores => ({
  type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES_SUCCESS,
  payload: healthScores,
})

export const fetchAverageHealthScoresError = err => ({
  type: ActionTypes.FETCH_AVERAGE_HEALTH_SCORES_ERROR,
  payload: err,
})

export const fetchHealthScore = () => ({
  type: ActionTypes.FETCH_HEALTH_SCORE,
})

export const fetchHealthScoreSuccess = healthScore => ({
  type: ActionTypes.FETCH_HEALTH_SCORE_SUCCESS,
  payload: healthScore,
})

export const fetchHealthScoreError = err => ({
  type: ActionTypes.FETCH_HEALTH_SCORE_ERROR,
  payload: err,
})

export const calculateHealthScore = () => ({
  type: ActionTypes.CALCULATE_HEALTH_SCORE,
})

export const calculateHealthScoreSuccess = score => ({
  type: ActionTypes.CALCULATE_HEALTH_SCORE_SUCCESS,
  payload: score,
})

export const calculateHealthScoreError = err => ({
  type: ActionTypes.CALCULATE_HEALTH_SCORE_ERROR,
  payload: err,
})

export const fetchDebtSpendTransactions = () => ({
  type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS,
})

export const fetchDebtSpendTransactionsSuccess = debtSpendTransactions => ({
  type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS,
  payload: debtSpendTransactions,
})

export const fetchDebtSpendTransactionsError = err => ({
  type: ActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_ERROR,
  payload: err,
})

export const fetchStandardSpendTransactions = () => ({
  type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS,
})

export const fetchStandardSpendTransactionsSuccess = standardSpendTransactions => ({
  type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS,
  payload: standardSpendTransactions,
})

export const fetchStandardSpendTransactionsError = err => ({
  type: ActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR,
  payload: err,
})

export const fetchSpendingFeeTransactions = () => ({
  type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS,
})

export const fetchSpendingFeeTransactionsSuccess = spendingFeeTransactions => ({
  type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS,
  payload: spendingFeeTransactions,
})

export const fetchSpendingFeeTransactionsError = err => ({
  type: ActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_ERROR,
  payload: err,
})

export const fetchIncomeTransactions = () => ({
  type: ActionTypes.FETCH_INCOME_TRANSACTIONS,
})

export const fetchIncomeTransactionsSuccess = incomeTransactions => ({
  type: ActionTypes.FETCH_INCOME_TRANSACTIONS_SUCCESS,
  payload: incomeTransactions,
})

export const fetchIncomeTransactionsError = err => ({
  type: ActionTypes.FETCH_INCOME_TRANSACTIONS_ERROR,
  payload: err,
})

export const fetchMonthlyHealthScoreSummaries = () => ({
  type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES,
})

export const fetchMonthlyHealthScoreSummariesSuccess = monthylHealthScoreSummaries => ({
  type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS,
  payload: monthylHealthScoreSummaries,
})

export const fetchMonthlyHealthScoreSummariesError = err => ({
  type: ActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR,
  payload: err,
})

export const fetchHealthScoreChangeReports = () => ({
  type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS,
})

export const fetchHealthScoreChangeReportsSuccess = healthScoreChangeReports => ({
  type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS,
  payload: healthScoreChangeReports,
})

export const fetchHealthScoreChangeReportsError = err => ({
  type: ActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR,
  payload: err,
})

export const updateAriaLiveRegion = msg => ({
  type: ActionTypes.UPDATE_ARIA_LIVE_REGION,
  payload: msg,
})

export const setHasJustFinishedOnboarding = () => ({
  type: ActionTypes.SET_HAS_JUST_FINISHED_ONBOARDING,
})
