import { ActionTypes } from '../actions/Finstrong'

const {
  LOAD_DISCOVERED_INSTITUTIONS,
  LOAD_DISCOVERED_INSTITUTIONS_SUCCESS,
  LOAD_DISCOVERED_INSTITUTIONS_ERROR,
  FETCH_PEER_SCORE,
  FETCH_PEER_SCORE_SUCCESS,
  FETCH_PEER_SCORE_ERROR,
  FETCH_AVERAGE_HEALTH_SCORES,
  FETCH_AVERAGE_HEALTH_SCORES_SUCCESS,
  FETCH_AVERAGE_HEALTH_SCORES_ERROR,
  FETCH_HEALTH_SCORE,
  FETCH_HEALTH_SCORE_SUCCESS,
  FETCH_HEALTH_SCORE_ERROR,
  CALCULATE_HEALTH_SCORE,
  CALCULATE_HEALTH_SCORE_SUCCESS,
  CALCULATE_HEALTH_SCORE_ERROR,
  FETCH_DEBT_SPEND_TRANSACTIONS,
  FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS,
  FETCH_DEBT_SPEND_TRANSACTIONS_ERROR,
  FETCH_STANDARD_SPEND_TRANSACTIONS,
  FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS,
  FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR,
  FETCH_SPENDING_FEE_TRANSACTIONS,
  FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS,
  FETCH_SPENDING_FEE_TRANSACTIONS_ERROR,
  FETCH_INCOME_TRANSACTIONS,
  FETCH_INCOME_TRANSACTIONS_SUCCESS,
  FETCH_INCOME_TRANSACTIONS_ERROR,
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES,
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS,
  FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR,
  FETCH_HEALTH_SCORE_CHANGE_REPORTS,
  FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS,
  FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR,
  SET_HAS_JUST_FINISHED_ONBOARDING,
  UPDATE_ARIA_LIVE_REGION,
} = ActionTypes

export const defaultState = {
  ariaLiveRegionMessage: '',
  discoveredInstitutions: [],
  discoveredInstitutionsError: null,
  discoveredInstitutionsLoading: false,
  peerScore: {},
  peerScoreError: null,
  peerScoreLoading: false,
  averageHealthScores: [],
  averageHealthScoresLoading: false,
  averageHealthScoreError: null,
  hasJustFinishedOnboarding: false,
  healthScore: {},
  healthScoreLoading: false,
  healthScoreError: null,
  debtSpendTransactions: [],
  debtSpendTransactionsLoading: false,
  debtSpendTransactionsError: null,
  standardSpendTransactions: [],
  standardSpendTransactionsLoading: false,
  standardSpendTransactionsError: null,
  spendingFeeTransactions: [],
  spendingFeeTransactionsLoading: false,
  spendingFeeTransactionsError: null,
  incomeTransactions: [],
  incomeTransactionsLoading: false,
  incomeTransactionsError: null,
  monthlyHealthScoreSummaries: [],
  monthlyHealthScoreSummariesLoading: false,
  monthlyHealthScoreSummariesError: null,
  healthScoreChangeReports: [],
  healthScoreChangeReportsLoading: false,
  healthScoreChangeReportsError: null,
}

const loadDiscoveredInstitutions = (state, action) => {
  return { ...state, discoveredInstitutions: action.payload, discoveredInstitutionsLoading: false }
}

const setDiscoveredInstitutionsLoading = state => {
  return { ...state, discoveredInstitutionsLoading: true }
}

const setDiscoveredInstitutionsError = (state, action) => {
  return {
    ...state,
    discoveredInstitutionsError: action.payload,
    discoveredInstitutionsLoading: false,
  }
}

const setPeerScore = (state, action) => {
  return { ...state, peerScore: action.payload, peerScoreLoading: false }
}

const setPeerScoreLoading = state => {
  return { ...state, peerScoreLoading: true }
}

const setPeerScoreError = (state, action) => {
  return {
    ...state,
    peerScoreError: action.payload,
    peerScoreLoading: false,
  }
}

const setAverageHealthScores = (state, action) => ({
  ...state,
  averageHealthScores: action.payload,
  averageHealthScoresLoading: false,
})

const setAverageHealthScoresLoading = state => ({
  ...state,
  averageHealthScoresLoading: true,
})

const setAverageHealthScoresError = (state, action) => ({
  ...state,
  averageHealthScoresLoading: false,
  averageHealthScoreError: action.payload,
})

const setHealthScore = (state, action) => ({
  ...state,
  healthScore: action.payload,
  healthScoreLoading: false,
})

const setHealthScoreLoading = state => ({
  ...state,
  healthScoreLoading: true,
})

const setHealthScoreError = (state, action) => ({
  ...state,
  healthScoreLoading: false,
  healthScoreError: action.payload,
})

const setDebtSpendTransactions = (state, action) => ({
  ...state,
  debtSpendTransactions: action.payload,
  debtSpendTransactionsLoading: false,
})

const setDebtSpendTransactionsLoading = state => ({
  ...state,
  debtSpendTransactionsLoading: true,
})

const setDebtSpendTransactionsError = (state, action) => ({
  ...state,
  debtSpendTransactionsLoading: false,
  debtSpendTransactionsError: action.payload,
})

const setStandardSpendTransactions = (state, action) => ({
  ...state,
  standardSpendTransactions: action.payload,
  standardSpendTransactionsLoading: false,
})

const setStandardSpendTransactionsLoading = state => ({
  ...state,
  standardSpendTransactionsLoading: true,
})

const setStandardSpendTransactionsError = (state, action) => ({
  ...state,
  standardSpendTransactionsLoading: false,
  standardSpendTransactionsError: action.payload,
})

const setSpendingFeeTransactions = (state, action) => ({
  ...state,
  spendingFeeTransactions: action.payload,
  spendingFeeTransactionsLoading: false,
})

const setSpendingFeeTransactionsLoading = state => ({
  ...state,
  spendingFeeTransactionsLoading: true,
})

const setSpendingFeeTransactionsError = (state, action) => ({
  ...state,
  spendingFeeTransactionsLoading: false,
  spendingFeeTransactionsError: action.payload,
})

const setIncomeTransactions = (state, action) => ({
  ...state,
  incomeTransactions: action.payload,
  incomeTransactionsLoading: false,
})

const setIncomeTransactionsLoading = state => ({
  ...state,
  incomeTransactionsLoading: true,
})

const setIncomeTransactionsError = (state, action) => ({
  ...state,
  incomeTransactionsLoading: false,
  incomeTransactionsError: action.payload,
})

const loadMonthylHealthScoreSummaries = (state, action) => ({
  ...state,
  monthlyHealthScoreSummaries: action.payload,
  monthlyHealthScoreSummariesLoading: false,
})

const loadMonthylHealthScoreSummariesLoading = state => ({
  ...state,
  monthlyHealthScoreSummariesLoading: true,
})

const loadMonthylHealthScoreSummariesError = (state, action) => ({
  ...state,
  monthlyHealthScoreSummariesError: action.payload,
  monthlyHealthScoreSummariesLoading: false,
})

const loadHealthScoreChangeReport = (state, action) => ({
  ...state,
  healthScoreChangeReports: action.payload,
  healthScoreChangeReportsLoading: false,
})

const loadHealthScoreChangeReportLoading = state => ({
  ...state,
  healthScoreChangeReportsLoading: true,
})

const loadHealthScoreChangeReportError = (state, action) => ({
  ...state,
  healthScoreChangeReportsError: action.payload,
  healthScoreChangeReportsLoading: false,
})

const updateAriaLiveRegion = (state, action) => ({
  ...state,
  ariaLiveRegionMessage: action.payload,
})

const setHasJustFinishedOnboarding = state => ({
  ...state,
  hasJustFinishedOnboarding: true,
})

export const finstrong = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_DISCOVERED_INSTITUTIONS:
      return setDiscoveredInstitutionsLoading(state)
    case LOAD_DISCOVERED_INSTITUTIONS_SUCCESS:
      return loadDiscoveredInstitutions(state, action)
    case LOAD_DISCOVERED_INSTITUTIONS_ERROR:
      return setDiscoveredInstitutionsError(state, action)
    case FETCH_PEER_SCORE:
      return setPeerScoreLoading(state)
    case FETCH_PEER_SCORE_SUCCESS:
      return setPeerScore(state, action)
    case FETCH_PEER_SCORE_ERROR:
      return setPeerScoreError(state, action)
    case FETCH_AVERAGE_HEALTH_SCORES:
      return setAverageHealthScoresLoading(state)
    case FETCH_AVERAGE_HEALTH_SCORES_SUCCESS:
      return setAverageHealthScores(state, action)
    case FETCH_AVERAGE_HEALTH_SCORES_ERROR:
      return setAverageHealthScoresError(state, action)
    case FETCH_HEALTH_SCORE:
    case CALCULATE_HEALTH_SCORE:
      return setHealthScoreLoading(state, action)
    case FETCH_HEALTH_SCORE_SUCCESS:
    case CALCULATE_HEALTH_SCORE_SUCCESS:
      return setHealthScore(state, action)
    case FETCH_HEALTH_SCORE_ERROR:
    case CALCULATE_HEALTH_SCORE_ERROR:
      return setHealthScoreError(state, action)
    case FETCH_DEBT_SPEND_TRANSACTIONS:
      return setDebtSpendTransactionsLoading(state, action)
    case FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS:
      return setDebtSpendTransactions(state, action)
    case FETCH_DEBT_SPEND_TRANSACTIONS_ERROR:
      return setDebtSpendTransactionsError(state, action)
    case FETCH_STANDARD_SPEND_TRANSACTIONS:
      return setStandardSpendTransactionsLoading(state, action)
    case FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS:
      return setStandardSpendTransactions(state, action)
    case FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR:
      return setStandardSpendTransactionsError(state, action)
    case FETCH_SPENDING_FEE_TRANSACTIONS:
      return setSpendingFeeTransactionsLoading(state, action)
    case FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS:
      return setSpendingFeeTransactions(state, action)
    case FETCH_SPENDING_FEE_TRANSACTIONS_ERROR:
      return setSpendingFeeTransactionsError(state, action)
    case FETCH_INCOME_TRANSACTIONS:
      return setIncomeTransactionsLoading(state, action)
    case FETCH_INCOME_TRANSACTIONS_SUCCESS:
      return setIncomeTransactions(state, action)
    case FETCH_INCOME_TRANSACTIONS_ERROR:
      return setIncomeTransactionsError(state, action)
    case FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES:
      return loadMonthylHealthScoreSummariesLoading(state)
    case FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS:
      return loadMonthylHealthScoreSummaries(state, action)
    case FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR:
      return loadMonthylHealthScoreSummariesError(state, action)
    case FETCH_HEALTH_SCORE_CHANGE_REPORTS:
      return loadHealthScoreChangeReportLoading(state)
    case FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS:
      return loadHealthScoreChangeReport(state, action)
    case FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR:
      return loadHealthScoreChangeReportError(state, action)
    case SET_HAS_JUST_FINISHED_ONBOARDING:
      return setHasJustFinishedOnboarding(state)
    case UPDATE_ARIA_LIVE_REGION:
      return updateAriaLiveRegion(state, action)
    default:
      return state
  }
}
