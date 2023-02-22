export const ActionTypes = {
  LOAD_MONTHLY_CATEGORY_TOTALS: 'spendingplan/load_category_totals',
  LOAD_MONTHLY_CATEGORY_TOTALS_ERROR: 'spendingplan/load_category_totals_error',
  LOAD_MONTHLY_CATEGORY_TOTALS_SUCCESS: 'spendingplan/load_category_totals_success',
  LOAD_SPENDING_PLAN_ITERATION_ERROR: 'spendingplan/load_iteration_error',
  LOAD_SPENDING_PLAN_ITERATION_SUCCESS: 'spendingplan/load_iteration_success',
  LOAD_SPENDING_PLAN_ITERATION: 'spendingplan/load_iteration',
  LOAD_SPENDING_PLANS_ERROR: 'spendingplan/load_spending_plans_error',
  LOAD_SPENDING_PLANS_SUCCESS: 'spendingplan/load_spending_plans_success',
  LOAD_SPENDING_PLANS: 'spendingplan/load_spending_plans_spending_plans',
  LOAD_SPENDING_PLAN_ERROR: 'spendingplan/load_spending_plan_error',
  LOAD_SPENDING_PLAN_SUCCESS: 'spendingplan/load_spending_plan_success',
  LOAD_SPENDING_PLAN: 'spendingplan/load_spending_plan',
  LOAD_SCHEDULED_PAYMENTS: 'spendingplan/load_scheduled_payments',
  LOAD_SCHEDULED_PAYMENTS_ERROR: 'spendingplan/load_scheduled_payments_error',
  LOAD_SCHEDULED_PAYMENTS_SUCCESS: 'spendingplan/load_scheduled_payments_success',
  LOAD_SPENDING_PLAN_TRANSACTIONS: 'spendingplan/load_spending_plan_transactions',
  LOAD_SPENDING_PLAN_TRANSACTIONS_SUCCESS: 'spendingplan/load_spending_plan_transactions_success',
  LOAD_SPENDING_PLAN_TRANSACTIONS_ERROR: 'spendingplan/load_spending_plan_transactions_error',
  ADD_PLANNED_EXPENSE: 'spendingplan/add_planned_expense',
  ADD_PLANNED_EXPENSE_SUCCESS: 'spendingplan/add_planned_expense_success',
  ADD_PLANNED_EXPENSE_ERROR: 'spendingplan/add_planned_expense_error',
  ADD_RECURRING_EXPENSE: 'spendingplan/add_recurring_expense',
  ADD_RECURRING_EXPENSE_SUCCESS: 'spendingplan/add_recurring_expense_success',
  ADD_RECURRING_EXPENSE_ERROR: 'spendingplan/add_recurring_expense_error',
  ADD_SPENDING_PLAN_ACCOUNT: 'spendingplan/add_spending_plan_account',
  ADD_SPENDING_PLAN_ACCOUNT_SUCCESS: 'spendingplan/add_spending_plan_account_success',
  ADD_SPENDING_PLAN_ACCOUNT_ERROR: 'spendingplan/add_spending_plan_account_error',
  CHANGE_SPENDING_PLAN_ACCOUNT: 'spendingplan/change_spending_plan_account',
  CHANGE_SPENDING_PLAN_ACCOUNT_SUCCESS: 'spendingplan/change_spending_plan_account_success',
  CHANGE_SPENDING_PLAN_ACCOUNT_ERROR: 'spendingplan/change_spending_plan_account_error',
  ADD_SPENDING_PLAN: 'spendingplan/create_spending_plan',
  ADD_SPENDING_PLAN_SUCCESS: 'spendingplan/create_spending_plan_success',
  ADD_SPENDING_PLAN_ERROR: 'spendingplan/create_spending_plan_error',
  REMOVE_PLANNED_EXPENSE: 'spendingplan/remove_planned_expense',
  REMOVE_PLANNED_EXPENSE_SUCCESS: 'spendingplan/remove_planned_expense_success',
  REMOVE_PLANNED_EXPENSE_ERROR: 'spendingplan/remove_planned_expense_error',
  REMOVE_PLANNED_EXPENSE_AND_CATEGORY: 'spendingplan/remove_planned_expense_and_category',
  REMOVE_PLANNED_EXPENSE_AND_CATEGORY_SUCCESS:
    'spendingplan/remove_planned_expense_and_category_success',
  REMOVE_PLANNED_EXPENSE_AND_CATEGORY_ERROR:
    'spendingplan/remove_planned_expense_and_category_error',
  REMOVE_RECURRING_EXPENSE: 'spendingplan/remove_recurring_expense',
  REMOVE_RECURRING_EXPENSE_SUCCESS: 'spendingplan/remove_recurring_expense_success',
  REMOVE_RECURRING_EXPENSE_ERROR: 'spendingplan/remove_recurring_expense_error',
  REMOVE_SPENDING_PLAN_ACCOUNT: 'spendingplan/remove_spending_plan_account',
  REMOVE_SPENDING_PLAN_ACCOUNT_SUCCESS: 'spendingplan/remove_spending_plan_account_success',
  REMOVE_SPENDING_PLAN_ACCOUNT_ERROR: 'spendingplan/remove_spending_plan_account_error',
  UPDATE_PLANNED_EXPENSE: 'spendingplan/update_planned_expense',
  UPDATE_PLANNED_EXPENSE_SUCCESS: 'spendingplan/update_planned_expense_success',
  UPDATE_PLANNED_EXPENSE_ERROR: 'spendingplan/update_planned_expense_error',
}

export const loadMonthlyCategoryTotals = accountGuids => ({
  type: ActionTypes.LOAD_MONTHLY_CATEGORY_TOTALS,
  payload: accountGuids,
})

export const loadSpendingPlans = () => ({ type: ActionTypes.LOAD_SPENDING_PLANS })

export const loadSpendingPlan = guid => ({ type: ActionTypes.LOAD_SPENDING_PLAN, payload: guid })

export const loadSpendingPlanIteration = (guid, iterationNumber = 'current') => ({
  type: ActionTypes.LOAD_SPENDING_PLAN_ITERATION,
  payload: { guid, iterationNumber },
})

export const loadScheduledPayments = () => ({
  type: ActionTypes.LOAD_SCHEDULED_PAYMENTS,
})

export const loadSpendingPlanTransactions = guids => ({
  type: ActionTypes.LOAD_SPENDING_PLAN_TRANSACTIONS,
  payload: { guids },
})

export const addPlannedExpense = (
  spendingPlanGuid,
  iterationNumber,
  categoryGuid,
  amount,
  oneTime,
) => ({
  type: ActionTypes.ADD_PLANNED_EXPENSE,
  payload: { spendingPlanGuid, iterationNumber, categoryGuid, amount, oneTime },
})

export const addRecurringExpense = (spendingPlanGuid, iterationNumber, scheduledPaymentGuid) => ({
  type: ActionTypes.ADD_RECURRING_EXPENSE,
  payload: { spendingPlanGuid, iterationNumber, scheduledPaymentGuid },
})

export const addSpendingPlanAccount = (spendingPlanGuid, accountGuid) => ({
  type: ActionTypes.ADD_SPENDING_PLAN_ACCOUNT,
  payload: { spendingPlanGuid, accountGuid },
})

export const changeSpendingPlanAccount = (
  spendingPlanGuid,
  currentSpendingPlanAccountGuid,
  newAccountGuid,
) => ({
  type: ActionTypes.CHANGE_SPENDING_PLAN_ACCOUNT,
  payload: { spendingPlanGuid, currentSpendingPlanAccountGuid, newAccountGuid },
})

export const addSpendingPlan = iterationInterval => ({
  type: ActionTypes.ADD_SPENDING_PLAN,
  payload: { iterationInterval },
})

export const removePlannedExpense = (spendingPlanGuid, iterationNumber, plannedExpenseGuid) => ({
  type: ActionTypes.REMOVE_PLANNED_EXPENSE,
  payload: { spendingPlanGuid, iterationNumber, plannedExpenseGuid },
})

export const removePlannedExpenseAndCategory = (
  spendingPlanGuid,
  iterationNumber,
  plannedExpenseGuid,
  category,
) => ({
  type: ActionTypes.REMOVE_PLANNED_EXPENSE_AND_CATEGORY,
  payload: { spendingPlanGuid, iterationNumber, plannedExpenseGuid, category },
})

export const removeRecurringExpense = (
  spendingPlanGuid,
  iterationNumber,
  recurringExpenseGuid,
) => ({
  type: ActionTypes.REMOVE_RECURRING_EXPENSE,
  payload: { spendingPlanGuid, iterationNumber, recurringExpenseGuid },
})

export const removeSpendingPlanAccount = (spendingPlanGuid, spendingPlanAccountGuid) => ({
  type: ActionTypes.REMOVE_SPENDING_PLAN_ACCOUNT,
  payload: { spendingPlanGuid, spendingPlanAccountGuid },
})

export const updatePlannedExpense = (
  spendingPlanGuid,
  iterationNumber,
  plannedExpenseGuid,
  amount,
) => ({
  type: ActionTypes.UPDATE_PLANNED_EXPENSE,
  payload: { spendingPlanGuid, iterationNumber, plannedExpenseGuid, amount },
})
