import { combineEpics } from 'redux-observable'

import { addManualAccount, updateAccountsExcludedStateForAppliedAccountFilter } from './Accounts'
import {
  createFeatureVisit,
  initializeSession,
  sendAnalyticsEvent,
  sendAnalyticPageview,
  initializePostHog,
} from './Analytics'
import { loadMasterData } from './App'
import { fetchMemberByGuid, fetchMembers, mfaModalSubmit } from './Members'
import { miniSpending } from './MiniSpending'
import {
  loadDiscoveredInstitutions,
  fetchPeerScore,
  fetchHealthScore,
  fetchDebtSpendTransactions,
  fetchStandardSpendTransactions,
  fetchSpendingFeeTransactions,
  fetchIncomeTransactions,
  fetchAverageHealthScores,
  calculateHealthScore,
  fetchMonthlyHealthScoreSummaries,
  fetchHealthScoreChangeReports,
} from './Finstrong'
import {
  fetchGoals,
  fetchCreateGoal,
  fetchDeleteGoal,
  fetchRepositionGoals,
  fetchUpdateGoal,
} from './Goals'
import { loadCashFlowWidgetDataForDateRange, loadCashFlowDataTwelveMonths } from './CashFlow'
import { markAsPaid, refreshCashFlowData, skipEvent } from './CashFlowWidget'
import { getCategoryTotalsByAccounts } from './SpendingWidget'
import { saveEditForm } from './AccountDetailsDrawer'
import { loadNotifications, markAllNotificationsAsRead, saveNotification } from './Notifications'
import { loadNotificationProfile, editNotificationProfile } from './NotificationProfile'
import { fetchSubscriptionsByDateRange } from './Subscriptions'
import {
  createTransactionRule,
  deleteTransactionRule,
  loadTransactionRules,
  saveTransactionRule,
  transactionRuleSaved,
} from './TransactionRules'
import {
  loadTransactionsByDateRangeWithPagination,
  reloadCategoryTotalsOnTransactionChange,
  createManualTransaction,
} from './Transactions'
import { loadAgreement } from './Agreement'
import {
  loadBudgets,
  saveBudget,
  saveBudgets,
  saveRecalculatedBudgets,
  generateBudgets,
  deleteBudget,
  deleteBudgets,
  deleteBudgetsThenGenerate,
  clearOrReset,
  syncBudgetsWithCategories,
  updateBudgetBeingViewed,
} from './Budgets'
import * as connectEpics from '../../connect/epics/Connect'
import { loadConnections } from './Connections'
import { saveCategory, editCategory, deleteCategory, loadCategories } from './Categories'
import { getCategoryTotalsAndMonthlyCategoryTotalsByAccounts } from './CategoryTotals'
import { postMessages } from './PostMessage'
import { loadCategoryTotals } from './CategoryTotals'
import { loadUserFeatures } from './UserFeatures'
import { updateUserProfile } from './UserProfile'
import { updateUser } from './User'
import { loadMonthlyCashFlowProfile, updateMonthlyCashFlowProfile } from './MonthlyCashFlowProfile'
import { updateUserCommunicationProfile } from './UserCommunicationProfile'
import { saveAccountAndLoadMonthlyAccountBalances, updateNetWorthDataOnWebSocket } from './NetWorth'
import { createTagging } from './Tags'
import {
  loadSpendingPlan,
  loadSpendingPlanMonthlyCategoryTotals,
  loadSpendingPlans,
  loadSpendingPlanIteration,
  loadSpendingPlanTransactions,
  loadIterationDataAfterTransactionUpdate,
  loadScheduledPayments,
  addPlannedExpense,
  addRecurringExpense,
  addSpendingPlan,
  addSpendingPlanAccount,
  changeSpendingPlanAccount,
  removePlannedExpense,
  removePlannedExpenseAndCategory,
  removeRecurringExpense,
  removeSpendingPlanAccount,
  updatePlannedExpense,
} from './SpendingPlan'

export const rootEpic = combineEpics(
  addManualAccount,
  calculateHealthScore,
  createFeatureVisit,
  createTransactionRule,
  deleteTransactionRule,
  deleteCategory,
  connectEpics.loadConnect,
  connectEpics.selectInstitution,
  fetchMemberByGuid,
  fetchMembers,
  fetchAverageHealthScores,
  fetchSubscriptionsByDateRange,
  fetchGoals,
  fetchCreateGoal,
  fetchDeleteGoal,
  fetchHealthScore,
  fetchHealthScoreChangeReports,
  fetchDebtSpendTransactions,
  fetchStandardSpendTransactions,
  fetchSpendingFeeTransactions,
  fetchIncomeTransactions,
  fetchPeerScore,
  fetchRepositionGoals,
  fetchUpdateGoal,
  fetchMonthlyHealthScoreSummaries,
  getCategoryTotalsByAccounts,
  getCategoryTotalsAndMonthlyCategoryTotalsByAccounts,
  generateBudgets,
  initializePostHog,
  initializeSession,
  loadAgreement,
  loadBudgets,
  loadCategories,
  loadConnections,
  loadMasterData,
  loadMonthlyCashFlowProfile,
  loadUserFeatures,
  loadDiscoveredInstitutions,
  saveBudget,
  saveBudgets,
  saveRecalculatedBudgets,
  loadCashFlowWidgetDataForDateRange,
  loadCashFlowDataTwelveMonths,
  loadTransactionRules,
  loadTransactionsByDateRangeWithPagination,
  loadNotifications,
  markAllNotificationsAsRead,
  loadNotificationProfile,
  editNotificationProfile,
  markAsPaid,
  mfaModalSubmit,
  miniSpending,
  postMessages,
  refreshCashFlowData,
  saveEditForm,
  saveNotification,
  saveTransactionRule,
  saveCategory,
  sendAnalyticPageview,
  sendAnalyticsEvent,
  skipEvent,
  syncBudgetsWithCategories,
  deleteBudget,
  deleteBudgets,
  deleteBudgetsThenGenerate,
  clearOrReset,
  updateAccountsExcludedStateForAppliedAccountFilter,
  updateBudgetBeingViewed,
  updateMonthlyCashFlowProfile,
  updateUserCommunicationProfile,
  updateUserProfile,
  updateUser,
  loadCategoryTotals,
  reloadCategoryTotalsOnTransactionChange,
  transactionRuleSaved,
  createManualTransaction,
  saveAccountAndLoadMonthlyAccountBalances,
  editCategory,
  createTagging,
  loadSpendingPlan,
  loadSpendingPlanMonthlyCategoryTotals,
  loadSpendingPlans,
  loadSpendingPlanIteration,
  loadSpendingPlanTransactions,
  loadIterationDataAfterTransactionUpdate,
  loadScheduledPayments,
  addPlannedExpense,
  addRecurringExpense,
  addSpendingPlanAccount,
  changeSpendingPlanAccount,
  addSpendingPlan,
  removePlannedExpense,
  removePlannedExpenseAndCategory,
  removeRecurringExpense,
  removeSpendingPlanAccount,
  updatePlannedExpense,
  updateNetWorthDataOnWebSocket,
)
