import { ActionTypes } from '../actions/SpendingPlan'
import { ActionTypes as TransactionActionTypes } from '../actions/Transactions'

const {
  LOAD_MONTHLY_CATEGORY_TOTALS,
  LOAD_MONTHLY_CATEGORY_TOTALS_ERROR,
  LOAD_MONTHLY_CATEGORY_TOTALS_SUCCESS,
  LOAD_SPENDING_PLAN_ERROR,
  LOAD_SPENDING_PLAN_ITERATION_ERROR,
  LOAD_SPENDING_PLAN_ITERATION_SUCCESS,
  LOAD_SPENDING_PLAN_ITERATION,
  LOAD_SPENDING_PLAN_SUCCESS,
  LOAD_SPENDING_PLAN,
  LOAD_SPENDING_PLANS_ERROR,
  LOAD_SPENDING_PLANS_SUCCESS,
  LOAD_SPENDING_PLANS,
  LOAD_SCHEDULED_PAYMENTS,
  LOAD_SCHEDULED_PAYMENTS_ERROR,
  LOAD_SCHEDULED_PAYMENTS_SUCCESS,
  LOAD_SPENDING_PLAN_TRANSACTIONS,
  LOAD_SPENDING_PLAN_TRANSACTIONS_ERROR,
  LOAD_SPENDING_PLAN_TRANSACTIONS_SUCCESS,
  ADD_SPENDING_PLAN_ACCOUNT_SUCCESS,
  ADD_SPENDING_PLAN_SUCCESS,
  CHANGE_SPENDING_PLAN_ACCOUNT_SUCCESS,
} = ActionTypes

export const defaultState = {
  currentSpendingPlan: null,
  iteration: null,
  iterationError: null,
  iterationLoading: false,
  monthlyCategoryTotals: [],
  monthlyCategoryTotalsError: null,
  monthlyCategoryTotalsLoading: false,
  spendingPlan: {},
  spendingPlanError: null,
  spendingPlanLoading: false,
  spendingPlans: [],
  spendingPlansError: null,
  spendingPlansLoading: true,
  scheduledPayments: [],
  scheduledPaymentsError: null,
  scheduledPaymentsLoading: false,
  transactions: [],
  transactionsError: null,
  transactionsLoading: false,
}

const loadMonthlyCategoryTotals = state => ({
  ...state,
  monthlyCategoryTotals: [],
  monthlyCategoryTotalsLoading: true,
})

const loadMonthlyCategoryTotalsSuccess = (state, action) => ({
  ...state,
  monthlyCategoryTotals: action.payload.monthly_category_totals,
  monthlyCategoryTotalsLoading: false,
})

const loadMonthlyCategoryTotalsError = (state, action) => ({
  ...state,
  monthlyCategoryTotalsError: action.payload,
  monthlyCategoryTotalsLoading: false,
})

const loadSpendingPlan = state => ({
  ...state,
  spendingPlanLoading: true,
})

const loadSpendingPlanSuccess = (state, action) => ({
  ...state,
  spendingPlan: action.payload,
  spendingPlanError: null,
  spendingPlanLoading: false,
})

const loadSpendingPlanError = (state, action) => ({
  ...state,
  spendingPlan: {},
  spendingPlanError: action.payload,
  spendingPlanLoading: false,
})

const loadSpendingPlans = state => ({
  ...state,
  spendingPlansLoading: true,
})

const loadSpendingPlansSuccess = (state, action) => ({
  ...state,
  spendingPlans: action.payload,
  spendingPlansError: null,
  spendingPlansLoading: false,
  currentSpendingPlan: action.payload && action.payload.length > 0 ? action.payload[0] : null,
})

const loadSpendingPlansError = (state, action) => ({
  ...state,
  spendingPlans: [],
  spendingPlansError: action.payload,
  spendingPlansLoading: false,
})

const loadSpendingPlanIteration = state => ({
  ...state,
  iterationLoading: true,
})

const loadSpendingPlanIterationSuccess = (state, action) => ({
  ...state,
  iteration: action.payload,
  iterationError: null,
  iterationLoading: false,
})

const loadSpendingPlanIterationError = (state, action) => ({
  ...state,
  iteration: {},
  iterationError: action.payload,
  iterationLoading: false,
})

const loadScheduledPayments = state => ({
  ...state,
  scheduledPaymentsLoading: true,
})

const loadScheduledPaymentsSuccess = (state, action) => ({
  ...state,
  scheduledPayments: action.payload,
  scheduledPaymentsError: null,
  scheduledPaymentsLoading: false,
})

const loadScheduledPaymentsError = (state, action) => ({
  ...state,
  scheduledPayments: [],
  scheduledPaymentsError: action.payload,
  scheduledPaymentsLoading: false,
})

const loadSpendingPlanTransactions = state => ({
  ...state,
  transactionsLoading: true,
})

const loadSpendingPlanTransactionsSuccess = (state, action) => ({
  ...state,
  transactions: action.payload,
  transactionsError: null,
  transactionsLoading: false,
})

const loadSpendingPlanTransactionsError = (state, action) => ({
  ...state,
  transactions: [],
  transactionsError: action.payload,
  transactionsLoading: false,
})

const addSpendingPlan = (state, action) => ({
  ...state,
  // TODO if we are to allow multiple plans, this will need to change to accommodate that
  spendingPlans: [action.payload],
  currentSpendingPlan: action.payload,
})

const addSpendingPlanAccount = (state, action) => ({
  ...state,
  currentSpendingPlan: {
    ...state.currentSpendingPlan,
    spending_plan_accounts: [
      ...state.currentSpendingPlan.spending_plan_accounts,
      action.payload.spending_plan_account,
    ],
  },
})

const changeSpendingPlanAccount = (state, action) => {
  return {
    ...state,
    currentSpendingPlan: {
      ...state.currentSpendingPlan,
      spending_plan_accounts: [action.payload],
    },
  }
}

const updateTransaction = (state, action) => {
  const transaction = action.payload.item

  if (state.spendingPlan.currentSpendingPlan) {
    return {
      ...state,
      transactions: [
        ...state.transactions.filter(txn => txn.guid !== transaction.guid),
        transaction,
      ],
    }
  }

  return { ...state }
}

export const spendingPlan = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_MONTHLY_CATEGORY_TOTALS:
      return loadMonthlyCategoryTotals(state)
    case LOAD_MONTHLY_CATEGORY_TOTALS_ERROR:
      return loadMonthlyCategoryTotalsError(state, action)
    case LOAD_MONTHLY_CATEGORY_TOTALS_SUCCESS:
      return loadMonthlyCategoryTotalsSuccess(state, action)
    case ADD_SPENDING_PLAN_SUCCESS:
      return addSpendingPlan(state, action)
    case LOAD_SPENDING_PLAN:
      return loadSpendingPlan(state)
    case LOAD_SPENDING_PLANS:
      return loadSpendingPlans(state)
    case LOAD_SPENDING_PLAN_ITERATION:
      return loadSpendingPlanIteration(state)
    case LOAD_SPENDING_PLAN_SUCCESS:
      return loadSpendingPlanSuccess(state, action)
    case LOAD_SPENDING_PLANS_SUCCESS:
      return loadSpendingPlansSuccess(state, action)
    case LOAD_SPENDING_PLAN_ITERATION_SUCCESS:
      return loadSpendingPlanIterationSuccess(state, action)
    case LOAD_SPENDING_PLAN_ERROR:
      return loadSpendingPlanError(state, action)
    case LOAD_SPENDING_PLANS_ERROR:
      return loadSpendingPlansError(state, action)
    case LOAD_SPENDING_PLAN_ITERATION_ERROR:
      return loadSpendingPlanIterationError(state, action)
    case LOAD_SCHEDULED_PAYMENTS:
      return loadScheduledPayments(state)
    case LOAD_SCHEDULED_PAYMENTS_ERROR:
      return loadScheduledPaymentsError(state, action)
    case LOAD_SCHEDULED_PAYMENTS_SUCCESS:
      return loadScheduledPaymentsSuccess(state, action)
    case LOAD_SPENDING_PLAN_TRANSACTIONS:
      return loadSpendingPlanTransactions(state)
    case LOAD_SPENDING_PLAN_TRANSACTIONS_SUCCESS:
      return loadSpendingPlanTransactionsSuccess(state, action)
    case LOAD_SPENDING_PLAN_TRANSACTIONS_ERROR:
      return loadSpendingPlanTransactionsError(state, action)
    case ADD_SPENDING_PLAN_ACCOUNT_SUCCESS:
      return addSpendingPlanAccount(state, action)
    case CHANGE_SPENDING_PLAN_ACCOUNT_SUCCESS:
      return changeSpendingPlanAccount(state, action)
    case TransactionActionTypes.TRANSACTION_UPDATED:
      return updateTransaction(state, action)
    default:
      return state
  }
}
