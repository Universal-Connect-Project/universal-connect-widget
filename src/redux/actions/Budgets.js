import { initiateRequest } from '../../utils/ActionHelpers'

export const ActionTypes = {
  BUDGET_DELETE: 'budgets/budget_delete',
  BUDGET_DELETED: 'budgets/budget_deleted',
  BUDGET_DELETED_ERROR: 'budgets/budget_deleted_error',
  BUDGET_SAVE: 'budgets/budget_save',
  BUDGET_SAVED: 'budgets/budget_saved',
  BUDGET_SAVE_ERROR: 'budgets/budget_save_error',
  BUDGETS_DELETE: 'budgets/budgets_delete',
  BUDGETS_DELETED_SUCCESS: 'budgets/budgets_deleted_success',
  BUDGETS_DELETED_ERROR: 'budgets/budgets_deleted_error',
  BUDGETS_DELETE_THEN_GENERATE: 'budgets/budgets_delete_then_generate',
  BUDGETS_DELETED_THEN_GENERATED_SUCCESS: 'budgets/budgets_deleted_then_generated_success',
  BUDGETS_DELETED_THEN_GENERATED_ERROR: 'budgets/budgets_deleted_then_generated_error',
  BUDGETS_GENERATE: 'budgets/budgets_generate',
  BUDGETS_GENERATED: 'budgets/budgets_generated',
  BUDGETS_GENERATED_ERROR: 'budgets/budgets_generated_error',
  BUDGET_GENERATION_CLEARED: 'budgets/budget_generation_cleared',
  BUDGETS_LOAD: 'budgets/budgets_load',
  BUDGETS_LOADED: 'budgets/budgets_loaded',
  BUDGETS_LOADED_ERROR: 'budgets/budgets_loaded_error',
  BUDGETS_SAVE: 'budgets/budgets_save',
  BUDGETS_SAVE_ERROR: 'budgets/budgets_save_error',
  BUDGETS_SAVE_RECALCULATE: 'budgets/budgets_save_recalculate',
  BUDGETS_SAVE_RECALCULATED_ERROR: 'budgets/budgets_save_recalculated_error',
  BUDGETS_SAVED: 'budgets/budgets_saved',
  BUDGETS_LOADING: 'budgets/budgets_loading',
}

export const clearBudgetGeneration = () => dispatch =>
  dispatch(initiateRequest(ActionTypes.BUDGET_GENERATION_CLEARED))

export const fetchBudgets = () => ({
  type: ActionTypes.BUDGETS_LOAD,
})

export const saveBudget = (newBudget, options = {}) => ({
  type: ActionTypes.BUDGET_SAVE,
  payload: { newBudget, options },
})

export const saveBudgets = budgets => ({
  type: ActionTypes.BUDGETS_SAVE,
  payload: budgets,
})

export const deleteBudget = budget => ({
  type: ActionTypes.BUDGET_DELETE,
  payload: budget,
})

export const deleteBudgets = budgets => ({
  type: ActionTypes.BUDGETS_DELETE,
  payload: budgets,
})

export const deleteBudgetsThenGenerate = budgets => ({
  type: ActionTypes.BUDGETS_DELETE_THEN_GENERATE,
  payload: budgets,
})

export const generateBudgets = () => ({
  type: ActionTypes.BUDGETS_GENERATE,
})

export const saveRecalculatedBudgets = () => ({
  type: ActionTypes.BUDGETS_SAVE_RECALCULATE,
})

export default dispatch => ({
  clearBudgetGeneration: () => dispatch(clearBudgetGeneration()),
  deleteBudget: budget => dispatch(deleteBudget(budget)),
  deleteBudgets: budgets => dispatch(deleteBudgets(budgets)),
  deleteBudgetsThenGenerate: budgets => dispatch(deleteBudgetsThenGenerate(budgets)),
  generateBudgets: () => dispatch(generateBudgets()),
  loadBudgets: () => dispatch(fetchBudgets()), //don't need in Budgets Widget, check if ever used
  saveBudget: (budget, options) => dispatch(saveBudget(budget, options)),
  saveBudgets: budgets => dispatch(saveBudgets(budgets)),
})
